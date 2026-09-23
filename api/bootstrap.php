<?php
declare(strict_types=1);

/**
 * BLR15 PHP API — shared bootstrap (config, helpers, PHPMailer factory).
 * This application is a 1:1 PHP port of the Express/nodemailer endpoints in server.ts.
 */

require __DIR__ . '/vendor/autoload.php';

// ---------------------------------------------------------------
// Constants
// ---------------------------------------------------------------
const BLR15_SMTP_CONFIG_FILE = __DIR__ . '/../.smtp-config.json'; // shared with server.ts
const BLR15_ENV_FILE = __DIR__ . '/../.env';

const BLR15_OFFICE = [
    'name' => 'BLR15 Home Loans',
    'fullAddress' => 'Near Narasimha Swamy Temple, 1st Floor, Kammagondanahalli Main Road, Kammagondanahalli, Jalahalli West, Bangalore – 560015',
    'phone' => '+91 98450 15150',
    'landline' => '080 2838 1515',
    'whatsapp' => '+919845015150',
    'email' => 'contact@blr15homeloans.com',
    'supportEmail' => 'support@blr15.in',
    'workingHours' => 'Mon – Sat: 9:30 AM – 7:00 PM (Sunday by appointment)',
];

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------
function e(mixed $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function json_out(array $payload, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_out(['success' => false, 'error' => 'Invalid JSON payload'], 400);
    }
    return $data;
}

/** Simple .env parser (KEY="value" / KEY=value, comments, escapes). */
function load_env_file(string $path): array
{
    if (!is_file($path)) {
        return [];
    }
    $out = [];
    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }
        $pos = strpos($line, '=');
        if ($pos === false) {
            continue;
        }
        $key = trim(substr($line, 0, $pos));
        $val = trim(substr($line, $pos + 1));
        if (strlen($val) >= 2 && ($val[0] === '"' || $val[0] === "'") && $val[strlen($val) - 1] === $val[0]) {
            $quote = $val[0];
            $val = substr($val, 1, -1);
            if ($quote === '"') {
                $val = str_replace(['\\"', '\\n'], ["\"", "\n"], $val);
            }
        }
        $out[$key] = $val;
    }
    return $out;
}

/**
 * Active SMTP configuration. Precedence mirrors server.ts:
 * runtime file (.smtp-config.json) > environment / .env > defaults.
 */
function get_smtp_config(): array
{
    static $cache = null;
    if ($cache !== null) {
        return $cache;
    }

    $file = [];
    if (is_file(BLR15_SMTP_CONFIG_FILE)) {
        $decoded = json_decode((string) file_get_contents(BLR15_SMTP_CONFIG_FILE), true);
        if (is_array($decoded)) {
            $file = $decoded;
        }
    }
    $envFile = load_env_file(BLR15_ENV_FILE);

    $pick = static function (string $fileKey, string $envKey, mixed $default) use ($file, $envFile): mixed {
        if (array_key_exists($fileKey, $file) && $file[$fileKey] !== null && $file[$fileKey] !== '') {
            return $file[$fileKey];
        }
        $env = getenv($envKey);
        if ($env !== false && $env !== '') {
            return $env;
        }
        if (array_key_exists($envKey, $envFile) && $envFile[$envKey] !== '') {
            return $envFile[$envKey];
        }
        return $default;
    };

    $host = (string) $pick('host', 'SMTP_HOST', 'smtp.gmail.com');
    $port = (int) $pick('port', 'SMTP_PORT', 587);
    if (array_key_exists('secure', $file) && $file['secure'] !== null && $file['secure'] !== '') {
        $secure = (bool) $file['secure'];
    } else {
        $secureEnv = getenv('SMTP_SECURE');
        if ($secureEnv === false || $secureEnv === '') {
            $secureEnv = $envFile['SMTP_SECURE'] ?? '';
        }
        $secure = $secureEnv === 'true' || $port === 465;
    }
    $user = (string) $pick('user', 'SMTP_USER', '');
    $pass = (string) $pick('pass', 'SMTP_PASS', '');
    $defaultFrom = $user !== ''
        ? '"BLR15 Home Loans" <' . $user . '>'
        : '"BLR15 Home Loans" <contact@blr15homeloans.com>';
    $from = (string) $pick('from', 'SMTP_FROM', $defaultFrom);
    $adminEmail = (string) $pick('adminEmail', 'SMTP_ADMIN_EMAIL', 'godwinrobby1985@gmail.com');

    $cache = [
        'host' => $host,
        'port' => $port,
        'secure' => $secure,
        'user' => $user,
        'pass' => $pass,
        'from' => $from,
        'adminEmail' => $adminEmail,
    ];
    return $cache;
}

