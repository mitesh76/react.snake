import * as React from 'react';
import GridRow from './gridrow';
import { SnakePart } from './gridcol';

export interface IGameProps {
    gridSize: number;
}
export interface IGameState {
    score: number;
    snake: SnakePart [];
    foodPosition: number[];
    direction: string;
    speed: number;
    gameActive: boolean;
}

export default class Game extends React.Component<IGameProps, IGameState> {

    componentWillMount = () => {
        console.log("Loading game");
        //init game
        var snake : SnakePart[] = [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}];
        var foodPosition = this.randomPosition();

        this.setState({score: 0, snake: snake, foodPosition: foodPosition, direction: "down", gameActive: true});
       
    }

    componentDidMount = () => {
        setInterval(this.moveSnake, 200);
        document.addEventListener("keydown", this.onKeyDown, false);
    }

    collision = (newSnakeHead : SnakePart) => {
        const { snake} = this.state;
        const {gridSize} = this.props;
        if ((snake.some(o => o.x == newSnakeHead.x && o.y == newSnakeHead.y)) || 
            (newSnakeHead.x == gridSize || newSnakeHead.y == gridSize) ||
            (newSnakeHead.x < 0 || newSnakeHead.y < 0)
        ) return true;
        return false;
    }

    eat = (newSnakeHead : SnakePart) => {
        const {foodPosition} = this.state;
        if(newSnakeHead.x == foodPosition[1] && newSnakeHead.y == foodPosition[0]) return true;
        return false;
    }

    moveSnake = () => {

        const {direction, snake, gameActive} = this.state;

        if(!gameActive) return;

        let {score, foodPosition} = this.state;
        const currentSnakeHead = snake[snake.length - 1];

        let x = currentSnakeHead.x;
        let y = currentSnakeHead.y;

        switch(direction) {
            case "up": y--; break;
            case "down": y++; break;
            case "left": x--; break;
            case "right": x++; break;
        }

        const newSnakeHead : SnakePart = {x: x, y: y}

        //check collision
        if(this.collision(newSnakeHead)) {
            
            this.setState({gameActive: false});
        }

        snake.push(newSnakeHead);

        if(this.eat(newSnakeHead)) {
            score++;
            foodPosition = this.randomPosition();
        }
        else {
            snake.shift();
        }

        this.setState({snake : snake, score : score, foodPosition : foodPosition});
    }

    componentWillUpdate = () => {

    }

    randomPosition = () => {
        const {gridSize} = this.props;
        let x = Math.floor(Math.random() * gridSize) //random number between 0 and gridSize
        let y = Math.floor(Math.random() * gridSize) //random number between 0 and gridSize
        return [x, y];
    }

    onKeyDown = (e : KeyboardEvent) => {

        const {gameActive} = this.state;
        if(!gameActive) return;

        switch(e.keyCode) {
            case 38: console.log("up"); this.setState({direction: "up"}); break;
            case 40: console.log("down"); this.setState({direction: "down"}); break;
            case 37: console.log("left"); this.setState({direction: "left"}); break;
            case 39: console.log("right"); this.setState({direction: "right"}); break;
        }

        this.moveSnake();
    }

    public render() {
        
        const {score, snake, foodPosition, gameActive} = this.state;
        const {gridSize} = this.props;

        let rows = [];
        for(let r = 0; r < gridSize; r++) {
            rows.push(<GridRow key={r} gridSize={gridSize} snake={snake} foodPosition={foodPosition} rowIndex={r}></GridRow>)
        }


        return (
        <React.Fragment>
            <h1>SNAKE!</h1>
            <h2>Score {score}</h2>
            {!gameActive ? <h2>GAME OVER!</h2> : null}
            <table className="snake-table">
                <tbody>{rows}</tbody>
            </table>
        </React.Fragment>
    );
    }
}