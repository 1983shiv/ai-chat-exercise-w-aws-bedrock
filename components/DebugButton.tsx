'use client';

import { useMemo, useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

export default function DebugButton() {
  const client = useMemo(() => generateClient<Schema>(), []);
  const [result, setResult] = useState('');

  async function trigger() {
    const { data, errors } = await client.queries.chat({});
    setResult(errors?.length ? `Error: ${errors[0].message}` : `OK: ${data}`);
  }

  return (
    <div style={{ marginTop: 12 }}>
      <button onClick={trigger}>Send empty request (debug)</button>{' '}
      <small>{result}</small>
    </div>
  );
}