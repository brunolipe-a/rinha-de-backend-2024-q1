import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'
import testUtils from '@adonisjs/core/services/test_utils'

import Client from '#models/client'
import { ClientFactory } from '#database/factories/client_factory'

test.group('Client transaction', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('it should be able to create a credit transaction to a client').run(
    async ({ client: apiClient, assert }) => {
      const client = await ClientFactory.create()

      const request = {
        valor: faker.number.int({ min: 10_000, max: 100_000 }),
        tipo: 'c',
        descricao: 'descricao',
      }

      const response = await apiClient.post(`clientes/${client.id}/transacoes`).json(request)

      response.assertStatus(200)
      response.assertBody({
        limite: client.limit,
        saldo: client.balance + request.valor,
      })

      const updatedClient = await Client.findOrFail(client.id)
      assert.equal(updatedClient.balance, client.balance + request.valor)
    }
  )

  test('it should be able to create a debit transaction to a client').run(
    async ({ client: apiClient, assert }) => {
      const client = await ClientFactory.create()

      const request = {
        valor: faker.number.int({ min: 10_000, max: 100_000 }),
        tipo: 'd',
        descricao: 'descricao',
      }

      const response = await apiClient.post(`clientes/${client.id}/transacoes`).json(request)

      response.assertStatus(200)
      response.assertBody({
        limite: client.limit,
        saldo: client.balance - request.valor,
      })

      const updatedClient = await Client.findOrFail(client.id)
      assert.equal(updatedClient.balance, client.balance - request.valor)
    }
  )

  test('it should not be able to create a transaction to a inexistent client').run(
    async ({ client }) => {
      const request = {
        valor: faker.number.int({ min: 10_000, max: 100_000 }),
        tipo: 'd',
        descricao: 'descricao',
      }

      const response = await client.post(`clientes/100/transacoes`).json(request)

      response.assertStatus(404)
    }
  )

  test('it should not be able to create a transaction with invalid data').run(
    async ({ client: apiClient }) => {
      const client = await ClientFactory.create()

      const request = {
        valor: 1.2,
        tipo: 'something',
        descricao: 'Long text with more than 10 characters',
      }

      const response = await apiClient.post(`clientes/${client.id}/transacoes`).json(request)

      response.assertStatus(422)
    }
  )

  test(
    'it should not be able to create a debit transaction with lower amount than client limit'
  ).run(async ({ client: apiClient }) => {
    const client = await ClientFactory.merge({ limit: 1000 }).create()

    const request = {
      valor: 1001,
      tipo: 'd',
      descricao: 'descricao',
    }

    const response = await apiClient.post(`clientes/${client.id}/transacoes`).json(request)

    response.assertStatus(422)
  })
})
