<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsurePasswordChanged
{
    public function handle(Request $request, Closure $next)
    {
        if (auth()->check() && auth()->user()->must_change_password) {
            if (! $request->routeIs('password.change') && ! $request->routeIs('password.update')) {
                return redirect()->route('password.change');
            }
        }

        return $next($request);
    }
}
