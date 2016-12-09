const character = new Image()
character.src = 'static/img/sprites/44808.png'

export default function (ctx, delta, player, other=false) {
  const animationSpeed = parseInt(delta / 250)
  let animation = 'stand'

  const animations = {
    stand: [
      { x: 5, y: 11 },
    ],
    left: [
      { x: 11, y: 9},
      { x: 7, y: 11}
    ],
    right: [
      { x: 3, y: 11},
      { x: 0, y: 8}
    ],
    down: [
      { x: 5, y: 11 },
      { x: 9, y: 9 }
    ],
    up: [
      { x: 1, y: 11 },
      { x: 5, y: 9 }
    ]
  }

  if (player.vx === -1) animation = 'left'
  if (player.vx === 1) animation = 'right'
  if (player.vy === -1) animation = 'up'
  if (player.vy === 1) animation = 'down'

  ctx.drawImage(character,
    0 + 64 * animations[animation][animationSpeed % animations[animation].length].x,
    0 + 64 * animations[animation][animationSpeed % animations[animation].length].y,
    66, 66,
    (other ? player.x : ctx.canvas.width / 2) - 32,
    (other ? player.y : ctx.canvas.height / 2) - 32,
    64, 64)
}
