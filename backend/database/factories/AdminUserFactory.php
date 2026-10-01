<?php

namespace Database\Factories;

use App\Models\AdminUser;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<AdminUser>
 */
class AdminUserFactory extends Factory
{
    protected $model = AdminUser::class;

    protected static ?string $password = null;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => 'staff-'.Str::lower(Str::random(8)),
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => static::$password ??= Hash::make('password123'),
            'role' => AdminUser::ROLE_LOAN_EXECUTIVE,
            'phone' => fake()->numerify('+91 9#### #####'),
            'active' => true,
        ];
    }

    public function superAdmin(): static
    {
        return $this->state(fn () => ['role' => AdminUser::ROLE_SUPER_ADMIN]);
    }

    public function admin(): static
    {
        return $this->state(fn () => ['role' => AdminUser::ROLE_ADMIN]);
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['active' => false]);
    }
}
