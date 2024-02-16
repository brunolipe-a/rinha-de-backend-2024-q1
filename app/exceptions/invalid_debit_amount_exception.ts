import { Exception } from '@adonisjs/core/exceptions'

export default class InvalidDebitAmountException extends Exception {
  static status = 422
  static message = 'Balance insufficient'
}
