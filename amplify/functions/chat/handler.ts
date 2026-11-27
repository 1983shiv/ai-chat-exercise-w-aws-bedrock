import type { Schema } from "../../data/resource"
import { getProvider } from './providers';


type Identity = {
    sub?: string;
    username?: string;
    claims?: Record<string, unknown>;
} | null | undefined;

export const handler: Schema['chat']['functionHandler'] = async(event) => {
    const identity = event.identity as unknown as Identity;
    const who = identity?.username ?? identity?.sub ?? 'unknown';
    // const email = typeof identity?.claims?.email === 'string' ? identity.claims.email : 'unknown';
    const prompt = (event.arguments.message ?? '').trim();

    if(!prompt){
        return "Please type a message";
    }

    const provider = getProvider();
    const started = Date.now();
    const reply = await provider.complete(prompt);
    
    console.log(
        JSON.stringify({
            Level: 'INFO',
            msg: 'completion OK',
            sub: identity?.sub,
            username: identity?.username,
            tokenUse: identity?.claims?.token_use,
            claimKeys: Object.keys(identity?.claims ?? {}),
            promptText: prompt,
            promptLength: prompt.length,
            latencyMs: Date.now() - started,
            replyLength: reply.length,
        })
    );



    // await new Promise((r) => setTimeout(r, 2000));
    // return `Hello ${who}! You said: ${prompt}`;
    return reply;
}