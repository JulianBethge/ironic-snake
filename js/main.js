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
        this.levels = {
            EASY: 5,
            NORMAL: 10,
            HARD: 15
        };
        this.currentLevel = this.levels.NORMAL;
        this.loopInterval = 1000 / this.currentLevel;
        this.gameStatus = {
            STOPPED: 'stopped',
            RUNNING: 'running',
            PAUSED: 'paused'
        };
        this.currentGameStatus = this.gameStatus.STOPPED;
        this.welcomeContainer = document.getElementById("welcome-container");
        this.settingsContainer = document.getElementById("settings-container");
        this.board = document.getElementById("board");
        this.settings = null;
    }

    setupHud(settings) {
        this.settings = settings;
        this.showContainer(this.welcomeContainer);
        this.hideContainer(this.settingsContainer);

        const startBtn = document.querySelector(".start");
        const settingsBtn = document.querySelector(".settings");

        startBtn.addEventListener("click", () => this.startBtnClickHandler());
        settingsBtn.addEventListener("click", () => this.settingsBtnClickHandler());
        this.setupKeyboardEventListeners();
    }

    startBtnClickHandler() {
        this.hideContainer(this.welcomeContainer);
        this.resetGame();
        this.setupGame();
    }

    settingsBtnClickHandler() {
        this.hideContainer(this.welcomeContainer);
        this.showSettings();
    }

    showSettings() {
        this.showContainer(this.settingsContainer);
        const okBtn = document.querySelector(".ok");
        okBtn.addEventListener("click", () => this.okBtnClickHandler());
    }

    okBtnClickHandler() {
        if (this.currentGameStatus === this.gameStatus.STOPPED) {
            this.hideContainer(this.settingsContainer);
            this.showContainer(this.welcomeContainer);
        } else if (this.currentGameStatus === this.gameStatus.PAUSED) {
            this.setupSounds();
            this.continue();
        }
    }

    setupGame() {
        this.setupScoreDisplay();
        this.setupSounds();
        this.runGameLoop(this.loopInterval);
        this.gameBoard = new Board(COLUMNS);
        this.squares = this.gameBoard.getSquares();
        this.snakeHead = new SnakeSegment(COLUMNS / 2, COLUMNS / 2);
        this.moveDirection = "right";
        this.snake.push(this.snakeHead);
        this.fruit = new Fruit(this.random());
        this.board.classList.add("gradient-border");
    }

    setupScoreDisplay() {
        const elements = [
            document.getElementById("score-text"),
            document.getElementById("score"),
            document.getElementById("highscore-text"),
            document.getElementById("highscore-storage"),
        ];
        elements.forEach((el) => {
            el.classList.add("color");
        });

        document.getElementById("score").innerText = this.points;
        document.getElementById("highscore-text").innerHTML = "🥇 Highscore:";

        if (localStorage.getItem("highscore")) {
            document.getElementById("highscore-storage").innerText =
                "" + localStorage.getItem("highscore");
        }
        document.getElementById("score").classList.add("border");
    }

    setupSounds() {
        this.biteSound = new Sound("./sounds/notification-for-game-scenes-132473.mp3", this.settings.volume);
        this.lossSound = new Sound("./sounds/pipe-117724.mp3", this.settings.volume);
        this.winSound = new Sound("./sounds/exhilarating-electro-153282.mp3", this.settings.volume);
    }

    runGameLoop(interval) {
        if (this.currentGameStatus !== this.gameStatus.RUNNING) {
            this.currentGameStatus = this.gameStatus.RUNNING
            this.intervalId = setInterval(() => {
                this.handleFruitCollision();
                this.handleMovementInput();
                this.moveSnake();
                this.evaluateGameStatus();
            }, interval);
        }

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
        if (this.points > 100 * COLUMNS ** 2 - 300) {
            this.winSound.play();
            this.createGameOverMessage("win");
        }

        if (this.detectSnakeCollision(this.snake)) {
            this.lossSound.play();
            this.createGameOverMessage("loss");
        }
    }

    pause() {
        if (this.currentGameStatus === this.gameStatus.RUNNING) {
            this.currentGameStatus = this.gameStatus.PAUSED
            clearInterval(this.intervalId);
            this.showSettings()
        }
    }

    continue() {
        if (this.currentGameStatus === this.gameStatus.PAUSED) {
            this.runGameLoop(this.loopInterval)
            this.hideContainer(this.settingsContainer);
        }
    }

    detectEscapeKey() {
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                if (this.currentGameStatus === this.gameStatus.RUNNING) {
                    this.pause();
                } else if (this.currentGameStatus === this.gameStatus.PAUSED) {
                    this.continue();
                }
            }
        });
    }

    detectArrowKeys() {
        document.addEventListener("keydown", (event) => {
            if (this.currentGameStatus === this.gameStatus.RUNNING) {
                const lastMove = this.snakeHead.lastMoves.at(-1);
                if (this.keysPressed.length === 0) {
                    if (
                        (lastMove === "left" || lastMove == "right") &&
                        (event.key === "ArrowUp" ||
                            event.key === "w" ||
                            event.key === "W")
                    ) {
                        this.keysPressed.push("up");
                    }
                    if (
                        (lastMove === "up" || lastMove == "down") &&
                        (event.key === "ArrowRight" ||
                            event.key === "d" ||
                            event.key === "D")
                    ) {
                        this.keysPressed.push("right");
                    }
                    if (
                        (lastMove === "left" || lastMove == "right") &&
                        (event.key === "ArrowDown" ||
                            event.key === "s" ||
                            event.key === "S")
                    ) {
                        this.keysPressed.push("down");
                    }
                    if (
                        (lastMove === "up" || lastMove == "down") &&
                        (event.key === "ArrowLeft" ||
                            event.key === "a" ||
                            event.key === "A")
                    ) {
                        this.keysPressed.push("left");
                    }
                }
                if (this.keysPressed.length === 1) {
                    if (
                        (this.keysPressed[0] === "left" ||
                            this.keysPressed[0] == "right") &&
                        (event.key === "ArrowUp" ||
                            event.key === "w" ||
                            event.key === "W")
                    ) {
                        this.keysPressed.push("up");
                    }
                    if (
                        (this.keysPressed[0] === "up" ||
                            this.keysPressed[0] == "down") &&
                        (event.key === "ArrowRight" ||
                            event.key === "d" ||
                            event.key === "D")
                    ) {
                        this.keysPressed.push("right");
                    }
                    if (
                        (this.keysPressed[0] === "left" ||
                            this.keysPressed[0] == "right") &&
                        (event.key === "ArrowDown" ||
                            event.key === "s" ||
                            event.key === "S")
                    ) {
                        this.keysPressed.push("down");
                    }
                    if (
                        (this.keysPressed[0] === "up" ||
                            this.keysPressed[0] == "down") &&
                        (event.key === "ArrowLeft" ||
                            event.key === "a" ||
                            event.key === "A")
                    ) {
                        this.keysPressed.push("left");
                    }
                }
            }
        });
    }


    setupKeyboardEventListeners() {
        this.detectEscapeKey();
        this.detectArrowKeys();
    }

    detectFruitCollision(fruit) {
        if (
            this.snakeHead.positionX === fruit.positionX &&
            this.snakeHead.positionY === fruit.positionY
        ) {
            this.createSegment(this.snake.at(-1));
            return true;
        }
    }

    detectSnakeCollision(snakeBody) {
        let hasCollided = false;

        const head = snakeBody.slice(0, 1);
        const body = snakeBody.slice(1);

        body.forEach((currentSnakeSegment) => {
            if (
                head[0].positionX === currentSnakeSegment.positionX &&
                head[0].positionY === currentSnakeSegment.positionY
            ) {
                hasCollided = true;
            }
        });
        return hasCollided;
    }

    createSegment(lastSnakeSegment) {
        let x = lastSnakeSegment.positionX;
        let y = lastSnakeSegment.positionY;

        if (lastSnakeSegment.lastMoves.at(-1) === "up") {
            y--;
        }
        if (lastSnakeSegment.lastMoves.at(-1) === "right") {
            x--;
        }
        if (lastSnakeSegment.lastMoves.at(-1) === "down") {
            y++;
        }
        if (lastSnakeSegment.lastMoves.at(-1) === "left") {
            x++;
        }

        const sb = new SnakeSegment(x, y);
        this.snake.push(sb);
    }

    random() {
        // Get all coordinates of the snake to exclude them from possible fruit spawn places
        const snakeSquares = this.snake.map((part) => part.position);

        // Get all free squares (where the snake is not)
        const freeSquares = this.squares.filter((square) => {
            let isFree = true;
            for (let i = 0; i < snakeSquares.length; i++) {
                if (
                    snakeSquares[i][0] == square[0] &&
                    snakeSquares[i][1] == square[1]
                ) {
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
        this.currentGameStatus = this.gameStatus.STOPPED;
        clearInterval(this.intervalId);

        if (this.points > localStorage.getItem("highscore")) {
            localStorage.setItem("highscore", this.points);
        }

        this.snake.forEach((segment) => {
            segment.domElement.classList.add("blur");
        });

        this.fruit.domElement.classList.add("blur");

        const gameOverMessage = document.getElementById("status-msg");
        const statusMessage = document.getElementById("end-msg");

        if (result === "loss") {
            gameOverMessage.innerText = "Game Over 😭";
        }
        if (result === "win") {
            gameOverMessage.innerText = "You have won 🤩";
        }

        gameOverMessage.classList.add("game-over-msg");
        statusMessage.innerText = "Ready to try again?";
        this.board.classList.remove("gradient-border");
        this.showContainer(this.welcomeContainer);
    }

    removeSnakeFruit() {
        this.snake.forEach((snakeSegment) => {
            snakeSegment.removeInstance();
        });
        if (this.fruit) this.fruit.removeInstance();
    }

    showContainer(container) {
        container.classList.remove("hidden");
        container.classList.add("container");
        container.classList.add("flex");
    }

    hideContainer(container) {
        container.classList.add("hidden");
        container.classList.remove("container");
        container.classList.remove("flex");
    }


    resetGame() {
        this.removeSnakeFruit();
        clearInterval(this.intervalId);
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
        this.width = FIELDSIZE;
        this.height = FIELDSIZE;
        this.positionX = positionX;
        this.positionY = positionY;
        this.position = [this.positionX, this.positionY];
        this.domElement = null;
        this.createDomElement();
        this.lastMoves = []; // store the last moves
    }

    createDomElement() {
        this.domElement = document.createElement("div");
        this.domElement.className = "snake";
        this.domElement.style.width = this.width + "px";
        this.domElement.style.height = this.height + "px";
        this.domElement.style.left = this.positionX * FIELDSIZE + "px";
        this.domElement.style.bottom = this.positionY * FIELDSIZE + "px";

        // append to the dom
        // const board = document.getElementById("board");
        board.appendChild(this.domElement);
    }

    move(direction) {
        switch (direction) {
            case "up": {
                if (this.positionY < COLUMNS - 1) {
                    this.positionY += 1;
                } else {
                    this.positionY = 0;
                }
                break;
            }
            case "right":
                {
                    if (this.positionX < COLUMNS - 1) {
                        this.positionX += 1;
                    } else {
                        this.positionX = 0;
                    }
                }
                break;
            case "down":
                {
                    if (this.positionY > 0) {
                        this.positionY -= 1;
                    } else {
                        this.positionY = COLUMNS - 1;
                    }
                }
                break;
            case "left": {
                if (this.positionX > 0) {
                    this.positionX -= 1;
                } else {
                    this.positionX = COLUMNS - 1;
                }
            }
        }

        this.updateDomCoordinates(direction);
        this.updateLastMoves(direction);
    }

    updateDomCoordinates(direction) {
        if (direction == "left" || direction == "right") {
            this.domElement.style.left = this.positionX * FIELDSIZE + "px";
        }
        if (direction == "up" || direction == "down") {
            this.domElement.style.bottom = this.positionY * FIELDSIZE + "px";
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
        this.width = FIELDSIZE;
        this.height = FIELDSIZE;

        this.positionX = randomArr[0];
        this.positionY = randomArr[1];

        this.domElement = null;

        this.createDomElement();
    }

    createDomElement() {
        this.domElement = document.createElement("div");
        const leaf1 = document.createElement("div");
        const leaf2 = document.createElement("div");

        this.domElement.className = "fruit";
        leaf1.className = "leaf-1";
        leaf2.className = "leaf-2";

        this.domElement.style.width = this.width + "px";
        this.domElement.style.height = this.height + "px";
        this.domElement.style.bottom = FIELDSIZE * this.positionY + "px";
        this.domElement.style.left = FIELDSIZE * this.positionX + "px";

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
    constructor(src, volume) {
        this.sound = new Audio(src);
        this.sound.volume = volume;
        this.sound.load();
    }

    play() {
        this.sound.currentTime = 0;
        this.sound.play();
    }
}

class Settings {
    constructor(initialSettingValues) {
        this.volumeSlider = document.getElementById("volume-slider");
        this.volumeSlider.value = initialSettingValues.soundVolume;
        this.volumeValue = document.getElementById("volume-value");
        this.volume = this.volumeSlider.value / 100;
        this.volumeSlider.addEventListener("input", this.updateVolume.bind(this));
        this.volumeBubbleSound = new Sound("./sounds/shooting-sound-fx-159024.mp3", this.volume);
    }
    updateVolume() {
        this.volumeValue.textContent = `Volume-Value: ${this.volumeSlider.value}%`;
        this.volume = this.volumeSlider.value / 100;
        this.volumeBubbleSound.sound.volume = this.volume;
        this.volumeBubbleSound.play();
    }
}

//game constants
const COLUMNS = 24; //number of columns/ rows
const FIELDSIZE = Math.floor(board.offsetWidth / COLUMNS);
board.style.width = FIELDSIZE * COLUMNS + "px";
board.style.height = FIELDSIZE * COLUMNS + "px";
const initialSettingValues = {
    soundVolume: 5,
}

//init
const game = new Game();
const settings = new Settings(initialSettingValues);
game.setupHud(settings);