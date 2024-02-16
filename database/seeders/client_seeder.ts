import Client from '#models/client'
import db from '@adonisjs/lucid/services/db'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Client.updateOrCreateMany('id', [
      { id: 1, limit: 100_000 },
      { id: 2, limit: 80_000 },
      { id: 3, limit: 1_000_000 },
      { id: 4, limit: 10_000_000 },
      { id: 5, limit: 500_000 },
    ])

    await db.rawQuery("SELECT setval('clients_id_seq', max(id)) FROM clients;")
  }
}
