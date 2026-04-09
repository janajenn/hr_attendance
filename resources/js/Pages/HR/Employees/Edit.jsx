import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import Swal from 'sweetalert2';
import { PencilIcon } from '@heroicons/react/24/outline';

export default function Edit({ employee, departments }) {
    // Store original values for change detection
    const original = {
        employee_id: employee.employee_id,
        name: employee.name,
        department_id: employee.department_id || '',
        position: employee.position || '',
        username: employee.username,
        birthdate: employee.birthdate || '', // add birthdate
    };

    const [formData, setFormData] = useState({
        employee_id: original.employee_id,
        name: original.name,
        department_id: original.department_id,
        position: original.position,
        username: original.username,
        birthdate: original.birthdate, // add
        photo: null,
    });

    const [photoChanged, setPhotoChanged] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'photo') {
            const file = files[0];
            setFormData(prev => ({ ...prev, photo: file }));
            setPhotoChanged(true);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if anything was changed
        const hasChanges =
            formData.employee_id !== original.employee_id ||
            formData.name !== original.name ||
            formData.department_id !== original.department_id ||
            formData.position !== original.position ||
            formData.username !== original.username ||
            formData.birthdate !== original.birthdate || // check birthdate
            photoChanged;

        if (!hasChanges) {
            Swal.fire({
                title: 'No changes made',
                text: 'Do you want to go back to the employee list?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Yes, go back',
                cancelButtonText: 'Stay here',
                background: '#1f2937',
                color: '#fff',
            }).then((result) => {
                if (result.isConfirmed) {
                    router.visit(route('hr.employees.index'));
                }
            });
            return;
        }

        setProcessing(true);

        // Prepare data for submission
        const submitData = { ...formData };
        if (!submitData.photo) {
            delete submitData.photo;
        }

        router.post(route('hr.employees.update', employee.id), {
            ...submitData,
            _method: 'PUT'
        }, {
            forceFormData: true,
            onSuccess: () => setProcessing(false),
            onError: (errors) => { setErrors(errors); setProcessing(false); },
        });
    };

    return (
        <HRLayout>
            <Head title="Edit Employee" />
            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-4 mb-8">
                    <div className="bg-green-600 rounded-xl p-3">
                        <PencilIcon className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Edit Employee</h1>
                </div>

                <div className="bg-gray-800 rounded-2xl shadow-xl border border-green-900/30 p-6 md:p-8">
                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                        {/* Employee ID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Employee ID <span className="text-green-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="employee_id"
                                value={formData.employee_id}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                placeholder="EMP-001"
                            />
                            {errors.employee_id && <p className="mt-1 text-sm text-red-400">{errors.employee_id}</p>}
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Full Name <span className="text-green-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                placeholder="John Doe"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                        </div>

                        {/* Department Dropdown */}
                        <div>
                            <label htmlFor="department_id" className="block text-sm font-medium text-gray-300 mb-1">
                                Department <span className="text-green-400">*</span>
                            </label>
                            <select
                                id="department_id"
                                name="department_id"
                                value={formData.department_id}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name} {dept.code ? `(${dept.code})` : ''}
                                    </option>
                                ))}
                            </select>
                            {errors.department_id && <p className="mt-1 text-sm text-red-400">{errors.department_id}</p>}
                        </div>

                        {/* Position */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Position <span className="text-green-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                placeholder="e.g., Developer, Manager"
                            />
                            {errors.position && <p className="mt-1 text-sm text-red-400">{errors.position}</p>}
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Username <span className="text-green-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                placeholder="johndoe"
                            />
                            {errors.username && <p className="mt-1 text-sm text-red-400">{errors.username}</p>}
                        </div>

                        {/* Birthdate */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Birthdate <span className="text-green-400">*</span>
                            </label>
                            <input
                                type="date"
                                name="birthdate"
                                value={formData.birthdate}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-400">Used for password resets.</p>
                            {errors.birthdate && <p className="mt-1 text-sm text-red-400">{errors.birthdate}</p>}
                        </div>

                        {/* Photo Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Profile Photo <span className="text-green-400">(optional)</span>
                            </label>
                            <div className="flex items-center space-x-4">
                                <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg border border-gray-600 transition">
                                    Choose File
                                    <input
                                        type="file"
                                        name="photo"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                </label>
                                {formData.photo && (
                                    <span className="text-sm text-gray-300">{formData.photo.name}</span>
                                )}
                                {!formData.photo && employee.photo && (
                                    <span className="text-sm text-gray-400">Current: {employee.photo.split('/').pop()}</span>
                                )}
                            </div>
                            {errors.photo && <p className="mt-1 text-sm text-red-400">{errors.photo}</p>}
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition disabled:opacity-50 flex items-center justify-center"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    'Update Employee'
                                )}
                            </button>
                            <Link
                                href={route('hr.employees.index')}
                                className="w-full sm:w-auto px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-lg transition text-center"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </HRLayout>
    );
}
