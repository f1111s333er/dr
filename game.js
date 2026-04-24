// ===== 🎵 АУДИО СИСТЕМА =====
const musicRoom1 = new Audio("assets/sounds/birthday.mp3")
const musicRoom2 = new Audio("assets/sounds/water.mp3")
const musicRoom3 = new Audio("assets/sounds/city.mp3")

const snakeMusic = new Audio("assets/sounds/snake_music.mp3")
const eatSound = new Audio("assets/sounds/eat.mp3")
const deadSound = new Audio("assets/sounds/dead.mp3")

musicRoom1.loop = true
musicRoom2.loop = true
musicRoom3.loop = true
snakeMusic.loop = true

musicRoom1.volume = 0.4
musicRoom2.volume = 0.3
musicRoom3.volume = 0.3
snakeMusic.volume = 0.4

function stopAllMusic(){
musicRoom1.pause()
musicRoom2.pause()
musicRoom3.pause()
snakeMusic.pause()

musicRoom1.currentTime = 0
musicRoom2.currentTime = 0
musicRoom3.currentTime = 0
snakeMusic.currentTime = 0
}

// ===== DOM =====
const scene = document.getElementById("scene")
const textbox = document.getElementById("textbox")
const text = document.getElementById("text")
const next = document.getElementById("next")
const choice = document.getElementById("choice")

let state = {
bathroom:false,
balcony:false,
phone:false
}

let dialogue=[]
let index=0

function showText(arr,callback){
dialogue=arr
index=0

textbox.style.display="block"
text.innerText=dialogue[index]

next.onclick=()=>{
index++
if(index<dialogue.length){
text.innerText=dialogue[index]
}else{
textbox.style.display="none"
if(callback) callback()
}
}
}

function setScene(img){
scene.style.backgroundImage="url('assets/"+img+"')"
}

// ===== INTRO =====
function intro(){
scene.style.background="black"

document.body.addEventListener("click", ()=>{
musicRoom1.play().catch(()=>{})
}, {once:true})

showText([
"Сегодня твой День Рождение",
"Ты теперь большой, верно?",
"Отпразднуй :)"
], room1)
}

// ===== ROOM 1 =====
function room1(){
stopAllMusic()
musicRoom1.play().catch(()=>{})

setScene("room1.png")
choice.style.display="none"

scene.onclick=(e)=>{

let x=e.offsetX
let y=e.offsetY

// торт
if(x>330 && x<470 && y>250 && y<350){

if(!state.phone){
showText(["Надо немного подождать, прежде чем зажечь свечи"])
}else{
choice.style.display="block"
}
}

// переходы
if(x<80){
room2()
}

if(x>720){
room3()
}

// телефон
if(state.bathroom && state.balcony && !state.phone){
if(x>500 && x<600 && y>300 && y<380){
phoneScene()
}
}

}
}

// ===== ROOM 2 =====
function room2(){
stopAllMusic()
musicRoom2.play().catch(()=>{})

setScene("room2.png")

scene.onclick=(e)=>{
let x=e.offsetX
let y=e.offsetY

// зеркало
if(x>300 && x<450 && y>200 && y<350){
state.bathroom = true
mirrorScene()
}

// попытка выйти
if(y>520){

if(!state.bathroom){
showText(["Я ещё не всё тут осмотрел..."])
return
}

room1()
}
}
}

// ===== MIRROR =====
function mirrorScene(){
setScene("mirror.png")

scene.onclick=(e)=>{
let y=e.offsetY

if(y<200){
showText(["Сегодня я красивее, чем вчера"], room2)
}

if(y>400){
showText(["А, Саничка, это ты"], room2)
}
}
}

// ===== ROOM 3 =====
function room3(){
stopAllMusic()
musicRoom3.play().catch(()=>{})

setScene("room3.png")

scene.onclick=(e)=>{
let x=e.offsetX
let y=e.offsetY

// 🎮 змейка
if(x > 600 && y > 400){

showText([
"Опа. Старый тетрис",
"Сыграть?"
], ()=>{
startSnakeGame()
})

return
}

// 🚬 сигарета
if(x > 50 && x < 502){

showText([
"Ты закурил 1 сигарету",
"Ещё 1 сигарету...",
"...",
"И ещё одну",
"...",
"Я тобой недовольна >:("
], ()=>{
state.balcony = true
room1()
})

return
}

// попытка выйти
if(y > 520){

if(!state.balcony){
showText(["Может, стоит немного задержаться..."])
return
}

room1()
}

}
}

