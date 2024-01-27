//game constants
const columns = 24; //number of columns/ rows
const fieldSize = Math.floor(board.offsetWidth / columns);
board.style.width = fieldSize * columns + "px";
board.style.height = fieldSize * columns + "px";

class Game {
    constructor() {
        this.snakeHead = null; //  the first segment of the snake, the head, which the player can control
        this.snake = []; // the array of all snake segments
        this.fruit = null;
        this.points = 0;
        this.moveDirection = null;
        this.intervalId = null;
        this.keysPressed = []; // a buffer for pressed keys for better movement control
        this.gameBoard = null;
        this.squares = null;
        this.biteSound = null;
        this.lossSound = null;
        this.winSound = null;
    }

    setupLevelButtonsEventListeners() {
        const overlayBox = document.getElementById('welcome-box');
        const levelButtons = document.querySelectorAll(".skill-btn");
        const levels = {
            1: 5,
            2: 10,
            3: 15
        };
        for (let i = 0; i < levelButtons.length; i++) {
            levelButtons[i].addEventListener("click", this.handleNewGame.bind(this, overlayBox, levels[i + 1]));
        }
    }

    handleNewGame(overlayBox, level) {
        //stops previous game (if there is one) and resets everything:
        if (this.snakeHead !== null && this.snake.length > 0) {
            clearInterval(this.intervalId);
            this.removeSnakeFruit();
            this.resetGame();
        }
        //prepares and starts a new game:
        this.hideOverlay(overlayBox);
        this.initializeGame(level);
    }

    initializeGame(level) {
        this.setupGame();
        this.setupScoreDisplay();
        this.setupSounds();
        const interval = 1000 / level;
        this.runGameLoop(interval);
    }

    setupGame() {
        this.gameBoard = new Board(columns);
        this.squares = this.gameBoard.getSquares();
        this.snakeHead = new SnakeSegment(columns / 2, columns / 2);
        this.moveDirection = "right";
        this.snake.push(this.snakeHead);
        this.fruit = new Fruit(this.random());
        this.setupKeyboardEventListeners();
        
    }

    setupScoreDisplay() {
        const elements = [
            document.getElementById("score-text"),
            document.getElementById("score"),
            document.getElementById("highscore-text"),
            document.getElementById("highscore-storage"),
        ];

        elements.forEach(el => {
            el.classList.add("color");
        });

        document.getElementById("score").innerText = this.points;
        document.getElementById("highscore-text").innerHTML = "🥇 Highscore:";

        if (localStorage.getItem("highscore")) {
            document.getElementById("highscore-storage").innerText = "" + localStorage.getItem("highscore");
        }
        document.getElementById("score").classList.add("border");
        document.getElementById("board").classList.add("gradient-border");
    }

    setupSounds(){
        this.biteSound = new Sound('./sounds/notification-for-game-scenes-132473.mp3');
        this.lossSound = new Sound('./sounds/pipe-117724.mp3');
        this.winSound = new Sound('./sounds/exhilarating-electro-153282.mp3');
    }

    runGameLoop(interval) {
        
        this.intervalId = setInterval(() => {
            this.handleFruitCollision();
            this.handleMovementInput();
            this.moveSnake();
            this.evaluateGameStatus();
        }, interval);
    }

    handleFruitCollision() {
        if (this.detectFruitCollision(this.fruit)) {
            this.biteSound.play();
            this.points += 100;
            score.innerText = this.points;
            this.fruit.removeInstance();
            this.fruit = new Fruit(this.random());
        }
    }

    handleMovementInput() {
        if (this.keysPressed.length > 0) {
            this.moveDirection = this.keysPressed[0];
            this.keysPressed.shift();
        }
    }

    moveSnake() {
        this.snakeHead.move(this.moveDirection);

        for (let i = 1; i < this.snake.length; i++) {
            const secondLastMove = this.snake[i - 1].lastMoves.at(-2);
            this.snake[i].move(secondLastMove);
        }
    }

    evaluateGameStatus() {
        if (this.points > (100 * (columns ** 2)) - 300) {
            this.winSound.play();
            this.createGameOverMessage("win");
        }

        if (this.detectSnakeCollision(this.snake)) {
            this.lossSound.play();
            this.createGameOverMessage("loss");
        }
    }

