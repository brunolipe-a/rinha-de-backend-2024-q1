import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'

import Client from '#models/client'

export default class ExtractsController {
  async show({ params }: HttpContext) {
    const client = await Client.findOrFail(params.id)

    const latestTransactions = await client
      .related('transactions')
      .query()
      .orderBy('created_at', 'desc')
      .limit(10)

    return {
      saldo: {
        total: client.balance,
        data_extrato: DateTime.now(),
        limite: client.limit,
      },
      ultimas_transacoes: latestTransactions,
    }
  }
}
