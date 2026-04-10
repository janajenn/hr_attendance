import { useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import WelcomeMap from '@/Components/WelcomeMap';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
        remember: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout>
            <Head title="Log in" />

            {/* Map background */}
            <div className="fixed inset-0 -z-10">
                <WelcomeMap />
            </div>

            <div className="relative min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-white">Welcome Back</h2>
                        <p className="mt-2 text-sm text-gray-400">Sign in with your username</p>
                    </div>

                    {/* Glass card */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg p-3">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="username" value="Username" className="text-white" />
                                <TextInput
                                    id="username"
                                    type="text"
                                    name="username"
                                    value={data.username}
                                    className="mt-1 block w-full bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-green-500 focus:ring-green-500"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('username', e.target.value)}
                                />
                                <InputError message={errors.username} className="mt-2 text-red-400" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Password" className="text-white" />
                                <div className="relative mt-1">
                                    <TextInput
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        className="block w-full bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-green-500 focus:ring-green-500 pr-10"
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition"
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="h-5 w-5" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-2 text-red-400" />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded border-gray-600 text-green-600 bg-gray-800 focus:ring-green-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-300">Remember me</span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-green-400 hover:text-green-300 transition"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>

                            <div>
                                <PrimaryButton
                                    type="submit"
                                    disabled={processing}
                                    className="w-full justify-center bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white py-3 rounded-xl font-semibold shadow-lg transition disabled:opacity-50"
                                >
                                    {processing ? 'Signing in...' : 'Sign in'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    <p className="text-center text-xs text-gray-500">
                        Protected by LGU Opol Attendance System
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
