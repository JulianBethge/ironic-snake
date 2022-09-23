//game constants
const columns = 24; //number of columns/ rows
const fieldSize = Math.floor(board.offsetWidth/columns);
board.style.width = fieldSize * columns + "px";
board.style.height = fieldSize * columns + "px";

class Game {
    constructor(){
        this.snakeHead = null; // will be the first SnakeSegment
        this.snake = []; // will be an array of SnakeSegments
        this.fruit = null;
        this.points = 0;
        this.moveDirection = null;
        this.intervalId = null;
        this.keysPressed = []; // Buffer for pressed key
        this.reset();
    }

    //welcome sequence
    welcome(){   
        const welcomeDiv = document.createElement('div');
        const welcomeMessage = document.createElement('div');
        const skillMessage = document.createElement('div');
        const btnGroup = document.createElement('div');
        const skillBtn1 = document.createElement("button");
        const skillBtn2 = document.createElement("button");
        const skillBtn3 = document.createElement("button");
        const instructions = document.createElement('div');

        welcomeDiv.id = "welcome-box";
        welcomeMessage.id = "welcome-msg";
        skillMessage.id = "skill-msg";
        instructions.id ="instructions";
        btnGroup.id = "btn-group";
        skillBtn1.className="skill-btn";
        skillBtn2.className="skill-btn";
        skillBtn3.className="skill-btn";

        welcomeMessage.innerHTML="<h1>Ironic Snake</h1>🐉";
        skillMessage.innerHTML="Choose difficulty level to start:";

        skillBtn1.innerHTML="Easy";
        skillBtn2.innerHTML="Medium";
        skillBtn3.innerHTML="Hard";
        
        instructions.innerHTML = `<h3>Instructions:</h3>
        Control the Snake: Use the arrow keys <strong>⬅️⬆️⬇️➡️</strong> or <strong>WASD</strong><br>
        Eat fruits to grow: 🍎<br>
        And don't bite yourself... 🪦<br>
        Good Luck!`

        welcomeDiv.appendChild(welcomeMessage);
        welcomeDiv.appendChild(skillMessage);
        welcomeDiv.appendChild(btnGroup);
        btnGroup.appendChild(skillBtn1);
        btnGroup.appendChild(skillBtn2);
        btnGroup.appendChild(skillBtn3);
        welcomeDiv.appendChild(instructions);

        board.appendChild(welcomeDiv);

        skillBtn1.addEventListener('click', (event) => {
            board.removeChild(welcomeDiv);
            const level = 5; // the higher the faster does the player move: level-times per second
            const interval = 1000/level; //refresh interval for movement
            this.start(interval)
        });
        skillBtn2.addEventListener('click', (event) => {
            board.removeChild(welcomeDiv);
            const level = 10; 
            const interval = 1000/level; 
            this.start(interval)
        });
        skillBtn3.addEventListener('click', (event) => {
            board.removeChild(welcomeDiv);
            const level = 15;  
            const interval = 1000/level; 
            this.start(interval)
        });

    }
    
    start(interval){
        this.snakeHead = new SnakeSegment(columns/2, columns/2);
        this.moveDirection = "right";
        this.snake.push(this.snakeHead);
        this.fruit = new Fruit(this.random());
        this.attachEventListeners();
        
        const scoreText = document.getElementById("score-text");
        const highscoreText = document.getElementById("highscore-text");
        const highscoreDomElement = document.getElementById("highscore-storage");

        scoreText.classList.add("color");
        score.classList.add("color");
        highscoreText.classList.add("color");
        highscoreDomElement.classList.add("color");
        score.classList.add("border");
        
        score.innerText = this.points;
        highscoreText.innerHTML = "🥇 Highscore:";
        
        if(localStorage.getItem("highscore")){
            highscoreDomElement.innerText = "" + localStorage.getItem("highscore");
        }
        
        //move snake
        this.intervalId = setInterval(() => {

            if(this.detectFruitCollision(this.fruit)){
                this.points += 100;
                score.innerText = this.points;
                this.fruit.removeInstance();
                this.fruit = new Fruit(this.random());
            }
            
            //retrieving keypressed buffer:
            if (this.keysPressed.length>0){
                this.moveDirection = this.keysPressed[0];
                this.keysPressed.shift();  
            }
            
            
            // Iteration through the complete snake array:
            for(let i=0; i<this.snake.length; i++){

                // The movement of the snake's head:
                if (i==0){
                    switch(this.moveDirection){
                        case "up": this.snakeHead.moveUp();
                            break;
                        case "right": this.snakeHead.moveRight();
                            break;
                        case "down": this.snakeHead.moveDown();
                            break;
                        case "left": this.snakeHead.moveLeft();
                            break;
                    }
                    continue;
                }

                // The Movement of the snake's body (if there is one):
                if(this.snake.length > 1){
                    //get the second last move of the preceding snake segment:
                    const secondLastMove = this.snake[i-1].lastMoves.at(-2);  
                    const currentSnakeSegment = this.snake[i];
                    switch(secondLastMove){
                        case "up": currentSnakeSegment.moveUp();
                            break;
                        case "right": currentSnakeSegment.moveRight();
                            break;
                        case "down": currentSnakeSegment.moveDown();
                            break;
                        case "left": currentSnakeSegment.moveLeft();
                            break;

                    }
                }
            }

            if(this.detectSnakeCollision(this.snake)){
                this.createGameOverMessage("loss");
            }

            if(this.points > 100 * (columns-1)**2){
                this.createGameOverMessage("win");
            }
        }, interval);
    }

