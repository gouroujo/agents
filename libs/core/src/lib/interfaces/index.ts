import { z } from 'zod'
import { Message } from '../messages'
import { Thread } from '../thread'
import { Tool } from './tool.interface'

export interface InvokeOptions {
  structuredOutput?: z.AnyZodObject
  tools?: Tool[]
  maxIterations?: number
  niteration?: number
}
export interface Invokable<Output = any> {
  invoke(thread: Thread | Message, options?: InvokeOptions): Promise<Output>
}
