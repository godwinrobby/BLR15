<?php
declare(strict_types=1);

/**
 * Router for PHP's built-in web server (no Apache/.htaccess needed):
 *   cd api && php -S 127.0.0.1:8080 router.php
 */

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
$file = __DIR__ . $path;

// Let the built-in server stream real static files (templates, favicon, etc.)
if ($path !== '/' && is_file($file)) {
    return false;
}

$route = ltrim($path, '/');
if (str_starts_with($route, 'api/')) {
    $route = substr($route, 4);
}
$_GET['route'] = trim($route, '/');

require __DIR__ . '/index.php';
