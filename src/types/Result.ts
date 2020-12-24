export type Result<R, E extends Error> = (R & { error: null }) | { error: E }

export const successResult = <R, E extends Error>(result: R) => ({
  ...result,
  error: null as E | null
})
export const errorResult = <E extends Error>(error: E) => ({ error })
