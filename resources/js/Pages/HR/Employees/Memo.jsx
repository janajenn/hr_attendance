import React from 'react';
import { Head } from '@inertiajs/react';
import {
    CalendarIcon,
    UserIcon,
    BriefcaseIcon,
    BuildingOfficeIcon,
    ChartBarIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    DocumentTextIcon,
} from '@heroicons/react/24/outline';

export default function Memo({ employee, start_date, end_date, total_active, attendance_count, percentage }) {
    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <>
            <Head title="Attendance Warning Memo" />
            <style>{`
                @page {
                    size: A4;
                    margin: 1.5cm;
                }
                @media print {
                    body { background: white; margin: 0; padding: 0; }
                    .no-print { display: none !important; }
                    .memo-container { box-shadow: none; padding: 0; }
                }
                body {
                    background: #e5e7eb;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    margin: 0;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                    line-height: 1.4;
                    color: #1e293b;
                }
                .memo-container {
                    max-width: 21cm;
                    width: 100%;
                    background: white;
                    border-radius: 0.25rem;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                    padding: 1rem 1.5rem;
                    margin: 1rem auto;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #e2e8f0;
                    padding-bottom: 0.75rem;
                    margin-bottom: 1rem;
                }
                .logo h1 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0;
                }
                .logo .sub {
                    color: #475569;
                    font-size: 0.7rem;
                }
                .date-box {
                    background: #f8fafc;
                    padding: 0.25rem 0.75rem;
                    border-radius: 0.25rem;
                    border: 1px solid #e2e8f0;
                }
                .date-box .label { font-size: 0.6rem; color: #64748b; }
                .date-box .value { font-size: 0.8rem; font-weight: 600; color: #1e293b; }
                .memo-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #b91c1c;
                    margin-bottom: 1rem;
                    border-bottom: 2px solid #b91c1c;
                    display: inline-block;
                    text-transform: uppercase;
                }
                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 0.75rem 1rem;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.5rem;
                    padding: 1rem;
                    margin-bottom: 1rem;
                }
                .info-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .info-icon {
                    width: 1.75rem;
                    height: 1.75rem;
                    background: white;
                    border-radius: 0.375rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #2563eb;
                    border: 1px solid #e2e8f0;
                }
                .info-icon svg { width: 1rem; height: 1rem; }
                .info-content { flex: 1; }
                .info-label { font-size: 0.6rem; font-weight: 600; color: #64748b; text-transform: uppercase; }
                .info-value { font-size: 0.85rem; font-weight: 600; color: #0f172a; }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0.75rem;
                    margin-bottom: 1rem;
                }
                .stat-card {
                    background: linear-gradient(145deg, #f8fafc, #ffffff);
                    border: 1px solid #e2e8f0;
                    border-radius: 0.75rem;
                    padding: 1rem 0.5rem;
                    text-align: center;
                    box-shadow: 0 2px 4px -2px rgba(0,0,0,0.05);
                }
                .stat-icon {
                    background: #dbeafe;
                    width: 2.5rem;
                    height: 2.5rem;
                    border-radius: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 0.5rem;
                    color: #2563eb;
                }
                .stat-icon svg { width: 1.25rem; height: 1.25rem; }
                .stat-label { font-size: 0.7rem; font-weight: 600; color: #64748b; text-transform: uppercase; }
                .stat-value { font-size: 1.5rem; font-weight: 700; color: #1e293b; line-height: 1; margin-bottom: 0.25rem; }
                .stat-sub { font-size: 0.6rem; color: #ef4444; font-weight: 500; }
                .warning-box {
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    border-radius: 0.5rem;
                    padding: 1rem;
                    margin-bottom: 1rem;
                }
                .warning-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.75rem;
                }
                .warning-header svg { width: 1.25rem; height: 1.25rem; color: #dc2626; }
                .warning-header h3 { font-size: 1rem; font-weight: 600; color: #b91c1c; margin: 0; }
                .warning-text { color: #7f1d1d; font-size: 0.8rem; }
                .warning-text p { margin: 0 0 0.5rem; }
                .signature-section {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 1.5rem;
                    padding-top: 1rem;
                    border-top: 2px dashed #cbd5e1;
                }
                .signature-block { width: 45%; }
                .signature-line {
                    width: 100%;
                    border-top: 2px solid #1e293b;
                    margin-bottom: 0.5rem;
                }
                .signature-label { font-size: 0.7rem; color: #475569; }
                .signature-name { font-weight: 600; font-size: 0.8rem; color: #0f172a; margin-top: 0.1rem; }
                .footer {
                    margin-top: 1rem;
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.6rem;
                    color: #94a3b8;
                    border-top: 1px solid #e2e8f0;
                    padding-top: 0.5rem;
                }
                .footer-left { display: flex; align-items: center; gap: 0.25rem; }
                .footer-left svg { width: 0.8rem; height: 0.8rem; }
                .print-button {
                    width: 100%;
                    padding: 0.5rem;
                    background: #2563eb;
                    color: white;
                    font-weight: 600;
                    border: none;
                    border-radius: 0.375rem;
                    cursor: pointer;
                    margin-top: 1rem;
                    font-size: 0.8rem;
                }
                .print-button svg { width: 1rem; height: 1rem; margin-right: 0.25rem; vertical-align: middle; }
            `}</style>
            <div className="memo-container">
                <div className="header">
                    <div className="logo">
                        <h1>LGU Opol</h1>
                        <div className="sub">HRMO</div>
                    </div>
                    <div className="date-box">
                        <div className="label">Date</div>
                        <div className="value">{formatDate(new Date())}</div>
                    </div>
                </div>

                <div className="memo-title">Attendance Warning</div>

                <div className="info-grid">
                    <div className="info-item">
                        <div className="info-icon"><UserIcon /></div>
                        <div className="info-content">
                            <div className="info-label">Employee</div>
                            <div className="info-value">{employee.name}</div>
                        </div>
                    </div>
                    <div className="info-item">
                        <div className="info-icon"><BuildingOfficeIcon /></div>
                        <div className="info-content">
                            <div className="info-label">Dept</div>
                            <div className="info-value">{employee.department?.name || 'N/A'}</div>
                        </div>
                    </div>
                    <div className="info-item">
                        <div className="info-icon"><BriefcaseIcon /></div>
                        <div className="info-content">
                            <div className="info-label">Position</div>
                            <div className="info-value">{employee.position || 'N/A'}</div>
                        </div>
                    </div>
                    <div className="info-item">
                        <div className="info-icon"><CalendarIcon /></div>
                        <div className="info-content">
                            <div className="info-label">Period</div>
                            <div className="info-value">{formatDate(start_date)} – {formatDate(end_date)}</div>
                        </div>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon"><CalendarIcon /></div>
                        <div className="stat-label">Active</div>
                        <div className="stat-value">{total_active}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><CheckCircleIcon /></div>
                        <div className="stat-label">Attended</div>
                        <div className="stat-value">{attendance_count}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><ChartBarIcon /></div>
                        <div className="stat-label">%</div>
                        <div className="stat-value">{percentage}%</div>
                        <div className="stat-sub">below 50%</div>
                    </div>
                </div>

                {/* Enhanced Warning Box */}
                <div className="warning-box">
                    <div className="warning-header">
                        <ExclamationTriangleIcon />
                        <h3>Formal Warning</h3>
                    </div>
                    <div className="warning-text">
                        <p>Dear <strong>{employee.name}</strong>,</p>
                        <p>
                            This is a formal notification regarding your attendance during the period{' '}
                            <strong>{formatDate(start_date)}</strong> to <strong>{formatDate(end_date)}</strong>.
                            During this time, there were <strong>{total_active}</strong> active attendance events.
                            Your attendance record shows that you attended <strong>{attendance_count}</strong> of these events,
                            resulting in an attendance rate of <strong>{percentage}%</strong>.
                        </p>
                        <p>
                            Company policy requires employees to maintain an attendance rate of at least{' '}
                            <strong>50%</strong> for active events. Your current rate falls below this threshold,
                            which is a matter of concern. Consistent attendance is crucial for team performance
                            and operational efficiency.
                        </p>
                        <p>
                            Please take immediate steps to improve your attendance. If there are extenuating
                            circumstances affecting your ability to attend, please discuss them with your supervisor
                            or the HR department. Failure to show improvement may lead to further disciplinary action
                            as outlined in the employee handbook.
                        </p>
                        <p>
                            Should you have any questions or need clarification, please contact the HR office
                            at your earliest convenience.
                        </p>
                    </div>
                </div>

                <div className="signature-section">
                    <div className="signature-block">
                        <div className="signature-line"></div>
                        <div className="signature-label">Joseph A. Actub</div>
                        <div className="signature-name">____________________</div>
                    </div>
                    <div className="signature-block">
                        <div className="signature-line"></div>
                        <div className="signature-label">Employee Signature</div>
                        <div className="signature-name">____________________</div>
                    </div>
                </div>

                <div className="footer">
                    <div className="footer-left">
                        <DocumentTextIcon />
                        <span>Memo No: HR-ATT-{new Date().getFullYear()}-{Math.floor(Math.random() * 1000).toString().padStart(3, '0')}</span>
                    </div>
                    <div>Page 1 of 1</div>
                </div>

                <button onClick={() => window.print()} className="print-button no-print">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
                    </svg>
                    Print
                </button>
            </div>
        </>
    );
}
