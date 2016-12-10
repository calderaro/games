import map from './map'
const floors = new Image()
floors.src = 'static/img/sprites/73145.png'

function drawSprite (ctx, img, ix, iy, dx, dy) {
  ctx.drawImage(floors,
    32 * ix,
    32 * iy,
    32, 32,
    dx,
    dy,
    32, 32
  )
}
map.tiles[32 + 64 * 32] = 3

export default function world (ctx, state) {
  const players = Object.values(state.players)
  const player = players.filter(p => p.name === state.name)[0] || {}
  const offSetX = (map.x - player.x) + ctx.canvas.width / 2 + 32
  const offSetY = (map.y - player.y) + ctx.canvas.height / 2 + 32
  const { x: mouseX, y: mouseY } = state.mouse

  for (let y = 0; y <= 63; y++) {
    for (let x = 0; x <= 63; x++) {
      const dx = offSetX + (x * 31)
      const dy = offSetY + (y * 31)

      if (dx < -32 || dx > ctx.canvas.width + 32) continue
      if (dy < -32 || dy > ctx.canvas.height + 32) continue
      if (mouseX > dx && mouseX < dx + 32 && mouseY > dy && mouseY < dy + 32) {
        //map.tiles[x + 64 * y] = 3
        drawSprite(ctx, floors, 8, 11, dx, dy)
        continue
      }

      switch (map.tiles[x + 64 * y]) {
        case 0:
          drawSprite(ctx, floors, 5, 11, dx, dy)
          break
        case 1:
          drawSprite(ctx, floors, 6, 11, dx, dy)
          break
        case 2:
          drawSprite(ctx, floors, 7, 11, dx, dy)
          break
        case 3:
          drawSprite(ctx, floors, 8, 11, dx, dy)
          break
        default:
          drawSprite(ctx, floors, 6, 11, dx, dy)
      }
      //ctx.fillRect(state.mouse.x - 16, state.mouse.y - 16, 31, 31)
    }
  }
}
