import { Inject } from '@nestjs/common'
import { DEFAULT_MODEL_TOKEN } from './constants'

/**
 * @publicApi
 */
export const InjectModel = (): ReturnType<typeof Inject> =>
  Inject(DEFAULT_MODEL_TOKEN)
