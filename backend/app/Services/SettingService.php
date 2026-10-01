<?php

namespace App\Services;

use App\Models\Setting;

/**
 * Settings access (SMTP mail configuration and generic key/value settings).
 *
 * SMTP resolution precedence mirrors server.ts / api/bootstrap.php:
 *   DB settings row ("smtp") > environment (.env) > defaults (Gmail, port 587).
 */
class SettingService
{
    public const SMTP_KEY = 'smtp';

    /**
     * Defaults applied when neither the DB nor the environment provides a value.
     *
     * @return array<string, mixed>
     */
    private function defaults(): array
    {
        $user = (string) env('SMTP_USER', '');
        $port = (int) env('SMTP_PORT', 587);

        return [
            'host' => (string) env('SMTP_HOST', 'smtp.gmail.com'),
            'port' => $port,
            'secure' => (bool) env('SMTP_SECURE', false) || $port === 465,
            'user' => $user,
            'pass' => (string) env('SMTP_PASS', ''),
            'from' => (string) env('SMTP_FROM', $user !== '' ? "\"BLR15 Home Loans\" <{$user}>" : '"BLR15 Home Loans" <contact@blr15homeloans.com>'),
            'adminEmail' => (string) env('SMTP_ADMIN_EMAIL', 'godwinrobby1985@gmail.com'),
        ];
    }

    /**
     * Full active SMTP configuration (includes the password — internal use only).
     *
     * @return array<string, mixed>
     */
    public function smtpConfig(): array
    {
        $stored = Setting::query()->find(self::SMTP_KEY)?->value ?? [];

        return array_merge($this->defaults(), is_array($stored) ? $stored : []);
    }

    /**
     * SMTP configuration safe to return to clients (never includes the password).
     *
     * @return array<string, mixed>
     */
    public function smtpConfigForClient(): array
    {
        $config = $this->smtpConfig();

        return [
            'configured' => $config['user'] !== '' && $config['pass'] !== '',
            'host' => $config['host'],
            'port' => (int) $config['port'],
            'secure' => (bool) $config['secure'],
            'user' => $config['user'],
            'from' => $config['from'],
            'adminEmail' => $config['adminEmail'],
        ];
    }

    /**
     * Persist a partial SMTP configuration update (blank password keeps the old one).
     *
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    public function updateSmtpConfig(array $payload): array
    {
        $config = $this->smtpConfig();

        foreach (['host', 'port', 'secure', 'user', 'pass', 'from', 'adminEmail'] as $key) {
            if (! array_key_exists($key, $payload) || $payload[$key] === null) {
                continue;
            }

            $config[$key] = match ($key) {
                'port' => (int) $payload[$key],
                'secure' => (bool) $payload[$key],
                default => (string) $payload[$key],
            };
        }

        // Blank password = "keep existing" (matches the SmtpManager placeholder).
        if (array_key_exists('pass', $payload) && trim((string) $payload['pass']) === '') {
            $config['pass'] = $this->smtpConfig()['pass'];
        }

        Setting::query()->updateOrCreate(['key' => self::SMTP_KEY], ['value' => $config]);

        return $config;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function get(string $key): ?array
    {
        $value = Setting::query()->find($key)?->value;

        return is_array($value) ? $value : null;
    }

    /**
     * @param  array<string, mixed>  $value
     */
    public function put(string $key, array $value): Setting
    {
        return Setting::query()->updateOrCreate(['key' => $key], ['value' => $value]);
    }
}
