import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { ClientFactory } from '#database/factories/client_factory'
import { DateTime } from 'luxon'

test.group('Client extract', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('it should be able to get the client extract', async ({ client: apiClient, assert }) => {
    const client = await ClientFactory.with('transactions', 20).create()

    const response = await apiClient.get(`clientes/${client.id}/extrato`)

    response.assertStatus(200)

    response.assertBodyContains({
      saldo: {
        total: client.balance,
        limite: client.limit,
      },
    })

    const { saldo, ultimas_transacoes: transacoes } = response.body()

    assert.isTrue(DateTime.fromISO(saldo.data_extrato).isValid)

    assert.lengthOf(transacoes, 10)
    assert.properties(transacoes[0], ['id', 'valor', 'tipo', 'descricao', 'realizada_em'])
  })
})
