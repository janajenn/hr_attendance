<?php

namespace App\Http\Controllers;

use App\Models\AttendanceRecord;
use App\Models\User;
use App\Models\Department;
use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\LocationActivityLog; // added
use Carbon\Carbon;

class HrDashboardController extends Controller
{
 private function getActiveLocationIdsInRange($start, $end)
    {
        $logs = LocationActivityLog::with('location')
            ->where('changed_at', '<=', $end)
            ->orderBy('location_id')
            ->orderBy('changed_at')
            ->get();

        $intervals = [];
        foreach ($logs->groupBy('location_id') as $locId => $locLogs) {
            $activeFrom = null;
            foreach ($locLogs as $log) {
                $logDate = $log->changed_at->timezone('Asia/Manila');
                if ($log->is_active && $activeFrom === null) {
                    $activeFrom = $logDate;
                } elseif (!$log->is_active && $activeFrom !== null) {
                    $intervals[] = [
                        'location_id' => $locId,
                        'start' => $activeFrom,
                        'end' => $logDate,
                    ];
                    $activeFrom = null;
                }
            }
            if ($activeFrom !== null) {
                $intervals[] = [
                    'location_id' => $locId,
                    'start' => $activeFrom,
                    'end' => $end,
                ];
            }
        }

        $activeLocationIds = [];
        foreach ($intervals as $interval) {
            if ($interval['start'] <= $end && ($interval['end'] === null || $interval['end'] >= $start)) {
                $activeLocationIds[] = $interval['location_id'];
            }
        }
        return array_unique($activeLocationIds);
    }

