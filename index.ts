import { log } from 'console'
import express from 'express'
import { fold } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'

import {
  find as findUsers,
  findById as findUserById,
  insert as insertUser,
  remove as removeUser,
  update as updateUser,
} from './data/db'

const server: express.Application = express()

// eslint-disable-next-line functional/functional-parameters
server.listen(4000, () => log('=== server listening on port 4000 ==='))

server.use(express.json())

server.get('/', (_req, res) => res.send('hello world...'))

server.post('/users', ({ body: userInfo }, res) =>
  !userInfo.name || !userInfo.bio
    ? res.status(400).json({
        success: false,
        errorMessage: 'Please provide name and bio for the user.',
      })
    : insertUser(userInfo)
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
  findUsers()
    .then(usersQuery =>
      pipe(
        usersQuery,
        fold(
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
    .then(log)
)

server.get('/users/:id', ({ params: { id } }, res) =>
  findUserById(id)
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
  removeUser(id)
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
    : updateUser(id, userInfo)
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
