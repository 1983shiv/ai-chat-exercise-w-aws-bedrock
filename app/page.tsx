'use client';

import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import outputs from '@/amplify_outputs.json';
import TokenPeek from '@/components/TokenPeek';

Amplify.configure(outputs);

export default function Home() {
    return (
        <Authenticator>
            {({ signOut, user }) => (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
                    <main className="w-full max-w-140 bg-white p-8 rounded-xl shadow-md space-y-6">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Welcome
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Signed in as{' '}
                                    <span className="font-medium text-gray-800">
                                        {user?.signInDetails?.loginId}
                                    </span>
                                </p>
                            </div>
                            <button
                                onClick={signOut}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                            >
                                Sign Out
                            </button>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">
                                Your ID token claims
                            </h2>
                            <div className="flex justify-center">
                                <TokenPeek />
                            </div>
                        </div>
                    </main>
                </div>
            )}
        </Authenticator>
    );
}
