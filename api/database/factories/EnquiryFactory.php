<?php

namespace Database\Factories;

use App\Models\Enquiry;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Enquiry>
 */
class EnquiryFactory extends Factory
{
    protected $model = Enquiry::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => 'BLR15-'.str_pad((string) fake()->unique()->numberBetween(1, 9000), 4, '0', STR_PAD_LEFT),
            'customer_name' => fake()->name(),
            'mobile' => fake()->numerify('+91 9#### #####'),
            'email' => fake()->unique()->safeEmail(),
            'dob' => fake()->date('Y-m-d', '-25 years'),
            'city' => 'Bangalore',
            'employment_type' => fake()->randomElement(['Salaried', 'Self Employed', 'Business Owner']),
            'monthly_income' => fake()->numberBetween(40000, 300000),
            'other_income' => fake()->numberBetween(0, 50000),
            'existing_emi' => fake()->numberBetween(0, 40000),
            'other_obligations' => fake()->numberBetween(0, 20000),
            'required_loan_amount' => fake()->numberBetween(2000000, 12000000),
            'property_value' => fake()->numberBetween(3000000, 18000000),
            'property_type' => fake()->randomElement(['Apartment', 'Villa', 'Resale House', 'New House']),
            'property_location' => fake()->randomElement(['Jalahalli West', 'Yelahanka', 'Peenya', 'Electronic City']).', Bangalore',
            'loan_type' => fake()->randomElement(['Home Purchase Loan', 'Home Construction Loan', 'Home Loan Balance Transfer', 'Home Loan Top-Up']),
            'existing_loan' => ['hasExistingLoan' => false],
            'message' => fake()->sentence(),
            'source' => fake()->randomElement(['Website Form', 'Eligibility Wizard', 'Mobile App', 'Direct Call']),
            'status' => 'New',
            'assigned_staff' => null,
            'status_history' => [],
            'follow_ups' => [],
        ];
    }
}