    public function index(Request $request)
    {
        // Main attendance records query (for charts)
        $query = AttendanceRecord::with('user.department', 'location')->orderBy('attendance_timestamp', 'desc');

        if ($request->filled('employee_id')) {
            $query->where('user_id', $request->employee_id);
        }
        if ($request->filled('date')) {
            $query->whereDate('attendance_timestamp', $request->date);
        }

        $attendanceRecords = $query->get();

        // Employee summary (for bar chart)
        $employeeSummary = $attendanceRecords->groupBy('user_id')->map(function ($records, $userId) {
            $user = $records->first()->user;
            return [
                'user_id'    => $userId,
                'name'       => $user->name ?? 'Unknown',
                'department' => $user->department->name ?? 'No Department',
                'total'      => $records->count(),
                'late'       => $records->where('status', 'late')->count(),
            ];
        })->values();

        // Department summary (for pie chart and table)
        $departmentSummary = $attendanceRecords->groupBy(function ($record) {
            return $record->user->department->name ?? 'No Department';
        })->map(function ($records, $deptName) {
            return [
                'department' => $deptName,
                'total'      => $records->count(),
                'late'       => $records->where('status', 'late')->count(),
            ];
        })->values();

        // Location attendance summary (NEW)
        $locationAttendanceSummary = $attendanceRecords->groupBy('location_id')->map(function ($records, $locId) {
            $location = $records->first()->location;
            return [
                'location_id'      => $locId,
                'name'             => $location->name ?? 'Unknown',
                'total_attendance' => $records->count(),
                'unique_employees' => $records->pluck('user_id')->unique()->count(),
            ];
        })->values()->sortByDesc('total_attendance')->values();

        // Employees for filter dropdown
        $employees = User::where('role', 'employee')->get(['id', 'name']);

        // Locations for dropdown
        $locations = Location::orderBy('name')->get(['id', 'name']);

        // Per‑location employee participation (top 10 per location)
        $locationEmployeeSummary = [];
        foreach ($locations as $loc) {
            $topEmployees = AttendanceRecord::where('location_id', $loc->id)
                ->with('user')
                ->select('user_id', DB::raw('count(*) as total'))
                ->groupBy('user_id')
                ->orderBy('total', 'desc')
                ->limit(10)
                ->get()
                ->map(fn($r) => [
                    'name' => $r->user->name,
                    'total' => $r->total,
                ]);
            $locationEmployeeSummary[$loc->id] = $topEmployees;
        }

        // Overall stats
        $stats = [
            'totalEmployees'  => User::where('role', 'employee')->count(),
            'totalAttendance' => AttendanceRecord::count(),
            'todayAttendance' => AttendanceRecord::whereDate('attendance_timestamp', today())->count(),
        ];

        // Departments for absence filter
        $departments = Department::orderBy('name')->get(['id', 'name']);

        // Absence report filters
        $absenceStart = $request->input('absence_start_date', Carbon::now('Asia/Manila')->startOfMonth()->toDateString());
        $absenceEnd   = $request->input('absence_end_date', Carbon::now('Asia/Manila')->endOfMonth()->toDateString());
        $absenceDeptId = $request->input('absence_department_id');

        // Get total active locations in this period
        $activeLocationIds = $this->getActiveLocationIdsInRange($absenceStart, $absenceEnd);
        $totalActiveLocations = count($activeLocationIds);

        // Build attendance counts within date range
        $attendanceQuery = AttendanceRecord::whereBetween('attendance_timestamp', [$absenceStart, $absenceEnd]);
        if ($absenceDeptId) {
            $attendanceQuery->whereHas('user', function ($q) use ($absenceDeptId) {
                $q->where('department_id', $absenceDeptId);
            });
        }

        $attendanceCounts = $attendanceQuery
            ->select('user_id', DB::raw('count(*) as total'))
            ->groupBy('user_id')
            ->get()
            ->keyBy('user_id');

        // All employees (optionally filtered by department)
        $employeesQuery = User::where('role', 'employee')->with('department');
        if ($absenceDeptId) {
            $employeesQuery->where('department_id', $absenceDeptId);
        }
        $allEmployees = $employeesQuery->get(['id', 'name', 'department_id']);

        // Build absence report: each employee with attendance count (0 if none)
        $absenceReport = $allEmployees->map(function ($emp) use ($attendanceCounts, $totalActiveLocations) {
            $count = $attendanceCounts[$emp->id]->total ?? 0;
            $percentage = $totalActiveLocations > 0 ? round(($count / $totalActiveLocations) * 100, 1) : 0;
            return [
                'id'               => $emp->id,
                'name'             => $emp->name,
                'department'       => $emp->department->name ?? 'No Department',
                'attendance_count' => $count,
                'percentage'       => $percentage,
            ];
        })->filter(function ($emp) use ($totalActiveLocations) {
            // Only include employees with percentage < 50%, and only if there are active locations
            return $totalActiveLocations > 0 && $emp['percentage'] < 50;
        })->sortBy('percentage')->values();

        return Inertia::render('HR/Dashboard', [
            'employeeSummary'          => $employeeSummary,
            'departmentSummary'        => $departmentSummary,
            'locationAttendanceSummary'=> $locationAttendanceSummary, // new
            'employees'                => $employees,
            'filters'                  => $request->only(['employee_id', 'date']),
            'stats'                    => $stats,
            'locations'                => $locations,
            'locationEmployeeSummary'  => $locationEmployeeSummary,
            'departments'              => $departments,
            'absenceReport'            => $absenceReport,
            'totalActiveLocations'     => $totalActiveLocations,
            'absenceFilters'           => [
                'start_date'    => $absenceStart,
                'end_date'      => $absenceEnd,
                'department_id' => $absenceDeptId,
            ],
        ]);

    }


public function export(Request $request)
{
    // Apply same filters as dashboard
    $query = AttendanceRecord::with('user.department', 'location')
        ->orderBy('attendance_timestamp', 'desc');

    if ($request->filled('employee_id')) {
        $query->where('user_id', $request->employee_id);
    }
    if ($request->filled('date')) {
        $query->whereDate('attendance_timestamp', $request->date);
    }

    $records = $query->get();

    // Get all locations with their percentages (weights)
    $locations = \App\Models\Location::orderBy('name')->get(['id', 'name', 'percentage']);
    $locationWeights = $locations->pluck('percentage', 'id')->map(function ($pct) {
        return $pct / 100; // convert to multiplier for calculation
    });

    // Build CSV header with location weights
    $csv = "Location Weights (as set by HR)\n";
    $csv .= "Location,Weight (%)\n";
    foreach ($locations as $loc) {
        $csv .= "\"{$loc->name}\",{$loc->percentage}%\n";
    }
    $csv .= "\n";

    // Build employee participation data
    $employeeData = [];
    $overallWeightedTotal = 0;

    foreach ($records as $record) {
        $userId = $record->user_id;
        $locationId = $record->location_id;
        $weight = $locationWeights[$locationId] ?? 0;

        if (!isset($employeeData[$userId])) {
            $employeeData[$userId] = [
                'name' => $record->user->name ?? 'Unknown',
                'department' => $record->user->department->name ?? 'No Department',
                'raw_total' => 0,
                'weighted_total' => 0,
            ];
        }

        $employeeData[$userId]['raw_total']++;
        $employeeData[$userId]['weighted_total'] += $weight;
    }

    // Calculate overall weighted total and percentages
    foreach ($employeeData as &$data) {
        $overallWeightedTotal += $data['weighted_total'];
    }

    $csv .= "Employee Participation Report (Weighted by Location)\n";
    $csv .= "Employee,Department,Raw Attendance,Weighted Score,% of Total\n";

    foreach ($employeeData as $data) {
        $percentage = $overallWeightedTotal > 0 ? round(($data['weighted_total'] / $overallWeightedTotal) * 100, 2) : 0;
        $csv .= "\"{$data['name']}\",\"{$data['department']}\",{$data['raw_total']}," . round($data['weighted_total'], 2) . ",{$percentage}%\n";
    }

    $filename = 'weighted_participation_' . now()->format('Y-m-d_His') . '.csv';
    return response($csv, 200, [
        'Content-Type' => 'text/csv',
        'Content-Disposition' => "attachment; filename=\"{$filename}\"",
    ]);
}


}
