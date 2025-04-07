export abstract class AIModel {
  public abstract invoke(prompt: string): Promise<string>
}
