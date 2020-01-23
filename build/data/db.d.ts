import Knex from 'knex';
export declare const find: import('fp-ts/lib/TaskEither').TaskEither<
  Error,
  Knex.QueryBuilder<any, any>
>;
export declare const findById: (id: string) => Knex.QueryBuilder<any, any>;
export declare const insert: (user: {
  readonly name: string;
  readonly bio: string;
}) => Promise<number>;
export declare const update: (
  id: string,
  user: {
    readonly name: string;
    readonly bio: string;
  }
) => Knex.QueryBuilder<any, any>;
export declare const remove: (id: string) => Knex.QueryBuilder<any, any>;