/** Merge and persist SMTP settings to .smtp-config.json (same file as server.ts). */
function save_smtp_config(array $body): array
{
    $updated = get_smtp_config();
    foreach (['host', 'port', 'secure', 'user', 'pass', 'from', 'adminEmail'] as $key) {
        if (!array_key_exists($key, $body) || $body[$key] === null) {
            continue;
        }
        $updated[$key] = match ($key) {
            'port' => (int) $body[$key],
            'secure' => (bool) $body[$key],
            default => (string) $body[$key],
        };
    }

    $encoded = json_encode($updated, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($encoded === false || file_put_contents(BLR15_SMTP_CONFIG_FILE, $encoded . "\n") === false) {
        json_out(['success' => false, 'error' => 'Failed to write SMTP configuration file'], 500);
    }

    return $updated;
}

// ---------------------------------------------------------------
// PHPMailer (SMTP) factory — parity with createTransporter() in server.ts
// ---------------------------------------------------------------
function parse_from_address(string $from): array
{
    if (preg_match('/^(.*)<([^>]+)>$/s', $from, $matches)) {
        return [trim($matches[2]), trim($matches[1], " \t\"'")];
    }
    $email = trim($from);
    return [$email !== '' ? $email : 'contact@blr15homeloans.com', 'BLR15 Home Loans'];
}

function create_phpmailer(array $config): PHPMailer\PHPMailer\PHPMailer
{
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $config['host'];
    $mail->Port = (int) $config['port'];
    $mail->SMTPSecure = $config['secure'] ? 'ssl' : 'tls';
    $mail->SMTPAuth = true;
    $mail->Username = $config['user'];
    $mail->Password = $config['pass'];
    // server.ts uses tls.rejectUnauthorized: false — mirror it for self-signed/LAN SMTP.
    $mail->SMTPOptions = ['ssl' => ['verify_peer' => false, 'verify_peer_name' => false, 'allow_self_signed' => true]];
    $mail->CharSet = 'UTF-8';
    $mail->isHTML(true);
    $mail->Priority = 1;
    [$email, $name] = parse_from_address($config['from'] ?? '');
    if ($email !== '') {
        $mail->setFrom($email, $name !== '' ? $name : 'BLR15 Home Loans');
    }
    return $mail;
}

/** Send one message through an established transport (clears recipients between sends). */
function deliver(PHPMailer\PHPMailer\PHPMailer $mail, string $to, string $subject, string $html): void
{
    $mail->clearAddresses();
    $mail->Subject = $subject;
    $mail->Body = $html;
    $mail->AltBody = trim(html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
    $mail->addAddress($to);
    $mail->send();
    $mail->clearAddresses();
}

function simulated_message_id(): string
{
    return '<' . bin2hex(random_bytes(16)) . '@blr15homeloans.local>';
}

/** Indian digit grouping — parity with amount.toLocaleString('en-IN'). */
function formatINR(mixed $amount): string
{
    if (!is_numeric($amount)) {
        return '₹0';
    }
    $number = (float) $amount;
    $prefix = $number < 0 ? '-' : '';
    $whole = (string) (int) abs($number);
    if (strlen($whole) > 3) {
        $last3 = substr($whole, -3);
        $rest = preg_replace('/\B(?=(\d{2})+(?!\d))/', ',', substr($whole, 0, -3));
        $whole = $rest . ',' . $last3;
    }
    return $prefix . '₹' . $whole;
}

function render_template(string $name, array $vars): string
{
    extract($vars, EXTR_SKIP);
    ob_start();
    include __DIR__ . '/templates/' . $name . '.php';
    return (string) ob_get_clean();
}
