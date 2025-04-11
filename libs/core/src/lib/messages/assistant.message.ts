import { Message, StructuredContent } from './message'

export class AssistantMessage<
  Content extends StructuredContent | never = never,
> extends Message {
  private constructor(content: { raw?: string; structured?: Content }) {
    super('system', content)
  }

  get structuredContent(): Content {
    return this._content.structured as Content
  }

  static create(raw: string): AssistantMessage
  static create<Content extends StructuredContent>(
    formated: Content,
  ): AssistantMessage<Content>
  static create<T extends StructuredContent>(rawOrFormated: T | string) {
    const raw: string | undefined =
      typeof rawOrFormated === 'string' ? rawOrFormated : undefined
    const structured: T | undefined =
      typeof rawOrFormated !== 'string' ? rawOrFormated : undefined
    return new AssistantMessage({ raw, structured })
  }
}
