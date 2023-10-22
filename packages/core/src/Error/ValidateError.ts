export class ValidateError extends Error {
  constructor(messsage?: string | undefined) {
    super(messsage)
  }
}