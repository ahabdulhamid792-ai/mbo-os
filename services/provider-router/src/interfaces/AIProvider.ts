export interface AIProvider {
  name: string;

  chat(prompt: string): Promise<string>;

  healthCheck(): Promise<boolean>;
}