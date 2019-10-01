// *************************************************
// Game thing
// *************************************************

// -------------------------------------------------
// Refereneces 

const left_btn = document.getElementById('left-btn')
const up_btn = document.getElementById('up-btn')
const down_btn = document.getElementById('down-btn')
const right_btn = document.getElementById('right-btn')
const sprite = document.getElementById('sprite')
const coords = document.getElementById('coords')
const container = document.getElementById('container')
const scoreCard = document.getElementById('score-card')
  
// --------------------------
// Variables 

const xyOffset = 64;

let score = 0

let x = xyOffset
let y = xyOffset
let targetX = x 
let targetY = y
const minX = xyOffset - 100
const maxX = xyOffset + (100 * 4)
const minY = xyOffset - 100
const maxY = xyOffset + (100 * 4)
let direction = 1

const timePerBomb = 1000
const timePerFruit = 3000

function moveSprite() {
  x -= (x - targetX) * 0.1
  sprite.style.setProperty('--x', x)
  y -= (y - targetY) * 0.1
  sprite.style.setProperty('--y', y)
}

function updateCoords() {
  // coords.innerHTML = `X:${x.toFixed(1)} Y:${y.toFixed(1)}`
}
  
function updateBackground() {
  container.style.setProperty('--x', x / -1)
  container.style.setProperty('--y', y / -1)
}

function moveLeft() {
  if (targetX > minX) {
    targetX -= 100
    updateBackground()
  }
}

function moveRight() {
  if (targetX < maxX) {
    targetX += 100
    updateBackground()
  }
}

function moveUp() {
  if (targetY > minY) {
    targetY -= 100
    updateBackground()
  }
}

function moveDown() {
  if (targetY < maxY) {
    targetY += 100
    updateBackground()
  }
}
  
// Controls 
left_btn.onclick = function(e) {
  moveLeft()
}
  
right_btn.onclick = function(e) {
  moveRight()
}
  
up_btn.onclick = function(e) {
  moveUp()
}
  
down_btn.onclick = function(e) {
  moveDown()
}

// Listen for keys

document.onkeydown = function(e) {
  const { code } = e
  switch(code) {
    case 'ArrowLeft': 
      moveLeft()
      break
    case 'ArrowRight':
      moveRight()
      break
    case 'ArrowUp':
      moveUp()
      break
    case 'ArrowDown':
      moveDown()
      break
  }
}
  
function random(range) {
  return Math.floor(Math.random() * range)
}
  
const bombs = []

function makeBomb(type) {
  const el = document.createElement('div')
  el.classList.add(type)
  container.appendChild(el)

  const randomXY = random(4) * 100 + xyOffset
  let x = 0
  let y = 0
  let dx = 0
  let dy = 0
  
  switch(random(4)) {
    case 0: // top
      x = randomXY
      y = -100
      dx = 0
      dy = 1
      break

    case 1: // right
      x = 500
      y = randomXY
      dx = -1
      dy = 0
      break

    case 2: // bottom
      x = randomXY
      y = 500
      dx = 0
      dy = -1
      break

    case 3: // left
      x = -100
      y = randomXY
      dx = 1
      dy = 0
      break
  }

  el.style.left = `${x}px`
  el.style.top = `${y}px`

  // x = 0 + xyOffset
  // y = 300 + xyOffset
  // dx = 0
  // dy = 0

  dx = type === 'bomb' ? dx * 3 : dx * 1
  dy = type === 'bomb' ? dy * 3 : dy * 1

  const bomb = {
    el,
    x, y,
    dx, dy, 
    type
  }

  bombs.push(bomb)
}

function makeExplosion(x, y) {
  const el = document.createElement('div')
  container.appendChild(el)
  el.classList.add('explosion')
  el.style.left = `${x}px`
  el.style.top = `${y}px`
  setTimeout(() => {
    el.parentNode.removeChild(el)
  }, 1000)
}

function makeSparklyExplosion(x, y) {
  const el = document.createElement('div')
  container.appendChild(el)
  el.classList.add('explosion-sparkly')
  el.style.left = `${x}px`
  el.style.top = `${y}px`
  setTimeout(() => {
    el.parentNode.removeChild(el)
  }, 1000)
} 
  
setInterval(function() {
  makeBomb('bomb')
}, timePerBomb)

setInterval(function() {
  const types = ['apple', 'lemon', 'strawberry']
  const type = types[random(types.length)]
  makeBomb(type)
}, timePerFruit)

makeBomb()

function onFrame() {
  moveSprite()
  updateCoords()
  bombs.forEach((bomb, i, arr) => {
    const { el, dx, dy } = bomb
    bomb.x += dx
    bomb.y += dy
    el.style.left = `${bomb.x}px`
    el.style.top = `${bomb.y}px`

    if (checkForCollision(bomb, {x, y})) {
      if (bomb.type === 'bomb') {
        // do game over stuff
        score -= 5000
        scoreCard.innerHTML = score
        makeExplosion(bomb.x - 32, bomb.y - 32)
      } else {
        score += 1000
        scoreCard.innerHTML = score
        makeSparklyExplosion(bomb.x - 32, bomb.y - 32)
      }
      el.parentNode.removeChild(el)
      arr.splice(i, 1)
      return
    }

    if (bomb.x < -100 || bomb.x > 500 || bomb.y < -100 || bomb.y > 500) {
      el.parentNode.removeChild(el)
      arr.splice(i, 1)
    }
  })

  requestAnimationFrame(onFrame)
}

requestAnimationFrame(onFrame)

function checkForCollision(obja, objb) {
  const dx = Math.abs(obja.x - objb.x)
  const dy = Math.abs(obja.y - objb.y)
  const offset = xyOffset / 1

  if (dx < offset && dy < offset) {
    return true
  }

  return false
}