    setupKeyboardEventListeners() {
        document.addEventListener("keydown", (event) => {
            const lastMove = this.snakeHead.lastMoves.at(-1);

            if (this.keysPressed.length === 0) {
                if ((lastMove === "left" || lastMove == "right") && (event.key === "ArrowUp" || event.key === "w" || event.key === "W")) {
                    this.keysPressed.push("up");
                }
                if ((lastMove === "up" || lastMove == "down") && (event.key === "ArrowRight" || event.key === "d" || event.key === "D")) {
                    this.keysPressed.push("right");
                }
                if ((lastMove === "left" || lastMove == "right") && (event.key === "ArrowDown" || event.key === "s" || event.key === "S")) {
                    this.keysPressed.push("down");
                }
                if ((lastMove === "up" || lastMove == "down") && (event.key === "ArrowLeft" || event.key === "a" || event.key === "A")) {
                    this.keysPressed.push("left");
                }
            }

            if (this.keysPressed.length === 1) {
                if ((this.keysPressed[0] === "left" || this.keysPressed[0] == "right") && (event.key === "ArrowUp" || event.key === "w" || event.key === "W")) {
                    this.keysPressed.push("up");
                }
                if ((this.keysPressed[0] === "up" || this.keysPressed[0] == "down") && (event.key === "ArrowRight" || event.key === "d" || event.key === "D")) {
                    this.keysPressed.push("right");
                }
                if ((this.keysPressed[0] === "left" || this.keysPressed[0] == "right") && (event.key === "ArrowDown" || event.key === "s" || event.key === "S")) {
                    this.keysPressed.push("down");
                }
                if ((this.keysPressed[0] === "up" || this.keysPressed[0] == "down") && (event.key === "ArrowLeft" || event.key === "a" || event.key === "A")) {
                    this.keysPressed.push("left");
                }
            }
        });
    }

    detectFruitCollision(fruit) {
        if (this.snakeHead.positionX === fruit.positionX &&
            this.snakeHead.positionY === fruit.positionY) {
            this.createSegment(this.snake.at(-1));
            return true;
        }
    }

    detectSnakeCollision(snakeBody) {
        let hasCollided = false;

        const head = snakeBody.slice(0, 1);
        const body = snakeBody.slice(1);

        body.forEach((currentSnakeSegment) => {
            if (head[0].positionX === currentSnakeSegment.positionX &&
                head[0].positionY === currentSnakeSegment.positionY) {
                hasCollided = true;
            }
        });
        return hasCollided;
    }

    createSegment(lastSnakeSegment) {
        let x = lastSnakeSegment.positionX;
        let y = lastSnakeSegment.positionY;

        if (lastSnakeSegment.lastMoves.at(-1) === "up") { y--; }
        if (lastSnakeSegment.lastMoves.at(-1) === "right") { x--; }
        if (lastSnakeSegment.lastMoves.at(-1) === "down") { y++; }
        if (lastSnakeSegment.lastMoves.at(-1) === "left") { x++; }

        const sb = new SnakeSegment(x, y);
        this.snake.push(sb);
    }

    random() {
        // Get all coordinates of the snake to exclude them from possible fruit spawn places
        const snakeSquares = this.snake.map(part => part.position);

        // Get all free squares (where the snake is not)
        const freeSquares = this.squares.filter(square => {
            let isFree = true;
            for (let i = 0; i < snakeSquares.length; i++) {
                if (snakeSquares[i][0] == square[0] && snakeSquares[i][1] == square[1]) {
                    isFree = false;
                    break;
                }
            }
            return isFree;
        });

        // Get a random free square
        return freeSquares[Math.floor(Math.random() * freeSquares.length)];
    }

    createGameOverMessage(result) {
        clearInterval(this.intervalId);

        if (this.points > localStorage.getItem("highscore")) {
            localStorage.setItem("highscore", this.points);
        }

        this.snake.forEach(segment => {
            segment.domElement.classList.add("blur");
        });

        this.fruit.domElement.classList.add("blur");
        const overlayBox = document.getElementById("welcome-box");
        const gameOverMessage = document.getElementById("status-msg");
        const skillMessage = document.getElementById("skill-msg");


        if (result === "loss") {
            gameOverMessage.innerText = "Game Over 😭";
        }
        if (result === "win") {
            gameOverMessage.innerText = "You have won 🤩";
        }

        gameOverMessage.classList.add("game-over-msg");
        skillMessage.innerText = "You died...  Start again?";
        overlayBox.classList.remove("hidden");
        overlayBox.classList.add("overlay")
    }