// ===== PHONE =====
function phoneScene(){
state.phone=true

setScene("phone_off.png")

scene.onclick=()=>{
setScene("phone_on.png")

showText([
"С Днем Рождения!",
"Я очень рада, что ты есть",
"Пусть этот год будет лучше предыдущего"
], room1)
}
}

// ===== ТОРТ =====
document.getElementById("lightCandles").onclick=()=>{
choice.style.display="none"
setScene("cake_candles.gif")

showText(["..."], ending)
}

// ===== ENDING =====
function ending(){
stopAllMusic()

scene.onclick = null // 🚫 отключаем клики
scene.style.background = "black"

showText([
"С ДНЕМ РОЖДЕНИЯ, ЧЕСИК!"
], ()=>{
textbox.style.display = "none"
})
}

// ===== SNAKE =====
function startSnakeGame(){

stopAllMusic()
snakeMusic.play().catch(()=>{})

let canvas = document.createElement("canvas")
canvas.width = 400
canvas.height = 400

canvas.style.position = "absolute"
canvas.style.left = "200px"
canvas.style.top = "100px"
canvas.style.border = "2px solid #00ff00"
canvas.style.background = "black"

document.getElementById("game").appendChild(canvas)

let ctx = canvas.getContext("2d")

let snake = [{x:10,y:10}]
let dx = 1
let dy = 0

let food = {
x: Math.floor(Math.random()*20),
y: Math.floor(Math.random()*20)
}

let score = 0
let speed = 120
let gameOver = false

document.onkeydown = (e)=>{
const key = e.key.toLowerCase()

if((key=="w"||key=="ц"||key=="arrowup") && dy==0){dx=0;dy=-1}
if((key=="s"||key=="ы"||key=="arrowdown") && dy==0){dx=0;dy=1}
if((key=="a"||key=="ф"||key=="arrowleft") && dx==0){dx=-1;dy=0}
if((key=="d"||key=="в"||key=="arrowright") && dx==0){dx=1;dy=0}
}

function loop(){

if(gameOver) return

let head = {x: snake[0].x + dx, y: snake[0].y + dy}

// стены
if(head.x < 0 || head.y < 0 || head.x >= 20 || head.y >= 20){
return endGame()
}

// в себя
for(let s of snake){
if(s.x == head.x && s.y == head.y){
return endGame()
}
}

snake.unshift(head)

// еда
if(head.x == food.x && head.y == food.y){
score++
eatSound.play()

food = {
x: Math.floor(Math.random()*20),
y: Math.floor(Math.random()*20)
}

if(score % 3 == 0 && speed > 60){
speed -= 10
}

}else{
snake.pop()
}

// рисуем
ctx.fillStyle = "black"
ctx.fillRect(0,0,400,400)

ctx.strokeStyle = "#003300"
for(let i=0;i<400;i+=20){
ctx.beginPath()
ctx.moveTo(i,0)
ctx.lineTo(i,400)
ctx.stroke()

ctx.beginPath()
ctx.moveTo(0,i)
ctx.lineTo(400,i)
ctx.stroke()
}

ctx.fillStyle = "#00ff00"
ctx.fillRect(food.x*20, food.y*20, 20, 20)

ctx.fillStyle = "#00aa00"
snake.forEach(s=>{
ctx.fillRect(s.x*20, s.y*20, 20, 20)
})

ctx.fillStyle = "#00ff00"
ctx.fillRect(snake[0].x*20, snake[0].y*20, 20, 20)

ctx.fillStyle = "#00ff00"
ctx.font = "14px monospace"
ctx.fillText("SCORE: "+score, 10, 20)

setTimeout(loop, speed)
}

function endGame(){
gameOver = true

canvas.remove()
snakeMusic.pause()
deadSound.play()

let message = "...ну и похуй"

if(score >= 15){
message = "*Змейка придает тебе решимости*"
}else if(score >= 10){
message = "...Энивей, я сократил время"
}

showText([
"SCORE: "+score,
message,
"Ладно, пора обратно"
], ()=>{
state.balcony = true
room1()
})
}

loop()
}

// ===== START =====
intro()