'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const knex_1 = tslib_1.__importDefault(require('knex'));
const knexfile_1 = tslib_1.__importDefault(require('../knexfile'));
const db = knex_1.default(knexfile_1.default.development);
exports.find = () => db('users');
exports.findById = (id) =>
  db('users')
    .where({ id: Number(id) })
    .first();
exports.insert = async (user) => {
  const ids = await db('users').insert(user);
  return { id: ids[0] };
};
exports.update = (id, user) =>
  db('users')
    .where('id', Number(id))
    .update(user);
exports.remove = (id) =>
  db('users')
    .where('id', Number(id))
    .del();
