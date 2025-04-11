import { z } from 'zod'
import { AssistantMessage, StructuredContentFormat } from './messages'
import { ThreadOrMessage } from './thread'
import { Invokable, InvokeOptions } from './interfaces'

export abstract class Model implements Invokable {
  public formating: StructuredContentFormat = 'xml'

  public abstract invoke(
    threadOrMessage: ThreadOrMessage,
    options?: Omit<InvokeOptions, 'structuredOutput'>,
  ): Promise<AssistantMessage>
  public abstract invoke<Output extends z.AnyZodObject>(
    threadOrMessage: ThreadOrMessage,
    options?: Omit<InvokeOptions, 'structuredOutput'> & {
      structuredOutput: Output
    },
  ): Promise<AssistantMessage<z.infer<Output>>>
}
