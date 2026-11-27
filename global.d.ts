// global.d.ts
declare var process: {
  env: {
    LLM_PROVIDER?: string;
    GEMINI_API_KEY?: string;
    GEMINI_MODEL?: string;
    OPENROUTER_API_KEY?: string;
    OPENROUTER_MODEL?: string;
    [key: string]: string | undefined;
  };
};
