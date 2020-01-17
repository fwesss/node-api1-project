/* eslint-disable functional/functional-parameters */
import { tryCatch } from 'fp-ts/lib/TaskEither'
import Knex, { QueryBuilder } from 'knex'

import knexConfig from '../knexfile'

const db: Knex = Knex(knexConfig.development as Knex.Config)

export const find = tryCatch<Error, QueryBuilder>(
  () => new Promise(resolve => resolve(db('users'))),
  reason => new Error(String(reason))
)

export const findById = (id: string): QueryBuilder =>
  db('users')
    .where({ id: Number(id) })
    .first()

export const insert = async (user: {
  readonly name: string
  readonly bio: string
}): Promise<number> => (await db('users').insert(user))[0]

export const update = (
  id: string,
  user: { readonly name: string; readonly bio: string }
): QueryBuilder =>
  db('users')
    .where('id', Number(id))
    .update(user)

export const remove = (id: string): QueryBuilder =>
  db('users')
    .where('id', Number(id))
    .del()
