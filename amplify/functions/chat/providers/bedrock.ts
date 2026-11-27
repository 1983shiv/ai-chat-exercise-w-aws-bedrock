import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import type { ChatProvider } from './types';

export class BedrockProvider implements ChatProvider {
  readonly name = 'bedrock';
  private readonly client = new BedrockRuntimeClient({});

  constructor(private readonly modelId: string) {}

  async complete(prompt: string): Promise<string> {
    const response = await this.client.send(
      new ConverseCommand({
        modelId: this.modelId,
        system: [{ text: 'You are a concise, friendly assistant.' }],
        messages: [{ role: 'user', content: [{ text: prompt }] }],
        inferenceConfig: { maxTokens: 512, temperature: 0.5 },
      })
    );

    console.log(
      JSON.stringify({
        level: 'INFO',
        msg: 'bedrock usage',
        modelId: this.modelId,
        inputTokens: response.usage?.inputTokens,
        outputTokens: response.usage?.outputTokens,
      })
    );

    const text = response.output?.message?.content?.map((c) => c.text ?? '').join('') ?? '';
    return text || '(empty response)';
  }
}