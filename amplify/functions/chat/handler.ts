import type { Schema } from '../../data/resource';
import { getProvider } from './providers';
import { log } from './log';

type Identity = {
  sub?: string;
  username?: string;
  claims?: Record<string, unknown>;
} | null | undefined;

export const handler: Schema['chat']['functionHandler'] = async (event, context) => {
  const identity = event.identity as unknown as Identity;
//   const prompt = (event.arguments.message ?? '').trim();
  const prompt = event.arguments.message.trim();

  if (!prompt) {
    log('WARN', 'empty prompt', { requestId: context.awsRequestId });
    return 'Please type a message.';
  }

  const provider = getProvider();
  const started = Date.now();
  const reply = await provider.complete(prompt);

  log('INFO', 'completion ok', {
    requestId: context.awsRequestId,
    provider: provider.name,
    sub: identity?.sub,
    latencyMs: Date.now() - started,
    promptLength: prompt.length,
    replyLength: reply.length,
  });

  return reply;
};