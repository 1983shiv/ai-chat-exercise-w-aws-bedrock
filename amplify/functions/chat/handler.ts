import type { Schema } from "../../data/resource"

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
    
    console.log(
        JSON.stringify({
            Level: 'INFO',
            msg: 'chat request',
            sub: identity?.sub,
            username: identity?.username,
            tokenUse: identity?.claims?.token_use,
            claimKeys: Object.keys(identity?.claims ?? {}),
            promptText: prompt,
            promptLength: prompt.length,
        })
    );

    if(!prompt){
        return 'Please type a message';
    }

    await new Promise((r) => setTimeout(r, 2000));
    return `Hello ${who}! You said: ${prompt}`;
}