import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function ChangePassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.update'), {
            onSuccess: () => reset(),
        });
    };

    const goBack = () => {
        window.history.back();
    };

    return (
        <>
            <Head title="Change Password" />
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col justify-center items-center px-4 py-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600/20 border border-green-500/30 mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white">Change Your Password</h2>
                        <p className="text-gray-400 text-sm mt-1">For security, please set a new password</p>
                    </div>

                    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-green-500/20 p-6 sm:p-8">
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <InputLabel
                                    htmlFor="current_password"
                                    value="Current Password"
                                    className="text-gray-300 text-sm font-medium mb-1 block"
                                />
                                <TextInput
                                    id="current_password"
                                    type="password"
                                    name="current_password"
                                    value={data.current_password}
                                    className="mt-1 block w-full bg-gray-800 border-gray-700 text-white focus:border-green-500 focus:ring-green-500 rounded-lg"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('current_password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.current_password} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="password"
                                    value="New Password"
                                    className="text-gray-300 text-sm font-medium mb-1 block"
                                />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full bg-gray-800 border-gray-700 text-white focus:border-green-500 focus:ring-green-500 rounded-lg"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Confirm New Password"
                                    className="text-gray-300 text-sm font-medium mb-1 block"
                                />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full bg-gray-800 border-gray-700 text-white focus:border-green-500 focus:ring-green-500 rounded-lg"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password_confirmation} className="mt-1" />
                            </div>

                            <div className="pt-2 flex gap-3">
                                <PrimaryButton
                                    disabled={processing}
                                    className="flex-1 justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 shadow-lg shadow-green-600/30"
                                >
                                    {processing ? 'Updating...' : 'Update Password'}
                                </PrimaryButton>
                                <button
                                    type="button"
                                    onClick={goBack}
                                    className="flex-1 justify-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 rounded-lg transition duration-200"
                                >
                                    Back
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center text-xs text-gray-500">
                            After changing your password, you'll be redirected to the dashboard.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
