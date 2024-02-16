/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const TransactionsController = () => import('#controllers/transactions_controller')
const ExtractsController = () => import('#controllers/extracts_controller')

router.get('/', () => ({ message: 'ok' }))

router.post('/clientes/:id/transacoes', [TransactionsController, 'store'])
router.get('/clientes/:id/extrato', [ExtractsController, 'show'])
