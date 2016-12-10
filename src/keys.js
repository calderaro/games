import keyboard from 'keyboardjs'

function handleKeys (io, state) {
  keyboard.bind(
    ['w', 's', 'a', 'd'],
    (e) => {
      e.preventRepeat()
      state.keys.push(e.key)

      const windex = state.keys.indexOf('w')
      const sindex = state.keys.indexOf('s')
      const aindex = state.keys.indexOf('a')
      const dindex = state.keys.indexOf('d')

      if (windex > -1 || sindex > -1) state.movement.vy = windex > sindex ? -1 : 1
      if (aindex > -1 || dindex > -1) state.movement.vx = aindex > dindex ? -1 : 1

      io.emit('message', state.movement)
    },
    (e) => {
      state.movement.vy = 0
      state.movement.vx = 0
      state.keys = state.keys.filter(k => k !== e.key)

      const windex = state.keys.indexOf('w')
      const sindex = state.keys.indexOf('s')
      const aindex = state.keys.indexOf('a')
      const dindex = state.keys.indexOf('d')

      if (windex > -1 || sindex > -1) state.movement.vy = windex > sindex ? -1 : 1
      if (aindex > -1 || dindex > -1) state.movement.vx = aindex > dindex ? -1 : 1

      io.emit('message', state.movement)
    }
  )
}

export default handleKeys
