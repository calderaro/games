import document from 'global/document'
import window from 'global/window'
import sio from 'socket.io-client'
import Player from './player'
import handleKeys from './keys'
import drawWorld from './world'
import throttle from 'lodash/throttle'

const s73145 = new Image()
s73145.src = 'static/img/sprites/73145.png'
const s74873 = new Image()
s74873.src = 'static/img/sprites/74873.png'
const sets = {
  '73145': s73145,
  '74873': s74873
}

let state = { name: Math.random(), movement: { vx: 0, vy: 0 }, players: {}, keys: [], items: {}, mouse: { x: 0, y: 0 } }
const io = sio()
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.body.appendChild(canvas)
document.body.style = 'padding:0;margin:0;width:100vw;height:100vh;cursor:pointer'

io.on('connect', () => io.emit('authenticate', state.name))
io.on('message', (data) => console.log(data))
io.on('players', (data) => state.players = data)
io.on('items', (data) => state.items = data)

handleKeys(io, state)

function draw (time) {
  const { x: mouseX, y: mouseY } = state.mouse
  const data = Object.values({...state.players, ...state.items})
  const player = data.filter(p => p.name === state.name)[0] || {}
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  drawWorld(ctx, state)

  data.filter(p => p.name !== state.name).forEach(p => {
    const offSetX = p.x - player.x + ctx.canvas.width / 2
    const offSetY = p.y - player.y + ctx.canvas.height / 2

    if (p.status === 'dead') {
      ctx.drawImage(sets['73145'], 32 * 9, 0, 32, 31, offSetX, offSetY, 32, 32)
    } else if (p.type === 'item') {
      ctx.drawImage(
        sets[p.set || '73145'],
        32 * p.ix,
        32 * p.iy,
        32, 31,
        p.x - player.x + ctx.canvas.width / 2,
        p.y - player.y + ctx.canvas.height / 2,
        32, 32)
    } else {
      Player(ctx, time, {...p, x: offSetX, y: offSetY}, true)
    }
  })

  Player(ctx, time, player)
  ctx.fillText('x: ' + parseInt(player.x, 10) + ' y: ' + parseInt(player.y, 10) + ' p: ' + data.length, 2, 10)
  window.requestAnimationFrame(draw)
}
window.requestAnimationFrame(draw)

function setMousePos (evt) {
  const rect = canvas.getBoundingClientRect() // abs. size of element
  const scaleX = canvas.width / rect.width    // relationship bitmap vs. element for X
  const scaleY = canvas.height / rect.height  // relationship bitmap vs. element for Y

  state.mouse = {
    x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
    y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
  }
}

canvas.addEventListener('mousemove', throttle(setMousePos, 30), false)
canvas.addEventListener('click', () => {
  const { x: mouseX, y: mouseY } = state.mouse
  Object.values({...state.players, ...state.items}).forEach(p => {
    const offSetX = p.x - state.players[state.name].x + ctx.canvas.width / 2
    const offSetY = p.y - state.players[state.name].y + ctx.canvas.height / 2
    if (p.type === 'item' &&
        mouseX > (p.x - state.players[state.name].x) + ctx.canvas.width / 2 &&
        mouseX < (p.x - state.players[state.name].x) + ctx.canvas.width / 2 + 32 &&
        mouseY > (p.y - state.players[state.name].y) + ctx.canvas.height / 2 &&
        mouseY < (p.y - state.players[state.name].y) + ctx.canvas.height / 2 + 32
      ) {
      if (p.type === 'item') return console.log('you see item ' + (p.name || '') + ' ' + (p.message || ''))
    }
    if (mouseX > offSetX && mouseX < offSetX + 32 && mouseY > offSetY && mouseY < offSetY + 32) {
      if (p.name === state.name) return console.log('you see your self ' + p.name)
      if (p.type === 'player' && p.status === 'dead') console.log('you see a dead player ')
      if (p.type === 'player' && p.status !== 'dead') console.log('you see other player ')
    }
  })

}, false)

window.onresize = function (event) {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

if (module.hot) {
  module.hot.accept()
  const body = document.body
  while (body.firstChild) {
    body.removeChild(body.firstChild)
  }
  document.body.appendChild(canvas)
}
