import factory from '@adonisjs/lucid/factories'
import Transaction, { TransactionType } from '#models/transaction'

export const TransactionFactory = factory
  .define(Transaction, async ({ faker }) => {
    return {
      amount: faker.number.int({ min: 1_000, max: 10_000 }),
      description: faker.lorem.word({ length: { min: 1, max: 10 } }),
      type: faker.helpers.enumValue(TransactionType),
    }
  })
  .build()
