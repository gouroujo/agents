import { StructuredContent, Message } from './message'

export class SystemMessage extends Message {
  private constructor(content: {
    raw?: string
    structured?: StructuredContent
  }) {
    super('system', content)
  }
  static create(raw: string, formated?: StructuredContent): SystemMessage
  static create(formated: StructuredContent): SystemMessage
  static create(
    rawOrFormated: string | StructuredContent,
    optionalStructured?: StructuredContent,
  ) {
    const raw: string | undefined =
      typeof rawOrFormated === 'string' ? rawOrFormated : undefined
    const structured: StructuredContent | undefined =
      typeof rawOrFormated === 'string' ? optionalStructured : rawOrFormated
    return new SystemMessage({ raw, structured })
  }
}
