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
 */

require __DIR__ . '/bootstrap.php';

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
// Dispatch
// ---------------------------------------------------------------
$route = resolve_route();

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