    attachEventListeners(){
        document.addEventListener("keydown", (event) => {
            const lastMove = this.snakeHead.lastMoves.at(-1);

            if (this.keysPressed.length === 0){
                if ((lastMove === "left" || lastMove == "right") && (event.key === "ArrowUp" || event.key === "w" || event.key === "W") ){
                    this.keysPressed.push("up");
                }
                if ((lastMove === "up" || lastMove == "down") && (event.key === "ArrowRight" || event.key === "d" || event.key === "D")){
                    this.keysPressed.push("right");     
                }
                if ((lastMove === "left" || lastMove == "right") && (event.key === "ArrowDown" || event.key === "s" || event.key === "S")){
                    this.keysPressed.push("down");
                }
                if ((lastMove === "up" || lastMove == "down") && (event.key === "ArrowLeft" || event.key === "a" || event.key === "A")){
                    this.keysPressed.push("left");   
                }
            }

            if (this.keysPressed.length === 1){
                if ((this.keysPressed[0] === "left" || this.keysPressed[0] == "right") && (event.key === "ArrowUp" || event.key === "w" || event.key === "W") ){
                    this.keysPressed.push("up");   
                }
                if ((this.keysPressed[0] === "up" || this.keysPressed[0] == "down") && (event.key === "ArrowRight" || event.key === "d" || event.key === "D")){
                    this.keysPressed.push("right");
                }
                if ((this.keysPressed[0] === "left" || this.keysPressed[0] == "right") && (event.key === "ArrowDown" || event.key === "s" || event.key === "S") ){
                    this.keysPressed.push("down");
                }
                if ((this.keysPressed[0] === "up" || this.keysPressed[0] == "down") && (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") ){
                    this.keysPressed.push("left");   
                }
            }
        });
    }

    detectFruitCollision(fruit){
        if (this.snakeHead.positionX === fruit.positionX && 
            this.snakeHead.positionY === fruit.positionY) {    
            this.createSegment(this.snake.at(-1));
            return true;
        }
    }

    detectSnakeCollision(snakeBody){
        let hasCollided = false;
        
        const head = snakeBody.slice(0,1);
        const body = snakeBody.slice(1);

        body.forEach((currentSnakeSegment) => {
            if (head[0].positionX === currentSnakeSegment.positionX && 
                head[0].positionY === currentSnakeSegment.positionY) {    
                  hasCollided = true;
            }
        });
        return hasCollided;
    }

    createSegment(lastSnakeSegment){
        let x = lastSnakeSegment.positionX;
        let y  = lastSnakeSegment.positionY;

        if(lastSnakeSegment.lastMoves.at(-1) === "up"){y--;}
        if(lastSnakeSegment.lastMoves.at(-1) === "right"){x--;}
        if(lastSnakeSegment.lastMoves.at(-1) === "down"){y++;}
        if(lastSnakeSegment.lastMoves.at(-1) === "left"){x++;}
        
        const sb = new SnakeSegment(x, y);
        this.snake.push(sb);
    }

    random(){
        let result = [];
        const snakeArr = [];

        const includesMultiDimension = (arr, res) =>
        JSON.stringify(arr).includes(JSON.stringify(res));


         // get all coordinates of the snake to exclude them from possible fruit spawn places
        this.snake.forEach(part => {
            const coordinates = [];
            coordinates.push(part.positionX);
            coordinates.push(part.positionY);
            snakeArr.push(coordinates);  
        });

        // test if the random coordinates are hidden by snake body, 
        // if yes, it generates new random numbers.
        while(true){ 
            result = [];
            let x = Math.floor(Math.random() * (columns - 0));
            let y = Math.floor(Math.random() * (columns - 0));
            result.push(x);
            result.push(y);
            
            if (!includesMultiDimension(snakeArr, result)){
                break; 
            }
        }
        return result;
    }

    createGameOverMessage(result){
        clearInterval(this.intervalId);
        
        if(this.points > localStorage.getItem("highscore")){
            localStorage.setItem("highscore", this.points);
        }
           
        this.snake.forEach(segment => {
            segment.domElement.classList.add("blur");
        });
        this.fruit.domElement.classList.add("blur");

        const gameOverDiv = document.createElement('div');
        const gameOverMessage = document.createElement('div');
        const skillMessage = document.createElement('div');
        const btnGroup = document.createElement('div');
        const skillBtn1 = document.createElement("button");
        const skillBtn2 = document.createElement("button");
        const skillBtn3 = document.createElement("button");
        
        gameOverMessage.id = "game-over-msg";
        gameOverDiv.id = "game-over-box"
        skillMessage.id = "skill-msg";
        btnGroup.id = "btn-group";
        skillBtn1.className="skill-btn";
        skillBtn2.className="skill-btn";
        skillBtn3.className="skill-btn";
        skillBtn1.innerHTML="Easy";
        skillBtn2.innerHTML="Medium";
        skillBtn3.innerHTML="Hard";

        
        if (result === "loss"){
            gameOverMessage.innerText="Game Over 😭";
        }
        if (result === "win"){
            gameOverMessage.innerText="You have won 🤩";
        }

        skillMessage.innerHTML="🐉<br>Start again:";

        skillBtn1.innerHTML="Easy";
        skillBtn2.innerHTML="Medium";
        skillBtn3.innerHTML="Hard";

        gameOverDiv.appendChild(gameOverMessage);
        gameOverDiv.appendChild(skillMessage);
        gameOverDiv.appendChild(btnGroup);
        btnGroup.appendChild(skillBtn1);
        btnGroup.appendChild(skillBtn2);
        btnGroup.appendChild(skillBtn3);
        board.appendChild(gameOverDiv);
  
        skillBtn1.addEventListener('click', (event) => {
            board.removeChild(gameOverDiv);
            this.snake.forEach(snakeSegment => {
                snakeSegment.removeInstance();

            });
            this.fruit.removeInstance();
            
            const level = 5; // the higher the faster does the player move: level-times per second
            const interval = 1000/level; //refresh interval for movement
            this.reset();
            this.start(interval)
        });
        skillBtn2.addEventListener('click', (event) => {
            board.removeChild(gameOverDiv);
            this.snake.forEach(snakeSegment => {
                snakeSegment.removeInstance();

            });
            this.fruit.removeInstance();
            const level = 10; 
            const interval = 1000/level; 
            this.reset();
            this.start(interval)
        });
        skillBtn3.addEventListener('click', (event) => {
            board.removeChild(gameOverDiv);
            this.snake.forEach(snakeSegment => {
                snakeSegment.removeInstance();

            });
            this.fruit.removeInstance();
            const level = 15;  
            const interval = 1000/level; 
            this.reset();
            this.start(interval)
        });

    }

    reset(){
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
    constructor(positionX, positionY){
        this.width = fieldSize;
        this.height = fieldSize;
        this.positionX = positionX;
        this.positionY =  positionY;
        this.domElement = null;
        this.createDomElement();
        this.lastMoves = []; // store the last moves

    }

    createDomElement(){
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

    moveUp(){
        if (this.positionY < columns - 1) {
            this.positionY += 1;
        } else {
            this.positionY = 0;
        }
        this.domElement.style.bottom = this.positionY * fieldSize + "px";
        this.lastMoves.push("up");
        if(this.lastMoves.length>2){
            this.lastMoves.shift();
        }
    }

    moveDown(){
        if (this.positionY > 0) {
            this.positionY -= 1;
        } else {
            this.positionY = columns-1;
        }
        this.domElement.style.bottom = this.positionY * fieldSize + "px";
        this.lastMoves.push("down");
        if(this.lastMoves.length>2){
            this.lastMoves.shift();
        }
    }

    moveRight(){
        if (this.positionX < columns - 1) {
            this.positionX += 1;
        } else {
            this.positionX = 0;
        }
        this.domElement.style.left = this.positionX * fieldSize + "px";
        this.lastMoves.push("right");
        if(this.lastMoves.length>2){
            this.lastMoves.shift();
        }
    }

    moveLeft(){
        if (this.positionX > 0) {
            this.positionX -= 1;
        } else {
            this.positionX = columns - 1;
        }
        this.domElement.style.left = this.positionX * fieldSize + "px";
        this.lastMoves.push("left");
        if(this.lastMoves.length>2){
            this.lastMoves.shift();
        }
    }

    removeInstance(){
        board.removeChild(this.domElement);
    }

}

class Fruit{
    constructor(randomArr){
        this.width = fieldSize;
        this.height = fieldSize;

        this.positionX =  randomArr[0];
        this.positionY =  randomArr[1];
        
        this.domElement = null;

        this.createDomElement();
    }

    createDomElement(){
        this.domElement = document.createElement('div');
        const leaf1 = document.createElement('div');
        const leaf2 = document.createElement('div');
        

        this.domElement.id = "fruit";
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

    removeInstance(){
        board.removeChild(this.domElement);
    }
}

//init
const game = new Game();
game.welcome();
