import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('client_id').unsigned().references('clients.id').onDelete('CASCADE')
      table.integer('amount').unsigned()
      table.enum('type', ['c', 'd'])
      table.string('description', 10)

      table.timestamp('created_at')

      table.index(['client_id', 'created_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
