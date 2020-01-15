const express = require('express');
const users = require('./data/db');

const server = express();

server.listen(4000, () => {
  console.log('=== server listening on port 4000 ===');
});

server.use(express.json());

server.get('/', (_req, res) => {
  res.send('hello world...');
});

server.post('/users', (req, res) => {
  const userInfo = req.body;

  if (!userInfo.name || !userInfo.bio) {
    res.status(400).json({
      success: false,
      errorMessage: 'Please provide name and bio for the user.',
    });
  } else {
    users
      .insert(userInfo)
      .then((user) => {
        res.status(201).json({ success: true, user });
      })
      .catch((error) => {
        res.status(500).json({
          success: false,
          errorMessage:
            'There was an error while saving the user to the database',
          error,
        });
      });
  }
});

server.get('/users', (_req, res) => {
  users
    .find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        errorMessage: 'The users information could not be retrieved.',
        err,
      });
    });
});

server.get('/users/:id', (req, res) => {
  users
    .findById(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json({ success: true, user });
      } else {
        res.status(404).json({
          success: false,
          message: 'The user with the specified ID does not exist.',
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        errorMessage: 'The user information could not be retrieved.',
        error,
      });
    });
});

server.delete('/users/:id', (req, res) => {
  users
    .remove(req.params.id)
    .then((deletedUser) => {
      if (deletedUser) {
        res.status(204).end();
      } else {
        res.status(404).json({
          success: false,
          message: 'The user with the specified ID does not exist.',
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        errorMessage: 'The user could not be removed',
        error,
      });
    });
});

server.put('/users/:id', (req, res) => {
  if (!req.body.name || !req.body.bio) {
    res.status(400).json({
      success: false,
      errorMessage: 'Please provide name and bio for the user.',
    });
  } else {
    users
      .update(req.params.id, req.body)
      .then((user) => {
        if (user) {
          res.status(200).json({ success: true, user });
        } else {
          res.status(404).json({
            success: false,
            message: 'The user with the specified ID does not exist.',
          });
        }
      })
      .catch((error) => {
        res.status(500).json({
          success: false,
          errorMessage: 'The user information could not be modified.',
          error,
        });
      });
  }
});
