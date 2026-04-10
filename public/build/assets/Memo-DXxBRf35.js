import{r as i,j as e,H as m}from"./app-ClqmD7W1.js";import{F as h}from"./UserIcon-DDzQCC3j.js";import{F as f,a as g}from"./ChartBarIcon-Dnl-Q-CK.js";import{F as c}from"./CalendarIcon-Dwu2vAQD.js";import{F as x}from"./CheckCircleIcon-BO39PNlD.js";function u({title:r,titleId:a,...n},t){return i.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:t,"aria-labelledby":a},n),r?i.createElement("title",{id:a},r):null,i.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"}))}const p=i.forwardRef(u);function b({title:r,titleId:a,...n},t){return i.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:t,"aria-labelledby":a},n),r?i.createElement("title",{id:a},r):null,i.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"}))}const v=i.forwardRef(b);function j({title:r,titleId:a,...n},t){return i.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:t,"aria-labelledby":a},n),r?i.createElement("title",{id:a},r):null,i.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"}))}const w=i.forwardRef(j);function A({employee:r,start_date:a,end_date:n,total_active:t,attendance_count:o,percentage:d}){const s=l=>l?new Date(l).toLocaleDateString("en-PH",{year:"numeric",month:"long",day:"numeric"}):"";return e.jsxs(e.Fragment,{children:[e.jsx(m,{title:"Attendance Warning Memo"}),e.jsx("style",{children:`
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
            `}),e.jsxs("div",{className:"memo-container",children:[e.jsxs("div",{className:"header",children:[e.jsxs("div",{className:"logo",children:[e.jsx("h1",{children:"LGU Opol"}),e.jsx("div",{className:"sub",children:"HRMO"})]}),e.jsxs("div",{className:"date-box",children:[e.jsx("div",{className:"label",children:"Date"}),e.jsx("div",{className:"value",children:s(new Date)})]})]}),e.jsx("div",{className:"memo-title",children:"Attendance Warning"}),e.jsxs("div",{className:"info-grid",children:[e.jsxs("div",{className:"info-item",children:[e.jsx("div",{className:"info-icon",children:e.jsx(h,{})}),e.jsxs("div",{className:"info-content",children:[e.jsx("div",{className:"info-label",children:"Employee"}),e.jsx("div",{className:"info-value",children:r.name})]})]}),e.jsxs("div",{className:"info-item",children:[e.jsx("div",{className:"info-icon",children:e.jsx(f,{})}),e.jsxs("div",{className:"info-content",children:[e.jsx("div",{className:"info-label",children:"Dept"}),e.jsx("div",{className:"info-value",children:r.department?.name||"N/A"})]})]}),e.jsxs("div",{className:"info-item",children:[e.jsx("div",{className:"info-icon",children:e.jsx(p,{})}),e.jsxs("div",{className:"info-content",children:[e.jsx("div",{className:"info-label",children:"Position"}),e.jsx("div",{className:"info-value",children:r.position||"N/A"})]})]}),e.jsxs("div",{className:"info-item",children:[e.jsx("div",{className:"info-icon",children:e.jsx(c,{})}),e.jsxs("div",{className:"info-content",children:[e.jsx("div",{className:"info-label",children:"Period"}),e.jsxs("div",{className:"info-value",children:[s(a)," – ",s(n)]})]})]})]}),e.jsxs("div",{className:"stats-grid",children:[e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon",children:e.jsx(c,{})}),e.jsx("div",{className:"stat-label",children:"Active"}),e.jsx("div",{className:"stat-value",children:t})]}),e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon",children:e.jsx(x,{})}),e.jsx("div",{className:"stat-label",children:"Attended"}),e.jsx("div",{className:"stat-value",children:o})]}),e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon",children:e.jsx(g,{})}),e.jsx("div",{className:"stat-label",children:"%"}),e.jsxs("div",{className:"stat-value",children:[d,"%"]}),e.jsx("div",{className:"stat-sub",children:"below 50%"})]})]}),e.jsxs("div",{className:"warning-box",children:[e.jsxs("div",{className:"warning-header",children:[e.jsx(w,{}),e.jsx("h3",{children:"Formal Warning"})]}),e.jsxs("div",{className:"warning-text",children:[e.jsxs("p",{children:["Dear ",e.jsx("strong",{children:r.name}),","]}),e.jsxs("p",{children:["This is a formal notification regarding your attendance during the period"," ",e.jsx("strong",{children:s(a)})," to ",e.jsx("strong",{children:s(n)}),". During this time, there were ",e.jsx("strong",{children:t})," active attendance events. Your attendance record shows that you attended ",e.jsx("strong",{children:o})," of these events, resulting in an attendance rate of ",e.jsxs("strong",{children:[d,"%"]}),"."]}),e.jsxs("p",{children:["Company policy requires employees to maintain an attendance rate of at least"," ",e.jsx("strong",{children:"50%"})," for active events. Your current rate falls below this threshold, which is a matter of concern. Consistent attendance is crucial for team performance and operational efficiency."]}),e.jsx("p",{children:"Please take immediate steps to improve your attendance. If there are extenuating circumstances affecting your ability to attend, please discuss them with your supervisor or the HR department. Failure to show improvement may lead to further disciplinary action as outlined in the employee handbook."}),e.jsx("p",{children:"Should you have any questions or need clarification, please contact the HR office at your earliest convenience."})]})]}),e.jsxs("div",{className:"signature-section",children:[e.jsxs("div",{className:"signature-block",children:[e.jsx("div",{className:"signature-line"}),e.jsx("div",{className:"signature-label",children:"Joseph A. Actub"}),e.jsx("div",{className:"signature-name",children:"____________________"})]}),e.jsxs("div",{className:"signature-block",children:[e.jsx("div",{className:"signature-line"}),e.jsx("div",{className:"signature-label",children:"Employee Signature"}),e.jsx("div",{className:"signature-name",children:"____________________"})]})]}),e.jsxs("div",{className:"footer",children:[e.jsxs("div",{className:"footer-left",children:[e.jsx(v,{}),e.jsxs("span",{children:["Memo No: HR-ATT-",new Date().getFullYear(),"-",Math.floor(Math.random()*1e3).toString().padStart(3,"0")]})]}),e.jsx("div",{children:"Page 1 of 1"})]}),e.jsxs("button",{onClick:()=>window.print(),className:"print-button no-print",children:[e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"})}),"Print"]})]})]})}export{A as default};
