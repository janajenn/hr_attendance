<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Credentials</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        .header h1 {
            font-size: 22px;
            margin: 0;
            color: #1a202c;
        }
        .header p {
            margin: 5px 0 0;
            color: #4a5568;
        }
        .department {
            margin-top: 25px;
        }
        .department-title {
            background: #edf2f7;
            padding: 8px 12px;
            font-weight: bold;
            font-size: 14px;
            color: #2d3748;
            border-radius: 4px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
        }
        table th {
            background: #e2e8f0;
            text-align: left;
            padding: 8px 12px;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #2d3748;
        }
        table td {
            padding: 8px 12px;
            border-bottom: 1px solid #e2e8f0;
        }
        table tr:last-child td {
            border-bottom: none;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #a0aec0;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
        }
        .page-break {
            page-break-before: always;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Employee Login Credentials</h1>
        <p>Generated: {{ $generated_at->format('F j, Y g:i A') }}</p>
    </div>

    @forelse ($grouped as $department => $employees)
        <div class="department">
            <div class="department-title">{{ $department }}</div>
            <table>
                <thead>
                    <tr>
                        <th style="width: 60%;">Full Name</th>
                        <th style="width: 40%;">Username</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($employees as $employee)
                        <tr>
                            <td>{{ $employee->name }}</td>
                            <td>{{ $employee->username }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @empty
        <p style="text-align: center; margin-top: 40px; color: #a0aec0;">No employees found.</p>
    @endforelse

    <div class="footer">
        This document is confidential and contains login credentials for all employees.
        Please distribute securely.
    </div>
</body>
</html>
