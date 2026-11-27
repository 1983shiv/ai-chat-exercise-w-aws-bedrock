import { defineFunction, secret } from "@aws-amplify/backend"

export const chat = defineFunction({
    name: 'chat',
    entry: './handler.ts',
    timeoutSeconds: 30,
    memoryMB: 512,
    environment: {
        LLM_PROVIDER: 'bedrock',
        GEMINI_MODEL: 'gemini-2.5-flash',
        GEMINI_API_KEY: secret('GEMINI_API_KEY'),
        // OPENROUTER_MODEL: 'openai/gpt-4o-mini',
        // OPENROUTER_API_KEY: secret('OPENROUTER_API_KEY'),
        OPENROUTER_MODEL: 'nvidia/nemotron-3.5-super-vl:free',
        OPENROUTER_API_KEY: secret('OPENROUTER_API_KEY'),
        // BEDROCK_MODEL_ID: 'apac.amazon.nova-micro-v1:0',
        BEDROCK_MODEL_ID: 'global.anthropic.claude-haiku-4-5-20251001-v1:0',

    },
})

