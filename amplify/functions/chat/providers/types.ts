export interface ChatProvider {
  readonly name: string;
  complete(prompt: string): Promise<string>;
}