export interface CommonResponse<T> {
  result: T
  hint: string | null | undefined
  redirect: string | null | undefined
  message: string | null | undefined
}

export enum Result {
  Accepted,
  WrongAnswer,
  TimeLimitExceeded,
  MemoryLimitExceeded,
  RuntimeError,
  CompileError,
  PresentationError,
  OutputLimitExceeded,
  SystemError,
  Waiting,
}

export interface Submission {
  contest_name: string
  problem_name: string
  result: string
  language: string
  submission_time: Date
  execution_memory: number
  execution_time: number
  code_length: number
}
