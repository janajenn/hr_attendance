<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
public function store(LoginRequest $request)
{
    // Validate credentials
    $credentials = $request->only('username', 'password');

    if (! Auth::attempt($credentials, false)) {
        throw ValidationException::withMessages([
            'username' => trans('auth.failed'),
        ]);
    }

    $user = Auth::user();

    // Regenerate remember token on every login (invalidates other devices)
    $token = Str::random(60);
    $user->forceFill(['remember_token' => $token])->save();

    if ($request->boolean('remember')) {
        // Set persistent cookie for 30 days (minutes = 30 * 24 * 60)
        $cookie = cookie(
            'remember_me',          // cookie name
            $token,                 // value
            60 * 24 * 30,           // 30 days in minutes
            '/',                    // path
            null,                   // domain
            true,                   // secure (HTTPS only)
            true,                   // httpOnly
            false,                  // raw
            'lax'                   // SameSite
        );
        return redirect()->intended($this->redirectPath())->withCookie($cookie);
    } else {
        // Remove any existing "remember_me" cookie
        return redirect()->intended($this->redirectPath())
                         ->withCookie(cookie()->forget('remember_me'));
    }
}

protected function redirectPath()
{
    $user = Auth::user();
    if ($user->role === 'employee') {
        return route('attendance.create');
    } elseif ($user->role === 'hr') {
        return route('hr.dashboard');
    }
    return '/dashboard';
}

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
{
    $user = Auth::user();

    if ($user) {
        // Clear the remember token from database
        $user->forceFill(['remember_token' => null])->save();
    }

    Auth::logout();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    // Delete the cookie
    return redirect('/')->withCookie(cookie()->forget('remember_me'));
}



}
