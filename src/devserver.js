import http from 'http'
import path from 'path'
import express from 'express'
import socketio from 'socket.io'
import webpack from 'webpack'
import gameloop from 'node-gameloop'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../webpack/webpack.config.dev'
import { flow, values, filter, map } from 'lodash/fp'

const compiler = webpack(webpackConfig)
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const getInfo = flow(values, filter(s => s.info), map(({info}) => info))
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min

app
  .use(webpackDevMiddleware(compiler, { publicPath: webpackConfig.output.publicPath }))
  .use(webpackHotMiddleware(compiler))
  .use('/static', express.static(path.join(__dirname, '../static'), {maxAge: 365 * 24 * 60 * 60}))
  .get('*', (req, res) => res.sendFile(path.join(__dirname, './index.html')))

let players = {}

io.sockets.on('connection', (socket) => {
  socket.send('connected')
  socket.on('disconnect', (data) => players[socket.name].status = 'dead')
  socket.on('message', (data) => {
    const { vx, vy } = data
    if (vy === -1 || vy === 0 || vy === 1) {
      players[socket.name].vy = vy
    }
    if (vx === -1 || vx === 0 || vx === 1) {
      players[socket.name].vx = vx
    }
  })
  socket.on('authenticate', function (name) {
    if (!name) return console.log('have no token!!')
    socket.name = name
    players[name] = { name, x: 0, y: 0, vy: 0, vx: 0 }
  })
})

const id = gameloop.setGameLoop(function (delta) {

  values(players).forEach((s) => {
    players[s.name] = {
      ...players[s.name],
      x: players[s.name].x + 150 * players[s.name].vx * delta,
      y: players[s.name].y + 150 * players[s.name].vy * delta
    }
  })

  io.emit('players', players)
}, 1000 / 30)

server.listen(3000, err => console.log(err || 'Listening at port 3000 in development'))
