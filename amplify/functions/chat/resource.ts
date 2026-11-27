import { defineFunction } from "@aws-amplify/backend"

export const chat = defineFunction({
    name: 'chat',
    entry: './handler.ts',
    timeoutSeconds: 1,
    memoryMB: 512,
})

