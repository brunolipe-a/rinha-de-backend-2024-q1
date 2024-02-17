import db from '@adonisjs/lucid/services/db'

import Client from '#models/client'
import { TransactionType } from '#models/transaction'
import InvalidDebitAmountException from '#exceptions/invalid_debit_amount_exception'

interface CreateTransactionDto {
  amount: number
  type: TransactionType
  description: string
}

export class TransactionService {
  async createTransaction(client: Client, dto: CreateTransactionDto) {
    const trx = await db.transaction()

    client.useTransaction(trx)

    try {
      const { newBalance } = await this.updateBalance(client, dto.type, dto.amount)

      const transaction = await client.related('transactions').create(dto)

      await trx.commit()

      return { transaction, newBalance }
    } catch (err) {
      await trx.rollback()

      throw err
    }
  }

  private async updateBalance(client: Client, type: TransactionType, amount: number) {
    amount = type === TransactionType.CREDIT ? amount : amount * -1

    const result = await Client.query({ client: client.$trx })
      .increment('balance', amount)
      .where('id', client.id)
      .returning(['balance'])

    const { balance } = result[0] as Client

    if (balance < client.limit * -1) {
      // Valor do saldo não pode menor do que o limite negativo
      throw new InvalidDebitAmountException()
    }

    return { newBalance: balance }
  }
}
