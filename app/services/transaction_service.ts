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
    const transaction = await client.related('transactions').create(dto)

    const { newBalance } = await this.updateBalance(client, dto.type, dto.amount)

    return { transaction, newBalance }
  }

  private async updateBalance(client: Client, type: TransactionType, amount: number) {
    if (type === TransactionType.CREDIT) {
      await Client.query().increment('balance', amount).where('id', client.id)

      return { newBalance: client.balance + amount }
    }

    this.validateDebitAmount(client, amount)

    await Client.query().decrement('balance', amount).where('id', client.id)

    return { newBalance: client.balance - amount }
  }

  private validateDebitAmount(client: Client, debitAmount: number) {
    const newBalance = client.balance - debitAmount

    if (newBalance < client.limit * -1) {
      throw new InvalidDebitAmountException()
    }
  }
}
