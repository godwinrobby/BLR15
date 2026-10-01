<?php

namespace App\Models;

use Database\Factories\AdminUserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

/**
 * Admin/staff portal user — the JWT-authenticated principal for the API.
 *
 * @property string $id
 * @property string $name
 * @property string $email
 * @property string $role
 * @property string|null $phone
 * @property bool $active
 */
#[Fillable(['id', 'name', 'email', 'password', 'role', 'phone', 'active', 'last_login_at'])]
#[Hidden(['password', 'remember_token'])]
class AdminUser extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<AdminUserFactory> */
    use HasFactory, Notifiable;

    protected $table = 'admin_users';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    /**
     * Role constants used for authorization (see EnsureRole middleware).
     */
    public const ROLE_SUPER_ADMIN = 'Super Admin';

    public const ROLE_ADMIN = 'Admin';

    public const ROLE_LOAN_EXECUTIVE = 'Loan Executive';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'active' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     */
    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array<string, mixed>
     */
    public function getJWTCustomClaims(): array
    {
        return [
            'role' => $this->role,
            'name' => $this->name,
        ];
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === self::ROLE_SUPER_ADMIN;
    }

    /**
     * Shape returned to the SPA — matches the frontend AdminUser type (camelCase).
     *
     * @return array<string, mixed>
     */
    public function toApiArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'phone' => $this->phone,
            'active' => (bool) $this->active,
        ];
    }
}
