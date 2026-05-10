/* 
   Integrantes:
   * Pincay Baque John Alexander
   * Zambrano Mendoza Nelson Gustavo
*/

const playBoard = document.querySelector(".zona");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const pantallaPerdiste = document.getElementById("pantalla-perdiste");

let gameOver = false;
let juegoIniciado = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [[5, 5], [4, 5]]; 
let setIntervalId;
let score = 0;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `Record: ${highScore}`;

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    gameOver = true;
    pantallaPerdiste.style.display = "flex"; 
}

const resetGame = () => {
    gameOver = false;
    juegoIniciado = false;
    snakeX = 5; snakeY = 5;
    velocityX = 0; velocityY = 0;
    snakeBody = [[5, 5], [4, 5]];
    score = 0;
    scoreElement.innerText = `Puntuación: ${score}`;
    pantallaPerdiste.style.display = "none";
    updateFoodPosition();
    renderizar();
}

const changeDirection = e => {
    if (gameOver) {
        resetGame();
    }

    const teclasValidas = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    if (!teclasValidas.includes(e.key)) return;

    // Si es el primer movimiento, iniciamos el intervalo
    if (!juegoIniciado) {
        juegoIniciado = true;
        clearInterval(setIntervalId);
        setIntervalId = setInterval(mainLoop, 100);
    }

    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0; velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0; velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1; velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1; velocityY = 0;
    }
}

const mainLoop = () => {
    if(gameOver) return handleGameOver();
    
    // 1. Actualizar posiciones
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); 
        score++;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Puntuación: ${score}`;
        highScoreElement.innerText = `Record: ${highScore}`;
    }

    snakeX += velocityX;
    snakeY += velocityY;

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];

    // 2. Comprobar colisiones
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return handleGameOver();
    }

    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeBody[0][0] === snakeBody[i][0] && snakeBody[0][1] === snakeBody[i][1]) {
            return handleGameOver();
        }
    }

    // 3. Dibujar
    renderizar();
}

const renderizar = () => {
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    for (let i = 0; i < snakeBody.length; i++) {
        let clase = (i === 0) ? "snake-head" : "snake";
        html += `<div class="${clase}" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    }
    playBoard.innerHTML = html;
}

// Inicialización
updateFoodPosition();
renderizar();
document.addEventListener("keydown", changeDirection);