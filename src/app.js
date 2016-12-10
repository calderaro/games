import document from 'global/document'
import window from 'global/window'
import sio from 'socket.io-client'
import keyboard from 'keyboardjs'
import Player from './player'
import map from './map'

const dead = new Image()
const floors = new Image()
dead.src = 'static/img/sprites/11.gif'
floors.src = 'static/img/sprites/73145.png'

let state = { vx: 0, vy: 0, players: {} }
let keys = []
const name = Math.random()
const io = sio()
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.body.appendChild(canvas)
document.body.style = 'padding:0;margin:0;width:100vw;height:100vh'

io.on('connect', () => io.emit('authenticate', name))
io.on('message', (data) => console.log(data))
io.on('players', (data) => state.players = data)

keyboard.bind(
  ['w', 's', 'a', 'd'],
  (e) => {
    e.preventRepeat()
    keys.push(e.key)

    const windex = keys.indexOf('w')
    const sindex = keys.indexOf('s')
    const aindex = keys.indexOf('a')
    const dindex = keys.indexOf('d')

    if (windex > -1 || sindex > -1) state.vy = windex > sindex ? -1 : 1
    if (aindex > -1 || dindex > -1) state.vx = aindex > dindex ? -1 : 1

    io.emit('message', state)
  },
  (e) => {
    state.vy = 0
    state.vx = 0
    keys = keys.filter(k => k !== e.key)

    const windex = keys.indexOf('w')
    const sindex = keys.indexOf('s')
    const aindex = keys.indexOf('a')
    const dindex = keys.indexOf('d')

    if (windex > -1 || sindex > -1) state.vy = windex > sindex ? -1 : 1
    if (aindex > -1 || dindex > -1) state.vx = aindex > dindex ? -1 : 1

    io.emit('message', state)
  }
)

function draw (time) {
  const players = Object.values(state.players)
  const player = players.filter(p => p.name === name)[0] || {}
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (let y = 0; y <= 63; y++) {
    for (let x = 0; x <= 63; x++) {
      const dx = (map.x - player.x) + ctx.canvas.width / 2 + (x * 31)
      const dy = (map.y - player.y) + ctx.canvas.height / 2 + (y * 31)
      switch (map.tiles[x + 64 * y]) {
        case 0:
          ctx.drawImage(floors,
            32 * 5,
            32 * 11,
            32, 32,
            dx,
            dy,
            32, 32
          )
          break
        case 1:
          ctx.drawImage(floors,
            32 * 6,
            32 * 11,
            32, 32,
            dx,
            dy,
            32, 32
          )
          break
        case 2:
          ctx.drawImage(floors,
            32 * 7,
            32 * 11,
            32, 32,
            dx,
            dy,
            32, 32
          )
          break
        default:
          ctx.drawImage(floors,
            32 * 6,
            32 * 11,
            32, 32,
            dx,
            dy,
            32, 32
          )
      }
    }
  }

  ctx.fillStyle = 'red'
  players.filter(p => p.name !== name).forEach(p => {
    if (p.status === 'dead') {
      ctx.drawImage(dead, 0, 0, 32, 32, p.x - player.x + ctx.canvas.width / 2, p.y - player.y + ctx.canvas.height / 2, 32, 32)
    } else {
      const other = {...p, x: p.x - player.x, y: p.y - player.y}
      Player(ctx, time, other, true)
    }
  })
  Player(ctx, time, player)
  ctx.fillText('x: ' + parseInt(player.x, 10) + ' y: ' + parseInt(player.y, 10) + ' p: ' + players.length, 2, 10)
  window.requestAnimationFrame(draw)
}
window.requestAnimationFrame(draw)

if (module.hot) {
  module.hot.accept()
  const body = document.body
  while (body.firstChild) {
    body.removeChild(body.firstChild)
  }
  document.body.appendChild(canvas)
}
