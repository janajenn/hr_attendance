<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class DepartmentController extends Controller
{
   public function index(Request $request)
{
    $query = Department::query();

    if ($request->filled('search')) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('code', 'like', "%{$search}%");
        });
    }

    $departments = $query->withCount('users')
        ->orderBy('name')
        ->paginate(10)
        ->withQueryString();

    return Inertia::render('HR/Departments/Index', [
        'departments' => $departments,
        'filters' => $request->only(['search']),
    ]);
}

    public function create()
    {
        return Inertia::render('HR/Departments/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:departments',
            'code' => 'nullable|unique:departments',
        ]);

        Department::create($request->only(['name', 'code']));

        return redirect()->route('hr.departments.index')
            ->with('success', 'Department created successfully.');
    }

    public function edit(Department $department)
    {
        return Inertia::render('HR/Departments/Edit', [
            'department' => $department
        ]);
    }

    public function update(Request $request, Department $department)
    {
        $request->validate([
            'name' => 'required|unique:departments,name,' . $department->id,
            'code' => 'nullable|unique:departments,code,' . $department->id,
        ]);

        $department->update($request->only(['name', 'code']));

        return redirect()->route('hr.departments.index')
            ->with('success', 'Department updated successfully.');
    }

    public function destroy(Department $department)
    {
        // Check if department has employees
        if ($department->users()->exists()) {
            return back()->with('error', 'Cannot delete department with assigned employees.');
        }

        $department->delete();
        return redirect()->route('hr.departments.index')
            ->with('success', 'Department deleted successfully.');
    }

    public function employees(Department $department)
{
    $employees = User::where('role', 'employee')
        ->where('department_id', $department->id)
        ->orderBy('name')
        ->get(['id', 'employee_id', 'name', 'position', 'username']);

    return Inertia::render('HR/Departments/Employees', [
        'department' => $department,
        'employees' => $employees,
    ]);
}
}
