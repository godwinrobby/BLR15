<?php
declare(strict_types=1);

/**
 * BLR15 PHP API — front controller.
 *
 * Routes (extensionless, rewritten here by .htaccess or router.php):
 *   GET  /api/health             → service status
 *   GET  /api/smtp-config        → current SMTP configuration (no password)
 *   POST /api/send-enquiry-email → customer confirmation + admin lead alert (PHPMailer)
 *   POST /api/save-smtp-config   → persist SMTP settings to ../.smtp-config.json
 *   POST /api/test-smtp          → verify SMTP credentials & send a test email
 *   GET/POST/PUT/DELETE /api/enquiries[/{id}] → live CRM enquiry store (JSON file)
 *   GET/PUT /api/staff           → live staff roster store (JSON file)
 */

require __DIR__ . '/bootstrap.php';
require __DIR__ . '/store.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function resolve_route(): string
{
    if (isset($_GET['route'])) {
        return trim((string) $_GET['route'], '/');
    }
    if (!empty($_SERVER['PATH_INFO'])) {
        return trim($_SERVER['PATH_INFO'], '/');
    }
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
    $pos = strpos($uri, '/api/');
    if ($pos !== false) {
        return trim(substr($uri, $pos + 5), '/');
    }
    $segment = trim($uri, '/');
    if ($segment !== '' && !str_contains($segment, '.')) {
        return $segment;
    }
    return '';
}

function require_method(string $method): void
{
    if (strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET') !== $method) {
        json_out(['success' => false, 'error' => "Method not allowed. Use {$method}."], 405);
    }
}

// ---------------------------------------------------------------
// 1) Health / discovery
// ---------------------------------------------------------------
function handle_health(): never
{
    json_out([
        'status' => 'ok',
        'service' => 'BLR15 PHP API',
        'mailer' => 'PHPMailer ' . PHPMailer\PHPMailer\PHPMailer::VERSION,
        'time' => gmdate('Y-m-d\TH:i:s\Z'),
    ]);
}

// ---------------------------------------------------------------
// 2) GET /api/smtp-config — parity with server.ts GET handler
// ---------------------------------------------------------------
function handle_smtp_config(): never
{
    $config = get_smtp_config();
    json_out([
        'configured' => (bool) ($config['user'] !== '' && $config['pass'] !== ''),
        'host' => $config['host'],
        'port' => $config['port'],
        'secure' => $config['secure'],
        'user' => $config['user'],
        'from' => $config['from'],
        'adminEmail' => $config['adminEmail'],
    ]);
}

// ---------------------------------------------------------------
// 3) POST /api/send-enquiry-email — parity with server.ts handler
// ---------------------------------------------------------------
function handle_send_enquiry(): never
{
    $body = read_json_body();
    $enquiry = $body['enquiry'] ?? null;
    if (!is_array($enquiry)) {
        json_out(['success' => false, 'error' => 'Enquiry payload is required'], 400);
    }

    $email = trim((string) ($enquiry['email'] ?? ''));
    if ($email === '') {
        json_out(['success' => false, 'error' => 'Customer email address is required'], 400);
    }
    $fullName = trim((string) ($enquiry['customerName'] ?? ''));
    if ($fullName === '') {
        json_out(['success' => false, 'error' => 'Customer name is required'], 400);
    }

    $firstName = explode(' ', $fullName)[0];
    $config = get_smtp_config();
    $adminEmail = $config['adminEmail'];

    $customerHtml = render_template('customer-confirmation', ['enquiry' => $enquiry, 'firstName' => $firstName]);
    $adminHtml = render_template('admin-alert', ['enquiry' => $enquiry, 'office' => BLR15_OFFICE]);

    // No SMTP credentials yet → simulated dispatch (parity with nodemailer jsonTransport).
    if ($config['user'] === '' || $config['pass'] === '') {
        json_out([
            'success' => true,
            'isSimulated' => true,
            'customerEmailSent' => true,
            'adminEmailSent' => true,
            'customerEmail' => $email,
            'adminEmail' => $adminEmail,
        ]);
    }

    $id = (string) ($enquiry['id'] ?? '');
    $mail = create_phpmailer($config);

    try {
        deliver($mail, $email, "✅ Your BLR15 Home Loan Enquiry Received (#{$id}) — We Will Call You Shortly", $customerHtml);
    } catch (Throwable $error) {
        json_out(['success' => false, 'error' => $error->getMessage()], 500);
    }

    try {
        deliver($mail, $adminEmail, "🚨 New BLR15 Home Loan Lead — {$fullName}", $adminHtml);
    } catch (Throwable $error) {
        json_out([
            'success' => false,
            'error' => $error->getMessage(),
            'customerEmailSent' => true,
            'adminEmail' => $adminEmail,
        ], 500);
    }

    json_out([
        'success' => true,
        'isSimulated' => false,
        'customerEmailSent' => true,
        'adminEmailSent' => true,
        'customerEmail' => $email,
        'adminEmail' => $adminEmail,
    ]);
}

