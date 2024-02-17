import { inject } from '@adonisjs/fold'
import type { HttpContext } from '@adonisjs/core/http'

import Client from '#models/client'
import { TransactionType } from '#models/transaction'
import { createTransaction } from '#validators/create_transaction'
import { TransactionService } from '#services/transaction_service'

@inject()
export default class TransactionsController {
  constructor(protected transactionService: TransactionService) {}

  async store({ request, params }: HttpContext) {
    const client = await Client.findOrFail(params.id)

    const { valor, tipo, descricao } = await request.validateUsing(createTransaction)

    const { newBalance } = await this.transactionService.createTransaction(client, {
      amount: valor,
      type: tipo === 'c' ? TransactionType.CREDIT : TransactionType.DEBIT,
      description: descricao,
    })

    return { limite: client.limit, saldo: newBalance }
  }
}
