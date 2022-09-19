//game constants
const columns = 24; //number of columns/ rows
const fieldSize = Math.floor(board.offsetWidth/columns);
board.style.width = fieldSize * columns + "px";
board.style.height = fieldSize * columns + "px";
const level = 10; // the higher the faster does the player move: level-times per second
const interval = 1000/level; //refresh interval for movement


class Game {
    constructor(){
        this.player = null;
        this.fruit = null;
        this.points = 0;
        this.moveDirection = null;

        this.canTurn = false;     
        /* ^ a variable that will prevent that you can change direction 
        more than once per interval, otherwise you could do a U-turn (180°)
        if you hit the keys faster than the interval : */ 
      
        this.lastMove = null;


    }
    
    start(){
        this.player = new Player();
        this.fruit = new Fruit();
        this.moveDirection = "right";


        this.attachEventListeners();

        //move player
        setInterval(() => {
            this.canTurn = true;
            this.detectFruitCollision(this.fruit);
                switch(this.moveDirection){
                    case "up": this.player.moveUp();
                        break;
                    case "right": this.player.moveRight();
                        break;
                    case "down": this.player.moveDown();
                        break;
                    case "left": this.player.moveLeft();
                        break;
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
            else {
                console.log("grr");
            }
        });
    }

    detectFruitCollision(fruit){
        if (this.player.positionX === fruit.positionX && 
            this.player.positionY === fruit.positionY) {    
            this.points += 100;
            this.fruit.removeInstance();
            this.fruit = new Fruit();
            console.log(this.points);
        }

    }


}

class Player {
    constructor(){
        this.width = fieldSize;
        this.height = fieldSize;
        this.positionX = board.offsetWidth/2;
        this.positionY =  board.offsetWidth/2;
        this.domElement = null;

        this.createDomElement();
    }

    createDomElement(){
        this.domElement = document.createElement('div');

        this.domElement.id = "player";
        this.domElement.style.width = this.width + "px";
        this.domElement.style.height = this.height + "px";
        this.domElement.style.bottom = this.positionY + "px";
        this.domElement.style.left = this.positionX + "px";
    

        // append to the dom
        // const board = document.getElementById("board");
        board.appendChild(this.domElement)
    }


    moveUp(){
        if (this.positionY < board.offsetHeight - fieldSize) {
            this.positionY += fieldSize;
            this.domElement.style.bottom = this.positionY + "px";
        } else {
            this.positionY = 0;
            this.domElement.style.bottom = this.positionY + "px";
        }
        this.canTurn = true;

    }

    moveDown(){
        if (this.positionY > 0) {
            this.positionY -= fieldSize;
            this.domElement.style.bottom = this.positionY + "px";

        } else {
            this.positionY = board.offsetHeight - fieldSize;
            this.domElement.style.bottom = this.positionY + "px";
        }
        this.canTurn = true;

    }

    moveRight(){
        if (this.positionX < board.offsetWidth - fieldSize) {
            this.positionX += fieldSize;
            this.domElement.style.left = this.positionX + "px";
        } else {
            this.positionX = 0;
            this.domElement.style.left = this.positionX + "px";
        }
        this.canTurn = true;

        
    }

    moveLeft(){
        if (this.positionX > 0) {
            this.positionX -= this.width;
            this.domElement.style.left = this.positionX + "px";

        } else {
            this.positionX = board.offsetWidth - this.width;
            this.domElement.style.left = this.positionX + "px";
        }
        this.canTurn = true;
        
    }

}

class Fruit{
    constructor(){
        this.width = fieldSize;
        this.height = fieldSize;

        this.positionX = fieldSize * Math.floor(Math.random() * (columns - 0));
        this.positionY =  fieldSize * Math.floor(Math.random() * (columns - 0));
        this.domElement = null;

        this.createDomElement();

    }



    createDomElement(){
        this.domElement = document.createElement('div');

        this.domElement.id = "fruit";
        this.domElement.style.width = this.width + "px";
        this.domElement.style.height = this.height + "px";
        this.domElement.style.bottom = this.positionY + "px";
        this.domElement.style.left = this.positionX + "px";
    

        // append to the dom
        board.appendChild(this.domElement)

    }

    removeInstance(){
        board.removeChild(this.domElement);
    }

}

const game = new Game();
game.start();