// ---------------------------------------------------------------
// 4) POST /api/save-smtp-config — parity with server.ts handler
// ---------------------------------------------------------------
function handle_save_smtp_config(): never
{
    $body = read_json_body();
    $updated = save_smtp_config($body);

    json_out([
        'success' => true,
        'config' => [
            'host' => $updated['host'],
            'port' => $updated['port'],
            'secure' => $updated['secure'],
            'user' => $updated['user'],
            'from' => $updated['from'],
            'adminEmail' => $updated['adminEmail'],
        ],
    ]);
}

// ---------------------------------------------------------------
// 5) POST /api/test-smtp — parity with server.ts handler
// ---------------------------------------------------------------
function handle_test_smtp(): never
{
    $body = read_json_body();
    $config = get_smtp_config();

    foreach (['host', 'port', 'secure', 'user', 'pass', 'from'] as $key) {
        if (!array_key_exists($key, $body) || $body[$key] === null) {
            continue;
        }
        $config[$key] = $body[$key];
    }
    $config['port'] = (int) $config['port'];
    $config['secure'] = (bool) $config['secure'];
    $config['host'] = (string) $config['host'];
    $config['user'] = (string) $config['user'];
    $config['pass'] = (string) $config['pass'];
    $config['from'] = (string) $config['from'];

    $recipient = trim((string) ($body['toEmail'] ?? ''));
    if ($recipient === '') {
        $recipient = $config['user'];
    }
    if ($recipient === '') {
        $recipient = $config['adminEmail'];
    }
    if ($recipient === '') {
        json_out(['success' => false, 'error' => 'Recipient email address is required'], 400);
    }

    // No credentials → simulated verification (parity with nodemailer jsonTransport).
    if ($config['user'] === '' || $config['pass'] === '') {
        json_out([
            'success' => true,
            'message' => "SMTP test email successfully sent to {$recipient}!",
            'messageId' => simulated_message_id(),
            'isSimulated' => true,
        ]);
    }

    $timestamp = gmdate('Y-m-d\TH:i:s.v\Z');
    $html = render_template('smtp-test', ['cfg' => $config, 'timestamp' => $timestamp]);

    try {
        $mail = create_phpmailer($config);
        deliver($mail, $recipient, '✅ BLR15 Home Loans - SMTP Test Verification', $html);
    } catch (Throwable $error) {
        json_out([
            'success' => false,
            'error' => $error->getMessage() ?: 'Failed to connect to SMTP server. Please verify your credentials and port.',
        ], 400);
    }

    json_out([
        'success' => true,
        'message' => "SMTP test email successfully sent to {$recipient}!",
        'messageId' => simulated_message_id(),
    ]);
}

// ---------------------------------------------------------------
// 6) /api/enquiries — live CRM store backing the /admin portal
// ---------------------------------------------------------------
function method_not_allowed(array $allow): never
{
    header('Allow: ' . implode(', ', $allow));
    json_out([
        'success' => false,
        'error' => 'Method not allowed. Allowed: ' . implode(', ', $allow),
    ], 405);
}

function find_enquiry_index(array $list, string $id): ?int
{
    foreach ($list as $index => $item) {
        if ((string) ($item['id'] ?? '') === $id) {
            return $index;
        }
    }
    return null;
}

