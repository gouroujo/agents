import { Message, SystemMessage } from './messages'

export type ThreadOrMessage = Thread | Message

export function getThread(threadOrMessage: ThreadOrMessage): Thread {
  return threadOrMessage instanceof Thread
    ? threadOrMessage
    : Thread.create([threadOrMessage])
}

export class Thread {
  private _messages: Message[]
  private locked = false
  constructor(messages: Message[] = []) {
    this._messages = [...messages]
  }

  get messages() {
    return this._messages
  }

  public append(message: Message | Message[]) {
    const messages: Message[] = Array.isArray(message) ? message : [message]
    this._messages = [...this._messages, ...messages]
  }

  public prepend(message: Message | Message[]) {
    const messages: Message[] = Array.isArray(message) ? message : [message]
    this._messages = [...messages, ...this._messages]
  }

  public lock() {
    if (this.locked) return new Error('Already locked')
    this.locked = true
  }

  public unlock() {
    this.locked = false
  }

  public clean() {
    this._messages = this._messages.filter(
      (message) => !(message instanceof SystemMessage),
    )
  }

  public clone(): Thread {
    return new Thread(
      this._messages.filter((message) => !(message instanceof SystemMessage)),
    )
  }

  static create(messages?: Message[]) {
    return new Thread(messages)
  }
}
