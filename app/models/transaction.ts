import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export enum TransactionType {
  CREDIT = 'c',
  DEBIT = 'd',
}

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ serializeAs: null })
  declare clientId: number

  @column({ serializeAs: 'valor' })
  declare amount: number

  @column({ serializeAs: 'tipo' })
  declare type: TransactionType

  @column({ serializeAs: 'descricao' })
  declare description: string

  @column.dateTime({ autoCreate: true, serializeAs: 'realizada_em' })
  declare createdAt: DateTime
}
