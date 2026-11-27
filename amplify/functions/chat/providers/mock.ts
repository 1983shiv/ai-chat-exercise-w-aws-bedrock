import type { ChatProvider } from './types';

export class MockProvider implements ChatProvider {
  readonly name = 'mock';

  async complete(prompt: string): Promise<string> {
    return `[mock model] You asked: "${prompt}". Switch LLM_PROVIDER to use a real model.`;
  }
}