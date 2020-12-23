import { Either } from 'fp-ts/lib/Either'
import * as t from 'io-ts'
import { AudiusError, APIError, UnknownError } from '../core/Errors'

export type QueryParams = {
  [key: string]: string | number | undefined | boolean | Array<string> | null
}

type ResponseDecoder<T> = {
  decode: (i: unknown) => Either<t.Errors, T>
}

// TODO: need to define error types
export type Resource<Args, Options, Output> = {
  queryBuilder: (
    args: Args,
    options: Options,
    currentUserId?: string
  ) => { path: string; queryParams: QueryParams }
  errorBuilder: (code: number, response: any) => AudiusError
  responseType: ResponseDecoder<Output>
  isFull: boolean
}

export const defaultErrorHandler = (code: number, response: any) => {
  if (response.message) {
    return new APIError({ message: response.message, code })
  }
  return new UnknownError({ code, message: 'An unknown error has occurred' })
}
