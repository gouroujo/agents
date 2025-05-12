import * as S from 'effect/Schema'

export class OllamaGenerateResponse extends S.Class<OllamaGenerateResponse>(
  'OllamaGenerateResponse',
)({
  model: S.String,
  created_at: S.DateFromString,
  message: S.Struct({
    role: S.Literal('assistant'),
    content: S.String,
  }),
  done: S.Boolean,
}) {}

export class OllamaGenerateErrorResponse extends S.Class<OllamaGenerateErrorResponse>(
  'OllamaGenerateErrorResponse',
)({
  message: S.String,
}) {}
