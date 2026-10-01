<?php

namespace App\Console\Commands;

use App\Models\AdminUser;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

/**
 * Creates or resets a login for the Admin CRM.
 *
 * Useful on a fresh production deploy, where seeding is not wanted but an
 * account still has to exist so the portal can be reached:
 *
 *   php artisan admin:login rajesh.k@blr15.in --password='…' --role="Super Admin"
 *   php artisan admin:login demo@blr15.in --password='…'   # demo account
 */
class CreateAdminLogin extends Command
{
    protected $signature = 'admin:login
        {email : Login email address}
        {--password= : Password; random when omitted}
        {--name=BLR15 Admin : Display name}
        {--role=Super Admin : One of the AdminUser role constants}
        {--phone= : Contact number}
        {--inactive : Create the account deactivated}';

    protected $description = 'Create or reset an Admin CRM login';

    public function handle(): int
    {
        $email = (string) $this->argument('email');

        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->components->error("'{$email}' is not a valid email address.");

            return self::FAILURE;
        }

        $roles = [
            AdminUser::ROLE_SUPER_ADMIN,
            AdminUser::ROLE_ADMIN,
            AdminUser::ROLE_LOAN_EXECUTIVE,
        ];
        // A value arriving with surrounding quotes (e.g. --role="Super Admin")
        // is not a valid role; strip them before validating.
        $role = trim((string) $this->option('role'), "\"'\s");

        if (! in_array($role, $roles, true)) {
            $this->components->error("Unknown role '{$role}'. Valid roles: ".implode(', ', $roles));

            return self::FAILURE;
        }

        $password = (string) ($this->option('password') ?: $this->randomPassword());

        // updateOrCreate keyed on email so re-running resets the password
        // instead of violating the unique index.
        $user = AdminUser::query()->updateOrCreate(
            ['email' => $email],
            [
                'id' => AdminUser::query()->where('email', $email)->value('id') ?: 'staff-'.substr(md5($email), 0, 8),
                'name' => (string) $this->option('name'),
                'password' => Hash::make($password),
                'role' => $role,
                'phone' => $this->option('phone'),
                'active' => ! $this->option('inactive'),
            ],
        );

        $this->newLine();
        $this->components->info($user->wasRecentlyCreated ? 'Admin login created.' : 'Admin login updated.');
        $this->components->twoColumnDetail('Email', $user->email);
        $this->components->twoColumnDetail('Role', $user->role);
        $this->components->twoColumnDetail('Password', $password);
        $this->newLine();

        return self::SUCCESS;
    }

    /** URL-safe random password, sized to pass the LoginRequest min:4 rule. */
    private function randomPassword(): string
    {
        return substr(str_replace(['/', '+', '='], '', base64_encode(random_bytes(9))), 0, 12);
    }
}
