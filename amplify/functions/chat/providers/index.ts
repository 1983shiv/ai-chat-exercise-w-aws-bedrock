// import { env } from 'node:process';
import { env } from "$amplify/env/chat"
import type { ChatProvider } from './types';
import { MockProvider } from './mock';
import { GeminiProvider } from './gemini';
import { OpenRouterProvider } from './openrouter';

function requireEnv(name: keyof typeof env): string {
  const value = env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
}

export function getProvider(): ChatProvider {
  const kind = env.LLM_PROVIDER ?? 'mock';
  switch (kind) {
    case 'mock':
      return new MockProvider();
    case 'gemini':
      return new GeminiProvider(
        requireEnv('GEMINI_API_KEY'),
        env.GEMINI_MODEL ?? 'gemini-2.5-flash'
      );
    case 'openrouter':
      return new OpenRouterProvider(
        requireEnv('OPENROUTER_API_KEY'),
        requireEnv('OPENROUTER_MODEL')
      );
    default:
      throw new Error(`Unknown LLM_PROVIDER: ${kind}`);
  }
}