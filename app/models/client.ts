import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

import Transaction from './transaction.js'

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare limit: number

  @column()
  declare balance: number

  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>
}
