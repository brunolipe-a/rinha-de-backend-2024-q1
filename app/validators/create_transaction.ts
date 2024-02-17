import vine from '@vinejs/vine'

export const createTransaction = vine.compile(
  vine.object({
    valor: vine.number().positive().min(1).withoutDecimals(),
    tipo: vine.enum(['c', 'd']),
    descricao: vine.string().minLength(1).maxLength(10),
  })
)
