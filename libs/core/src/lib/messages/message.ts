import { create as xml } from 'xmlbuilder2'

export type StructuredContentFormat = 'raw' | 'xml' | 'markdown' | 'json'
export type StructuredContent = object

export abstract class Message {
  constructor(
    protected readonly _type: 'assistant' | 'system' | 'tool' | 'user',
    protected readonly _content: {
      raw?: string
      structured?: StructuredContent
    },
  ) {}

  format(format: StructuredContentFormat) {
    return {
      type: this._type,
      content: this.formatContent(format),
    }
  }

  private formatContent(format: StructuredContentFormat): string {
    switch (format) {
      case 'json':
        return `${this._content.raw ? `${this._content.raw}\n\n` : ''}${this._content.structured ? JSON.stringify(this._content.structured) : ''}`
      case 'xml':
        return `${this._content.raw ? `${this._content.raw}\n\n` : ''}${this._content.structured ? xml(this._content.structured) : ''}`
      default:
        return ''
    }
  }
}
