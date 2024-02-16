import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'clients'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('limit').unsigned()
      table.integer('balance').defaultTo(0)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
