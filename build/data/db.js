'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tslib_1 = require('tslib')
/* eslint-disable functional/functional-parameters */
const TaskEither_1 = require('fp-ts/lib/TaskEither')
const knex_1 = tslib_1.__importDefault(require('knex'))
const knexfile_1 = tslib_1.__importDefault(require('../knexfile'))
const db = knex_1.default(knexfile_1.default.development)
exports.find = TaskEither_1.tryCatch(
  () => new Promise(resolve => resolve(db('users'))),
  reason => new Error(String(reason))
)
exports.findById = id =>
  db('users')
    .where({ id: Number(id) })
    .first()
exports.insert = async user => (await db('users').insert(user))[0]
exports.update = (id, user) =>
  db('users')
    .where('id', Number(id))
    .update(user)
exports.remove = id =>
  db('users')
    .where('id', Number(id))
    .del()
