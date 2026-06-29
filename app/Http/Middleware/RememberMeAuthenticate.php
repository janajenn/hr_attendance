<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use App\Models\User;

class RememberMeAuthenticate
{
    public function handle($request, Closure $next)
    {
        // Only run if no user is already authenticated
        if (! Auth::check()) {
            $token = Cookie::get('remember_me');

            if ($token) {
                $user = User::where('remember_token', $token)->first();

                if ($user) {
                    // Log the user in without creating a new remember cookie
                    Auth::login($user, false);
                }
            }
        }

        return $next($request);
    }
}