    removeSnakeFruit() {
        this.snake.forEach(snakeSegment => {
            snakeSegment.removeInstance();
        });
        if (this.fruit) this.fruit.removeInstance();
    }

    hideOverlay(overlay) {
        overlay.classList.remove("overlay");
        overlay.classList.add("hidden");
    }

    resetGame() {
        this.snakeHead = null;
        this.snake = [];
        this.fruit = null;
        this.points = 0;
        this.moveDirection = null;
        this.intervalId = null;
        this.keysPressed = [];
    }
}

class SnakeSegment {
    constructor(positionX, positionY) {
        this.width = fieldSize;
        this.height = fieldSize;
        this.positionX = positionX;
        this.positionY = positionY;
        this.position = [this.positionX, this.positionY];
        this.domElement = null;
        this.createDomElement();
        this.lastMoves = []; // store the last moves
    }

    createDomElement() {
        this.domElement = document.createElement('div');
        this.domElement.className = "snake";
        this.domElement.style.width = this.width + "px";
        this.domElement.style.height = this.height + "px";
        this.domElement.style.left = this.positionX * fieldSize + "px";
        this.domElement.style.bottom = this.positionY * fieldSize + "px";

        // append to the dom
        // const board = document.getElementById("board");
        board.appendChild(this.domElement)
    }

    move(direction) {
        switch (direction) {
            case "up": {
                if (this.positionY < columns - 1) {
                    this.positionY += 1;
                } else {
                    this.positionY = 0;
                }
                break;
            }
            case "right": {
                if (this.positionX < columns - 1) {
                    this.positionX += 1;
                } else {
                    this.positionX = 0;
                }
            }
                break;
            case "down": {
                if (this.positionY > 0) {
                    this.positionY -= 1;
                } else {
                    this.positionY = columns - 1;
                }
            }
                break;
            case "left": {
                if (this.positionX > 0) {
                    this.positionX -= 1;
                } else {
                    this.positionX = columns - 1;
                }
            }
        }

        this.updateDomCoordinates(direction);
        this.updateLastMoves(direction);
    }

    updateDomCoordinates(direction) {
        if (direction == "left" || direction == "right") {
            this.domElement.style.left = this.positionX * fieldSize + "px";
        }
        if (direction == "up" || direction == "down") {
            this.domElement.style.bottom = this.positionY * fieldSize + "px";
        }

        this.position = [this.positionX, this.positionY];
    }

    updateLastMoves(direction) {
        this.lastMoves.push(direction);

        if (this.lastMoves.length > 2) {
            this.lastMoves.shift();
        }
    }


    removeInstance() {
        board.removeChild(this.domElement);
    }

}

class Fruit {
    constructor(randomArr) {
        this.width = fieldSize;
        this.height = fieldSize;

        this.positionX = randomArr[0];
        this.positionY = randomArr[1];

        this.domElement = null;

        this.createDomElement();
    }

    createDomElement() {
        this.domElement = document.createElement('div');
        const leaf1 = document.createElement('div');
        const leaf2 = document.createElement('div');

        this.domElement.className = "fruit";
        leaf1.className = "leaf-1";
        leaf2.className = "leaf-2";

        this.domElement.style.width = this.width + "px";
        this.domElement.style.height = this.height + "px";
        this.domElement.style.bottom = fieldSize * this.positionY + "px";
        this.domElement.style.left = fieldSize * this.positionX + "px";

        // append to the dom
        this.domElement.appendChild(leaf1);
        this.domElement.appendChild(leaf2);
        board.appendChild(this.domElement);
    }

    removeInstance() {
        board.removeChild(this.domElement);
    }
}

class Board {
    constructor(columns) {
        this.squares = []; // all coordinates of the board in an array 
        this.setSquares(columns);
    }

    setSquares(columns) {
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < columns; j++) {
                this.squares.push([i, j]);
            }
        }
    }

    getSquares() {
        return this.squares;
    }
}

class Sound {
    constructor(src) {
        this.sound = new Audio(src);
        this.sound.volume = 0.75;
        this.sound.load();
    }

    play() {
        this.sound.currentTime = 0;
        this.sound.play();
    }
}

//init
const game = new Game();
game.setupLevelButtonsEventListeners();