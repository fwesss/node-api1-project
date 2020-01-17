'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tslib_1 = require('tslib')
const console_1 = require('console')
const express_1 = tslib_1.__importDefault(require('express'))
const Either_1 = require('fp-ts/lib/Either')
const pipeable_1 = require('fp-ts/lib/pipeable')
const db_1 = require('./data/db')
const server = express_1.default()
// eslint-disable-next-line functional/functional-parameters
server.listen(4000, () =>
  console_1.log('=== server listening on port 4000 ===')
)
server.use(express_1.default.json())
server.get('/', (_req, res) => res.send('hello world...'))
server.post('/users', ({ body: userInfo }, res) =>
  !userInfo.name || !userInfo.bio
    ? res.status(400).json({
        success: false,
        errorMessage: 'Please provide name and bio for the user.',
      })
    : db_1
        .insert(userInfo)
        .then(user => res.status(201).json({ success: true, user }))
        .catch(error =>
          res.status(500).json({
            success: false,
            errorMessage:
              'There was an error while saving the user to the database',
            error,
          })
        )
)
server.get('/users', (_req, res) =>
  db_1
    .find()
    .then(usersQuery =>
      pipeable_1.pipe(
        usersQuery,
        Either_1.fold(
          error =>
            res.status(500).json({
              success: false,
              errorMessage: 'The users information could not be retrieved.',
              error,
            }),
          users => res.status(200).json(users)
        )
      )
    )
    .then(console_1.log)
)
server.get('/users/:id', ({ params: { id } }, res) =>
  db_1
    .findById(id)
    .then(user =>
      user
        ? res.status(200).json({ success: true, user })
        : res.status(404).json({
            success: false,
            message: 'The user with the specified ID does not exist.',
          })
    )
    .catch(error =>
      res.status(500).json({
        success: false,
        errorMessage: 'The user information could not be retrieved.',
        error,
      })
    )
)
server.delete('/users/:id', ({ params: { id } }, res) =>
  db_1
    .remove(id)
    .then(deletedUser =>
      deletedUser
        ? res.status(204).end()
        : res.status(404).json({
            success: false,
            message: 'The user with the specified ID does not exist.',
          })
    )
    .catch(error =>
      res.status(500).json({
        success: false,
        errorMessage: 'The user could not be removed',
        error,
      })
    )
)
server.put('/users/:id', ({ body: userInfo, params: { id } }, res) =>
  !userInfo.name || !userInfo.bio
    ? res.status(400).json({
        success: false,
        errorMessage: 'Please provide name and bio for the user.',
      })
    : db_1
        .update(id, userInfo)
        .then(user =>
          user
            ? res.status(200).json({ success: true, user })
            : res.status(404).json({
                success: false,
                message: 'The user with the specified ID does not exist.',
              })
        )
        .catch(error =>
          res.status(500).json({
            success: false,
            errorMessage: 'The user information could not be modified.',
            error,
          })
        )
)
