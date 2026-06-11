<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class PasswordChangeController extends Controller
{
    public function showForm()
    {
        return Inertia::render('Auth/ChangePassword');
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $user->update([
            'password' => Hash::make($request->password),
            'must_change_password' => false,
        ]);

        // Clear any previous "intended" URL that might have been set by the middleware
        session()->forget('url.intended');

        // Redirect based on user's role
        if ($user->role === 'hr') {
            $redirectTo = route('hr.dashboard');
        } elseif ($user->role === 'employee') {
            $redirectTo = route('attendance.create');
        } else {
            $redirectTo = route('dashboard'); // fallback, if you have a general dashboard
        }

        return redirect($redirectTo)->with('success', 'Password changed successfully.');
    }
}
