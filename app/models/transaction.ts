import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column()
  declare clientId: number

  @column()
  declare amount: number

  @column()
  declare type: TransactionType

  @column()
  declare description: string
}
