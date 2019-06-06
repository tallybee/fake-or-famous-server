const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const socketIo = require('socket.io')
const usersRouter = require('./users/routes');
const authRouter = require('./auth/routes');
const quotesRouting = require('./quotes/routing')
// const authorRouter = require('./author/routes')
//const gameRouter = require('./game/routes')
const dispatcher = require('./dispatcher')
const routing = require('./routing')
const app = express();
const port = process.env.PORT || 4000;

const server = app.listen(port, () => console.log(`Listening on port ${port}`));
const io = socketIo.listen(server)
const messages = ['goodbye']
const dispatch = dispatcher(io)

const quotesRouter = quotesRouting(dispatch)

app
  .use(cors())
  .use(bodyParser.json())
  .use(usersRouter)
  .use(authRouter)
  .use(quotesRouter)
// .use(authorRouter)
//.use(gameRouter)

io.on(
  'connection',
  client => {
    console.log('client.id test:', client.id)

    dispatch('messages', messages)

    client.on(
      'disconnect',
      () => console.log('disconnect test:', client.id)
    )
  }
)

// io.on('connect', socket => {
//   const userId = socket.request.user.id
//   console.log(`User ${userId} just connected`)

//   socket.on('disconnect', () => {
//     console.log(`User ${userId} just disconnected`)
//   })
// })