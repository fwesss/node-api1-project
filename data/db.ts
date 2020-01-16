import Knex, { QueryBuilder } from 'knex';

import knexConfig from '../knexfile';

const db: Knex = Knex(knexConfig.development as Knex.Config);

export const find = (): QueryBuilder => db('users');

export const findById = (id: string): QueryBuilder =>
  db('users')
    .where({ id: Number(id) })
    .first();

export const insert = async (user: {
  readonly name: string;
  readonly bio: string;
}): Promise<{ readonly id: number }> => {
  const ids = await db('users').insert(user);
  return { id: ids[0] };
};

export const update = (
  id: string,
  user: { readonly name: string; readonly bio: string }
): QueryBuilder =>
  db('users')
    .where('id', Number(id))
    .update(user);

export const remove = (id: string): QueryBuilder =>
  db('users')
    .where('id', Number(id))
    .del();
