<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class HrUserController extends Controller
{
    /**
     * Display a listing of HR users.
     */
    public function index()
    {
        $users = User::where('role', 'hr')
            ->orderBy('name')
            ->get(['id', 'name', 'username', 'email', 'created_at']);

        return Inertia::render('HR/Users/Index', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new HR user.
     */
    public function create()
    {
        return Inertia::render('HR/Users/Create');
    }

    /**
     * Store a newly created HR user.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'email'    => 'nullable|email|unique:users,email',
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        User::create([
            'name'      => $request->name,
            'username'  => $request->username,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'role'      => 'hr',
        ]);

        return redirect()->route('hr.hr-users.index')
            ->with('success', 'HR user created successfully.');
    }

    /**
     * Remove the specified HR user.
     */
    public function destroy(User $user)
    {
        abort_if($user->role !== 'hr', 404);
        abort_if($user->id === auth()->id(), 403, 'You cannot delete your own account.');

        $user->delete();

        return redirect()->route('hr.hr-users.index')
            ->with('success', 'HR user deleted successfully.');
    }
}
