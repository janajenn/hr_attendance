<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Department; // add this
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class EmployeeController extends Controller
{
   public function index(Request $request)
{
    $query = User::where('role', 'employee')
        ->with('department')
        ->select(['id', 'employee_id', 'name', 'department_id', 'position', 'username', 'photo']);

    // Apply search filter if present
    if ($request->has('search') && !empty($request->search)) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('employee_id', 'like', "%{$search}%")
              ->orWhere('name', 'like', "%{$search}%")
              ->orWhere('position', 'like', "%{$search}%")
              ->orWhere('username', 'like', "%{$search}%")
              ->orWhereHas('department', function ($dq) use ($search) {
                  $dq->where('name', 'like', "%{$search}%")
                     ->orWhere('code', 'like', "%{$search}%");
              });
        });
    }

    $employees = $query->orderBy('name')->paginate(8)->withQueryString();

    return Inertia::render('HR/Employees/Index', [
        'employees' => $employees,
        'filters' => $request->only(['search']),
    ]);
}

    public function create()
    {
        $departments = Department::orderBy('name')->get(['id', 'name', 'code']);
        return Inertia::render('HR/Employees/Create', [
            'departments' => $departments
        ]);
    }

    public function store(Request $request)
{
    $request->validate([
        'name'          => 'required',
        'department_id' => 'required|exists:departments,id',
        'position'      => 'required',
        'username'      => 'required|unique:users',
        'birthdate'     => 'required|date|before:today', // must be a past date
        'photo'         => 'nullable|image|max:2048',
    ]);

    // Generate employee ID (same as before)
    $lastEmployee = User::where('role', 'employee')->orderBy('id', 'desc')->first();
    if ($lastEmployee && preg_match('/EMP-(\d+)/', $lastEmployee->employee_id, $matches)) {
        $nextNumber = intval($matches[1]) + 1;
    } else {
        $nextNumber = 1;
    }
    $employeeId = 'EMP-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

    // Password is the birthdate (e.g., "2001-10-01")
    $plainPassword = $request->birthdate;

    $data = [
        'employee_id'   => $employeeId,
        'name'          => $request->name,
        'department_id' => $request->department_id,
        'position'      => $request->position,
        'username'      => $request->username,
        'birthdate'     => $request->birthdate,
        'role'          => 'employee',
        'password'      => Hash::make($plainPassword),
    ];

    if ($request->hasFile('photo')) {
        $path = $request->file('photo')->store('employee-photos', 'public');
        $data['photo'] = $path;
    }

    User::create($data);

    return redirect()->route('hr.employees.index')
        ->with('success', "Employee created. Password is their birthdate: $plainPassword");
}

public function resetPassword(User $user)
{
    abort_if($user->role !== 'employee', 404);

    if (!$user->birthdate) {
        return back()->withErrors(['birthdate' => 'This employee does not have a birthdate on file.']);
    }

    $newPassword = $user->birthdate;
    $user->password = Hash::make($newPassword);
    $user->save();

    return back()->with('success', "Password reset to employee's birthdate: $newPassword");
}

    public function edit(User $user)
    {
        abort_if($user->role !== 'employee', 404);
        $departments = Department::orderBy('name')->get(['id', 'name', 'code']);
        return Inertia::render('HR/Employees/Edit', [
            'employee' => $user->load('department'),
            'departments' => $departments,
        ]);
    }

public function update(Request $request, User $user)
{
    abort_if($user->role !== 'employee', 404);

    $validated = $request->validate([
        'employee_id'   => 'sometimes|required|unique:users,employee_id,' . $user->id,
        'name'          => 'sometimes|required',
        'department_id' => 'sometimes|required|exists:departments,id',
        'position'      => 'sometimes|required',
        'username'      => 'sometimes|required|unique:users,username,' . $user->id,
        'birthdate'     => 'sometimes|required|date|before:today', // add
        'photo'         => 'nullable|image|max:2048',
    ]);

    $data = [];
    if ($request->has('employee_id'))   $data['employee_id'] = $validated['employee_id'];
    if ($request->has('name'))          $data['name'] = $validated['name'];
    if ($request->has('department_id')) $data['department_id'] = $validated['department_id'];
    if ($request->has('position'))      $data['position'] = $validated['position'];
    if ($request->has('username'))      $data['username'] = $validated['username'];
    if ($request->has('birthdate'))     $data['birthdate'] = $validated['birthdate']; // add

    \Log::info('Data to update:', $data);

    if ($request->hasFile('photo')) {
        if ($user->photo) {
            \Storage::disk('public')->delete($user->photo);
        }
        $data['photo'] = $request->file('photo')->store('employee-photos', 'public');
        \Log::info('Photo updated to: ' . $data['photo']);
    }

    $updated = $user->update($data); // returns bool

    if (!$updated) {
        \Log::error('User update returned false', ['user_id' => $user->id]);
        return redirect()->route('hr.employees.index')
            ->with('error', 'Employee update failed.');
    }

    \Log::info('User after update:', $user->fresh()->toArray());
    \Log::info('=== EMPLOYEE UPDATE END ===');

    return redirect()->route('hr.employees.index')
        ->with('success', 'Employee updated.');
}




    public function destroy(User $user)
    {
        abort_if($user->role !== 'employee', 404);
        if ($user->photo) {
            \Storage::disk('public')->delete($user->photo);
        }
        $user->delete();
        return redirect()->route('hr.employees.index')
            ->with('success', 'Employee deleted.');
    }


    public function memo(Request $request, User $user)
{
    abort_if($user->role !== 'employee', 404);

    $start = $request->query('start');
    $end = $request->query('end');
    $totalActive = $request->query('total_active');
    $attendanceCount = $request->query('attendance_count');
    $percentage = $request->query('percentage');

    return Inertia::render('HR/Employees/Memo', [
        'employee' => $user->load('department'),
        'start_date' => $start,
        'end_date' => $end,
        'total_active' => $totalActive,
        'attendance_count' => $attendanceCount,
        'percentage' => $percentage,
    ]);
}

}