function handle_enquiries(string $method, ?string $pathId): never
{
    $list = read_collection('enquiries');

    switch ($method) {
        case 'GET':
            if ($pathId !== null) {
                $index = find_enquiry_index($list, $pathId);
                if ($index === null) {
                    json_out(['success' => false, 'error' => "Enquiry not found: {$pathId}"], 404);
                }
                json_out(['success' => true, 'data' => $list[$index]]);
            }
            json_out(['success' => true, 'count' => count($list), 'data' => $list]);

        case 'POST':
            if ($pathId !== null) {
                method_not_allowed(['GET', 'PUT', 'DELETE']);
            }
            $payload = read_json_body();
            if (trim((string) ($payload['customerName'] ?? '')) === '') {
                json_out(['success' => false, 'error' => 'Customer name is required'], 400);
            }
            if (trim((string) ($payload['mobile'] ?? '')) === '') {
                json_out(['success' => false, 'error' => 'Mobile number is required'], 400);
            }
            $record = build_new_enquiry($payload, $list);
            array_unshift($list, $record);
            write_collection('enquiries', $list);
            json_out(['success' => true, 'data' => $record], 201);

        case 'PUT':
            $payload = read_json_body();
            $id = $pathId ?? trim((string) ($payload['id'] ?? ''));
            if ($id === '') {
                json_out(['success' => false, 'error' => 'Enquiry id is required'], 400);
            }
            $index = find_enquiry_index($list, $id);
            if ($index === null) {
                json_out(['success' => false, 'error' => "Enquiry not found: {$id}"], 404);
            }
            $record = build_updated_enquiry($payload, $list[$index]);
            $list[$index] = $record;
            write_collection('enquiries', $list);
            json_out(['success' => true, 'data' => $record]);

        case 'DELETE':
            $id = $pathId ?? trim((string) ($_GET['id'] ?? ''));
            if ($id === '') {
                json_out(['success' => false, 'error' => 'Enquiry id is required'], 400);
            }
            $index = find_enquiry_index($list, $id);
            if ($index === null) {
                json_out(['success' => false, 'error' => "Enquiry not found: {$id}"], 404);
            }
            unset($list[$index]);
            write_collection('enquiries', array_values($list));
            json_out(['success' => true, 'deleted' => $id]);

        default:
            method_not_allowed(['GET', 'POST', 'PUT', 'DELETE']);
    }
}

// ---------------------------------------------------------------
// 7) /api/staff — live staff roster store (full-list replace)
// ---------------------------------------------------------------
function handle_staff(string $method): never
{
    $list = read_collection('staff');

    switch ($method) {
        case 'GET':
            json_out(['success' => true, 'count' => count($list), 'data' => $list]);

        case 'PUT':
        case 'POST':
            $payload = read_json_body();
            $items = (isset($payload[0]) || $payload === []) ? $payload : ($payload['staff'] ?? $payload['data'] ?? null);
            if (!is_array($items)) {
                json_out(['success' => false, 'error' => 'Staff array payload is required'], 400);
            }
            $sanitized = [];
            foreach ($items as $member) {
                if (is_array($member)) {
                    $sanitized[] = sanitize_staff($member);
                }
            }
            write_collection('staff', $sanitized);
            json_out(['success' => true, 'count' => count($sanitized), 'data' => $sanitized]);

        default:
            method_not_allowed(['GET', 'PUT', 'POST']);
    }
}

// ---------------------------------------------------------------
// Dispatch
// ---------------------------------------------------------------
$route = resolve_route();

// Resource routes with an optional /{id} suffix and multiple HTTP methods.
$routeParts = explode('/', $route, 2);
$routeBase = $routeParts[0];
$routeSub = isset($routeParts[1]) ? rawurldecode($routeParts[1]) : null;
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

if ($routeBase === 'enquiries') {
    handle_enquiries($method, $routeSub);
}
if ($routeBase === 'staff') {
    if ($routeSub !== null) {
        json_out(['success' => false, 'error' => "Unknown API route: {$route}"], 404);
    }
    handle_staff($method);
}

switch ($route) {
    case '':
    case 'health':
        handle_health();

    case 'send-enquiry-email':
        require_method('POST');
        handle_send_enquiry();

    case 'smtp-config':
        require_method('GET');
        handle_smtp_config();

    case 'save-smtp-config':
        require_method('POST');
        handle_save_smtp_config();

    case 'test-smtp':
        require_method('POST');
        handle_test_smtp();

    default:
        json_out(['success' => false, 'error' => "Unknown API route: {$route}"], 404);
}
