import * as React from 'react';
import { Position } from './position';
import { GridRow } from './GridRow';
import { Food, Mouse, DeadMouse, Bug, BlindMouse } from './Food';
import { Venom } from './Venom';

export interface IGameProps { gridSize: number; portals: boolean; }

export interface IGameState {
    foodList: (Mouse | Bug | DeadMouse | BlindMouse)[];
    venom: Venom;
    score: number;
    snake: Position[];
    currentFood: Mouse | Bug | DeadMouse | BlindMouse;
    direction: string; // Tried to use an enum for directions but this had a performance impact (slight lag after key press). String seems to be better performant.
    gameSpeed: number;
    gameActive: boolean;
}

export default class Game extends React.Component<IGameProps, IGameState> { 

    componentWillMount = () => {
        this.initNewGame(this.props.gridSize);
        document.addEventListener("keydown", this.handleKeyDown, false); //Event listener for key press
    }
    
    pickRandomFoodFromList = (list: (Mouse | Bug | DeadMouse | BlindMouse)[], gridSize: number) => {
        const rand = Math.floor(Math.random() * (list.length));
        const food = list[rand];
        food.position = this.getRandomPositionInGrid(gridSize);
        return food;
    }

    initNewGame = (gridSize: number) => {
        // generate list of food items
        const mouse = new Mouse(this.getRandomPositionInGrid(gridSize));
        const bug = new Bug(this.getRandomPositionInGrid(gridSize));
        const deadMouse = new DeadMouse(this.getRandomPositionInGrid(gridSize));
        const blindMouse = new BlindMouse(this.getRandomPositionInGrid(gridSize));
        const foodList = [ deadMouse, blindMouse, mouse, bug ];        

        const currentFood = this.pickRandomFoodFromList(foodList, gridSize);

        const snake : Position[] = [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}];
        
        const speed : number = 200;
        this.setState({score: 0, snake: snake, currentFood: currentFood, direction: "down", gameSpeed: speed, gameActive: true, foodList: foodList});
        
        setInterval(this.handleMoves, speed); //Start ticks
    }
    
    getRandomPositionInGrid = (gridSize: number) => {
        const x = Math.floor(Math.random() * gridSize) //random number between 0 and gridSize
        const y = Math.floor(Math.random() * gridSize) //random number between 0 and gridSize
        return { x: x, y: y };
    }

    collision = (snakeHead : Position, snake: Position[], gridSize: number, portals: boolean) => {

        if(!portals && (snakeHead.x == gridSize || snakeHead.y == gridSize)) return true;

        if ((snake.some(snakePart => snakePart.x == snakeHead.x && snakePart.y == snakeHead.y)) || 
            //(snakeHead.x == gridSize || snakeHead.y == gridSize) ||
            (snakeHead.x < 0 || snakeHead.y < 0)
        ) return true;

        return false;
    }

    eat = (newSnakeHead : Position, currentFood: Food) => {
        if (newSnakeHead.x == currentFood.position.x && newSnakeHead.y == currentFood.position.y) return true;
        return false;
    }

    shoot = () => {
        const {venom, direction, snake} = this.state;
        //if(venom != undefined) return;

        //snake head
        const currentSnakeHead = snake[snake.length - 1];
        const newVenom = new Venom(currentSnakeHead, direction);
        this.setState({ venom: newVenom });
    }
    
    handleVenomHitTarget = (currentFood: Food, venom: Venom) => {
        if (venom == undefined) return false;
        return (currentFood.position.x == venom.position.x && currentFood.position.y == venom.position.y);
    }
    
    handleVenomMove = (venom: Venom, gridSize: number) => {
        if (venom == undefined || venom.position.x == gridSize || venom.position.y == gridSize) { return false; };
        venom.move(); return true;
    }

    getNewSnakeHead = (direction: string, snake: Position[], gridSize: number, portals: boolean) => {
        const currentSnakeHead = snake[snake.length - 1];

        let x = currentSnakeHead.x;
        let y = currentSnakeHead.y;

        switch(direction) {
            case "up": (portals && y == 0) ? y = gridSize - 1 : y--; break;
            case "down": (portals && y == gridSize - 1) ? y = 0 : y++; break;
            case "left": (portals && x == 0) ? x = gridSize - 1 : x--; break;
            case "right": (portals && x == gridSize - 1) ? x = 0 : x++; break;
        }

        const newSnakeHead : Position = {x: x, y: y};
        return newSnakeHead;
    }

    handleMoves = () => {
        const { gridSize, portals } = this.props;
        const { direction, snake, gameActive, foodList } = this.state;
        let { score, currentFood, gameSpeed, venom } = this.state;

        if (!gameActive) return;

        //get new snake head 
        const newSnakeHead = this.getNewSnakeHead(direction, snake, gridSize, portals);

        //check collision
        if (this.collision(newSnakeHead, snake, gridSize, portals)) { this.setState({gameActive: false}); return; };

        //push new head onto snake array
        snake.push(newSnakeHead);

        //check if snake can eat food. if yes increase score, reposition new food and allow snake to grow by not shifting array. else shift array.
        if (this.eat(newSnakeHead, currentFood)) {
            score += currentFood.value;
            currentFood = this.pickRandomFoodFromList(foodList, gridSize);
        }
        //check if venom hits food target. if yes add to score and shift array (snake cannot grow)
        else if (this.handleVenomHitTarget(currentFood, venom)){
            score += currentFood.value;
            currentFood = this.pickRandomFoodFromList(foodList, gridSize);
            snake.shift();
            //venom = undefined;
        }
        else {
            snake.shift();
        }

        //move food
        currentFood.move(gridSize);

        //move venom
        if(this.handleVenomMove(venom, gridSize) == false) {  }; //trying to dispose of class object Venom 
                
        this.setState({snake : snake, score : score, currentFood : currentFood, gameSpeed: gameSpeed, venom : venom});
    }

    handleKeyDown = (e: KeyboardEvent) => {
        const { gameActive } = this.state;
        
        if (!gameActive) return;

        switch (e.key) {
            case "ArrowUp": this.setState({ direction: "up" }); break;
            case "ArrowDown": this.setState({ direction: "down" }); break;
            case "ArrowLeft": this.setState({ direction: "left" }); break;
            case "ArrowRight": this.setState({ direction: "right" }); break;
            case " ": this.shoot(); break;
        }
    }
    
    public render() {
        const { score, snake, currentFood, gameActive, direction, venom } = this.state;
        const { gridSize } = this.props;

        let gridRows = [];
        for (let rowIndex = 0; rowIndex < gridSize; rowIndex++) { 
            gridRows.push(GridRow(gridSize, snake, rowIndex, currentFood, direction, venom)) 
        }

        return <React.Fragment>
            <div className="game-container">
                <div className="game-header">
                    <h1>{gameActive ? "SNAKE!" : "GAME OVER!"}</h1>
                    <span className="score">Score: {score}</span>
                    <span className="score">&nbsp;{currentFood.name}</span>
                </div>
                <table className="snake-table"><tbody>{gridRows}</tbody></table></div>
        </React.Fragment>
    }
}