import type { ChatProvider } from './types';

type OpenRouterResponse = {
  choices?: { message?: { content?: string } }[];
};

export class OpenRouterProvider implements ChatProvider {
  readonly name = 'openrouter';

  constructor(
    private readonly apiKey: string,
    private readonly model: string
  ) {}

  async complete(prompt: string): Promise<string> {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 512,
      }),
    });

    if (!res.ok) {
      const detail = (await res.text()).slice(0, 300);
      throw new Error(`OpenRouter HTTP ${res.status}: ${detail}`);
    }

    const json = (await res.json()) as OpenRouterResponse;
    return json.choices?.[0]?.message?.content ?? '(empty response)';
  }
}