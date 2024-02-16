import factory from '@adonisjs/lucid/factories'
import Client from '#models/client'
import { TransactionFactory } from './transaction_factory.js'

export const ClientFactory = factory
  .define(Client, async ({ faker }) => {
    return {
      limit: faker.number.int({ min: 100_000, max: 1_000_000 }),
      balance: 0,
    }
  })
  .relation('transactions', () => TransactionFactory)
  .build()
