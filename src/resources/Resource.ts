import { Either } from 'fp-ts/lib/Either'
import * as t from 'io-ts'

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
  responseType: ResponseDecoder<Output>
  isFull: boolean
}
