"use client"

import { useEffect, useState } from "react"
import { fetchAuthSession } from "aws-amplify/auth"

export default function TokenPeek(){
    const [claims, setClaims] = useState<Record<string, unknown> | null>(null);

    useEffect(() => {
        fetchAuthSession().then((session) =>{
            const payload = session.tokens?.idToken?.payload;
            setClaims(payload ? (payload as Record<string, unknown>) : null);
        })
    }, [])

    return (
        <pre style={{ background: '#f4f5f7', padding: 12, borderRadius: 8, overflowX: 'auto'}}>
            {claims ? JSON.stringify(claims, null, 2) : "No ID token found"}
        </pre>
    )
}