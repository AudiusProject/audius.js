// Error should have
//  - code
//  - message
//  - type

// Error types are like
//  - API Error (as opposed to like libs error)
//  - Network Error
//  - Decoding error?
//  - Invalid Arguments

//  - Resource not found
//  - timeout?

type AudiusErrorProps = {
  code?: number
  message?: string
}

export class AudiusError extends Error {
  code?: number

  constructor(args: AudiusErrorProps = {}) {
    super(args.message)
    this.message = args.message ?? ''
    this.code = args.code
  }
}

export class APIError extends AudiusError {}
export class UnknownError extends AudiusError {}
export class ConnectionError extends AudiusError {}
