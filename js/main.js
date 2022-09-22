//game constants
const columns = 24; //number of columns/ rows
const fieldSize = Math.floor(board.offsetWidth/columns);
board.style.width = fieldSize * columns + "px";
board.style.height = fieldSize * columns + "px";
const level = 10; // the higher the faster does the player move: level-times per second
const interval = 1000/level; //refresh interval for movement


class Game {
    constructor(){
        this.snakeHead = null; // will be the first SnakeSegment
        this.snake = []; // will be an array of SnakeSegments
        this.fruit = null;
        this.points = 0;
        this.moveDirection = null;
        this.intervalId = null;
        this.keysPressed = []; // Buffer for pressed key
    }
    
    start(){
        this.snakeHead = new SnakeSegment(columns/2, columns/2);
       
        this.moveDirection = "right";
        this.snake.push(this.snakeHead);
        this.fruit = new Fruit(this.random());

        this.attachEventListeners();
        score.innerText = this.points;
        
        

        //move snake
        this.intervalId = setInterval(() => {

            if(this.detectFruitCollision(this.fruit)){
                this.points += 100;

                score.innerText = this.points;
                this.fruit.removeInstance();
                this.fruit = new Fruit(this.random());

                if(this.points > 100*((columns**2)-columns)){
                    clearInterval(this.intervalId);
                    alert(`You've won! You've earned ${this.points} Points!`);
                }
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
                this.createGameOverMessage();
 
            }

        }, interval);
    }

    attachEventListeners(){
        
        document.addEventListener("keydown", (event) => {
            const lastMove = this.snakeHead.lastMoves.at(-1);

            if (this.keysPressed.length === 0){
                if ((lastMove === "left" || lastMove == "right") && event.key === "ArrowUp"){
                    this.keysPressed.push("up");
                    // this.moveDirection = "up";
                    
                }
                if ((lastMove === "up" || lastMove == "down") && event.key === "ArrowRight"){
                    // this.moveDirection = "right";
                    this.keysPressed.push("right");
                    
                }
                if ((lastMove === "left" || lastMove == "right") && event.key === "ArrowDown"){
                    // this.moveDirection = "down";
                    this.keysPressed.push("down");
                    
                }
                if ((lastMove === "up" || lastMove == "down") && event.key === "ArrowLeft"){
                    // this.moveDirection = "left";
                    this.keysPressed.push("left");   
                }
            }

            if (this.keysPressed.length === 1){
                if ((this.keysPressed[0] === "left" || this.keysPressed[0] == "right") && event.key === "ArrowUp"){
                    this.keysPressed.push("up");
                    
                }
                if ((this.keysPressed[0] === "up" || this.keysPressed[0] == "down") && event.key === "ArrowRight"){
                    this.keysPressed.push("right");
                    
                }
                if ((this.keysPressed[0] === "left" || this.keysPressed[0] == "right") && event.key === "ArrowDown"){

                    this.keysPressed.push("down");
                    
                }
                if ((this.keysPressed[0] === "up" || this.keysPressed[0] == "down") && event.key === "ArrowLeft"){
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

    createGameOverMessage(){

        clearInterval(this.intervalId);
        this.snake.forEach(segment => {
            segment.domElement.classList.add("blur");

        });
        this.fruit.domElement.classList.add("blur");
        
        const gameOverMessage = document.createElement('div');
        
        gameOverMessage.innerHTML="<p>Game Over</p>";
        const startBtn = document.createElement("button");
        startBtn.innerHTML="Start Again?";
        board.appendChild(gameOverMessage);
        gameOverMessage.appendChild(startBtn);

        startBtn.addEventListener('click', (event) => {
            location.reload();

        });

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

        this.domElement.id = "fruit";
        this.domElement.style.width = this.width + "px";
        this.domElement.style.height = this.height + "px";
        this.domElement.style.bottom = fieldSize * this.positionY + "px";
        this.domElement.style.left = fieldSize * this.positionX + "px";
    
        // append to the dom
        board.appendChild(this.domElement)
    }

    removeInstance(){
        board.removeChild(this.domElement);
    }

}

//init
const game = new Game();
game.start();