'use client';

import { FormEvent, useEffect, useState, useMemo, useRef } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

type ChatMessages = { role: 'user' | 'assistance'; txt: string };

export default function Chat() {
    const client = useMemo(() => generateClient<Schema>(), []);
    const [messages, setMessages] = useState<ChatMessages[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        const txt = input.trim();
        if (!txt || loading) return;

        setInput('');
        setError(null);

        setMessages((m) => [...m, { role: 'user', txt }]);
        setLoading(true);

        try {
            const { data, errors } = await client.queries.chat({
                message: txt,
            });
            if (errors?.length) {
                throw new Error(errors.map((x) => x.message).join(';'));
            }

            setMessages((m) => [
                ...m,
                { role: 'assistance', txt: data ?? '(no response)' },
            ]);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Something went wrong',
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="chat">
            <div className="log" aria-live="polite">
                {messages.map((m, i) => (
                    <div key={i} className={'bubble ${m.role}'}>
                        {m.txt}
                    </div>
                ))}
            </div>
            {error && <p className="error">Error: {error}</p>}
            <form onSubmit={onSubmit} className="row">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Something..."
                    aria-label="Message"
                />
                <button type="submit" disabled={loading}>
                    send
                </button>
            </form>
        </section>
    );
}
