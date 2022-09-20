//game constants
const columns = 24; //number of columns/ rows
const fieldSize = Math.floor(board.offsetWidth/columns);
board.style.width = fieldSize * columns + "px";
board.style.height = fieldSize * columns + "px";
const level = 10; // the higher the faster does the player move: level-times per second
const interval = 1000/level; //refresh interval for movement




class Game {
    constructor(){
        this.snake = null;
        this.snakeBody = [];
        
        this.fruit = null;
        this.points = 0;
        this.moveDirection = null;

        this.canTurn = false;     
        /* ^ a variable that will prevent that you can change direction 
        more than once per interval, otherwise you could do a U-turn (180°)
        if you hit the keys faster than the interval : */ 
      
        


    }
    
    start(){
        this.snake = new Snake(11, 11);

        this.fruit = new Fruit();
        this.moveDirection = "right";
        this.snakeBody.push(this.snake);

        
        this.attachEventListeners();

        //move snake
        setInterval(() => {
            this.canTurn = true;
            this.detectFruitCollision(this.fruit);
            for(let i=0; i<this.snakeBody.length; i++){

                if (i==0){
                    switch(this.moveDirection){
                        case "up": this.snake.moveUp();
                            break;
                        case "right": this.snake.moveRight();
                            break;
                        case "down": this.snake.moveDown();
                            break;
                        case "left": this.snake.moveLeft();
                            break;
                    }
                    continue;
                }
                if (i===1){

                }
                if(this.snakeBody.length > 1){
                    const lm1 = this.snakeBody[i-1].lastMoves.at(-1);
                    const lm2 = this.snakeBody[i-1].lastMoves.at(-2);
                    const snakePart = this.snakeBody[i];
                    if(lm1=="up" && lm2=="up") {snakePart.moveUp();}
                    if(lm1=="up" && lm2=="right") {snakePart.moveRight();}
                    if(lm1=="up" && lm2=="left") {snakePart.moveLeft();}
                    if(lm1=="right" && lm2==undefined) {snakePart.moveRight();}
                    if(lm1=="right" && lm2=="right") {snakePart.moveRight();}
                    if(lm1=="right" && lm2=="down") {snakePart.moveDown();}
                    if(lm1=="right" && lm2=="up") {snakePart.moveUp();}
                    if(lm1=="left" && lm2=="left") {snakePart.moveLeft();}
                    if(lm1=="left" && lm2=="down") {snakePart.moveDown();}
                    if(lm1=="left" && lm2=="up") {snakePart.moveUp();}
                    if(lm1=="down" && lm2=="down") {snakePart.moveDown();}
                    if(lm1=="down" && lm2=="right") {snakePart.moveRight();}
                    if(lm1=="down" && lm2=="left") {snakePart.moveLeft();}
                }

               
                


            }

        }, interval);

        
    }

    attachEventListeners(){
        document.addEventListener("keydown", (event) => {
            if (this.canTurn){
                if ((this.moveDirection === "right" || this.moveDirection === "left") && event.key === "ArrowUp"){
                    this.moveDirection = "up";
                }
                if ((this.moveDirection === "up" || this.moveDirection === "down") && event.key === "ArrowRight"){
                    this.moveDirection = "right";
                }
                if ((this.moveDirection === "left" || this.moveDirection === "right") && event.key === "ArrowDown"){
                    this.moveDirection = "down";
                }
                if ((this.moveDirection === "up" || this.moveDirection === "down") && event.key === "ArrowLeft"){
                    this.moveDirection = "left";
                }
                this.canTurn = false;

            }

        });
    }

    detectFruitCollision(fruit){
        if (this.snake.positionX === fruit.positionX && 
            this.snake.positionY === fruit.positionY) {    
            this.points += 100;
            console.log("Points: " + this.points);
            this.fruit.removeInstance();
            this.fruit = new Fruit();

            this.createBody(this.snakeBody.at(-1));


        }
    }

    createBody(lastSnakePart){
        let x = lastSnakePart.positionX;
        let y  = lastSnakePart.positionY;

        if(lastSnakePart.lastMoves.at(-1) === "up"){y--;}
        if(lastSnakePart.lastMoves.at(-1) === "right"){x--;}
        if(lastSnakePart.lastMoves.at(-1) === "down"){y++;}
        if(lastSnakePart.lastMoves.at(-1) === "left"){x++;}
        
        const sb = new Snake(x, y);
        this.snakeBody.push(sb);
    }
}

class Snake {
    constructor(positionX, positionY){
        this.width = fieldSize;
        this.height = fieldSize;
        this.positionX = positionX;
        this.positionY =  positionY;
        this.domElement = null;
        this.createDomElement();
        this.lastMoves = [];
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
            this.domElement.style.bottom = this.positionY * fieldSize + "px";
        } else {
            this.positionY = 0;
            this.domElement.style.bottom = this.positionY * fieldSize + "px";
        }
        this.canTurn = true;
        this.lastMoves.push("up");
        if(this.lastMoves.length>2){
            this.lastMoves.shift();
        }
    }

    moveDown(){
        if (this.positionY > 0) {
            this.positionY -= 1;
            this.domElement.style.bottom = this.positionY * fieldSize + "px";
        } else {
            this.positionY = columns-1;
            this.domElement.style.bottom = this.positionY * fieldSize + "px";
        }
        this.canTurn = true;
        this.lastMoves.push("down");
        if(this.lastMoves.length>2){
            this.lastMoves.shift();
        }
    }

    moveRight(){
        if (this.positionX < columns - 1) {
            this.positionX += 1;
            this.domElement.style.left = this.positionX * fieldSize + "px";
        } else {
            this.positionX = 0;
            this.domElement.style.left = this.positionX * fieldSize + "px";
        }
        this.canTurn = true;  
        this.lastMoves.push("right");
        if(this.lastMoves.length>2){
            this.lastMoves.shift();
        }

    }

    moveLeft(){
        if (this.positionX > 0) {
            this.positionX -= 1;
            this.domElement.style.left = this.positionX * fieldSize + "px";

        } else {
            this.positionX = columns - 1;
            this.domElement.style.left = this.positionX * fieldSize + "px";
        }
        this.canTurn = true;
        this.lastMoves.push("left");
        if(this.lastMoves.length>2){
            this.lastMoves.shift();
        }
    }



}


class Fruit{
    constructor(){
        this.width = fieldSize;
        this.height = fieldSize;

        this.positionX =  Math.floor(Math.random() * (columns - 0));
        this.positionY =  Math.floor(Math.random() * (columns - 0));
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