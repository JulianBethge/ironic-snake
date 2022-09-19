//game constants
const columns = 24; //number of columns/ rows
const level = 4; 
const interval = 1000/level; //refresh interval for movement
console.log("interval: " + interval)

class Game {
    constructor(){
        this.player = null;
        this.fruit = null;
        this.moveDirection = null;

        
        this.canTurn = false;     
        /* ^ a variable that will prevent that you can change direction 
        more than once per interval, otherwise you could do a U-turn (180°)
        if you hit the keys faster than the interval : */ 

    }
    
    start(){
        console.log("starting game...");
        this.player = new Player();
        this.moveDirection = "right";
        
        
        this.attachEventListeners();


        //move player
        setInterval(() => {
            this.canTurn = true; 


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
                if (this.moveDirection !== "down" && event.key === "ArrowUp"){
                    this.moveDirection = "up";
                    this.canTurn = false;
                }
                if (this.moveDirection !== "left" && event.key === "ArrowRight"){
                    this.moveDirection = "right";
                    this.canTurn = false;
                }
                if (this.moveDirection !== "up" && event.key === "ArrowDown"){
                    this.moveDirection = "down";
                    this.canTurn = false;
                }
                if (this.moveDirection !== "right" && event.key === "ArrowLeft"){
                    this.moveDirection = "left";
                    this.canTurn = false;
                }
            }

            
            


        });
    }


}

class Player {
    constructor(){
        this.width = board.offsetWidth/columns;
        this.height = this.width;
        this.positionX = board.offsetHeight/2;
        this.positionY =  board.offsetHeight/2;
        this.domElement = null;
        // console.log(board);

        this.createDomElement();
    }

    createDomElement(){
        console.log("creating Player...");
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
        if (this.positionY < board.offsetHeight - this.height) {
            this.positionY += this.height;
            this.domElement.style.bottom = this.positionY + "px";
        } else {
            this.positionY = 0;
            this.domElement.style.bottom = this.positionY + "px";
        }
        this.moveDirection = "up";
    }

    moveDown(){
        if (this.positionY > 0 + this.width) {
            this.positionY -= this.height;
            this.domElement.style.bottom = this.positionY + "px";
            console.log(this.positionY);
        } else {
            this.positionY = board.offsetHeight - this.height;
            this.domElement.style.bottom = this.positionY + "px";
        }
        this.moveDirection = "down";
    }

    moveRight(){
        if (this.positionX < board.offsetWidth - this.width) {
            this.positionX += this.width;
            this.domElement.style.left = this.positionX + "px";
            console.log(board.offsetWidth);
            console.log(this.positionX);
        } else {
            this.positionX = 0;
            this.domElement.style.left = this.positionX + "px";
        }
        this.moveDirection = "right";
        
    }

    moveLeft(){
        if (this.positionX > 0 + this.width) {
            this.positionX -= this.width;
            this.domElement.style.left = this.positionX + "px";
            console.log(this.positionX);
        } else {
            this.positionX = board.offsetWidth - this.width;
            this.domElement.style.left = this.positionX + "px";
        }
        this.moveDirection = "left";
        
    }

}

class Fruit{
    constructor(){

    }

}

const game = new Game();
game.start();