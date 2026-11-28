'use client';

import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import outputs from '@/amplify_outputs.json';
// import TokenPeek from '@/components/TokenPeek';
import Chat from '@/components/Chat';
import DebugButton from '@/components/DebugButton';


Amplify.configure(outputs);

export default function Home() {
    return (
        <Authenticator>
            {({ signOut, user }) => (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
                    <main className="w-full max-w-140 bg-white p-8 rounded-xl shadow-md space-y-6">
                        <header className="flex items-center justify-between border-b border-gray-200 pb-4">
                            
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Welcome
                                </h1>
                            <span>{user?.signInDetails?.loginId}</span>
                            <button
                                onClick={signOut}
                                className="px-2 py-1 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                            >
                                Sign Out
                            </button>
                        
                        </header>
                        <Chat />
                        <DebugButton />
                    </main>
                </div>
            )}
        </Authenticator>
    );
}
