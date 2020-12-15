import React, {useState, useEffect} from 'react';

export interface Position { x: number; y: number; }
export type snakeDir = "up" | "down" | "left" | "right";
export type snake = Position[];
export type food = Position;

function App() {

    const [gridSize] = useState(30);
    let [gameSpeed, setGameSpeed] = useState<number>(600);
    let [score, setScore] = useState(0);
    let [gameActive, setGameActive] = useState<boolean>(true);
    let [direction, setDirection] = useState<snakeDir>("down");
    let [snake, setSnake] = useState<snake>([{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}]);
    let [food, setFood] = useState<food>({x: 5, y: 5});

    //set direction keypress event listener
    useEffect(() => {
        const handleKeyPress = (e:KeyboardEvent) => {
            switch(e.key) {
                case "ArrowUp": setDirection("up"); break;
                case "ArrowDown": setDirection("down"); break;
                case "ArrowLeft": setDirection("left"); break;
                case "ArrowRight": setDirection("right"); break;
            }
        };
        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        }
    });

    //set interval ticker
    useEffect(() => {
        if(!gameActive) return;
        const interval = setInterval(handleMove, gameSpeed);
        return () => {
            clearInterval(interval);
        }
    }, [snake, gameActive, gameSpeed]);

    //set score
    const incrementScore = () => {
        const newScore = score + 1;
        setScore(newScore);
    }

    //random position in grid
    const getRandomPosition = () => {
        const x = Math.floor(Math.random() * gridSize) //random number between 0 and gridSize
        const y = Math.floor(Math.random() * gridSize) //random number between 0 and gridSize
        return { x: x, y: y };
    }

    const eat = (snakeHead: Position) => {
        return (snakeHead.x == food.x && snakeHead.y == food.y);
    }

    const collision = (snakeHead: Position) => {
        //walls
        if(snakeHead.x == gridSize || snakeHead.x < 0 || snakeHead.y == gridSize || snakeHead.y < 0) return true;
        //body
        return snake.some(o => o.x == snakeHead.x && o.y == snakeHead.y);
    }

    //get new snake head
    const getNewSnakeHead = () => {
        const currentSnakeHead = snake[snake.length - 1];
        let x = currentSnakeHead.x;
        let y = currentSnakeHead.y;

        switch(direction) {
            case "up": y--; break;
            case "down": y++; break;
            case "left": x--; break;
            case "right": x++; break;
        }

        const newSnakeHead : Position = {x: x, y: y};
        return newSnakeHead;
    }

    const handleSpawnFood = () => {
        setFood(getRandomPosition());
    }

    const incrementGameSpeed = () => {
        const newSpeed = Math.floor(gameSpeed * 0.9);
        setGameSpeed(newSpeed);
    }

    //handle move
    const handleMove = () => {
        const newSnakeHead : Position = getNewSnakeHead();

        if(collision(newSnakeHead)) { setGameActive(false); }
        
        snake.push(newSnakeHead);

        if(eat(newSnakeHead)) { 
            incrementScore(); handleSpawnFood(); incrementGameSpeed();
        } 
        else {
            snake.shift();
        }
        
        //need to create new snake array due to javascript comparison by reference so that useEffect diff can detect a change in the snake array we give it
        const newSnake : snake = [];
        snake.forEach(s => { newSnake.push(s) });
        setSnake(newSnake);
    }

    return <div>{!gameActive ? "GAME OVER " : ""}Score:{score}{Grid(gridSize, snake, food)}</div>
}

export default App;

function Grid(gridSize : number, snake: snake, food: food) {
    return <table className="table snake-table"><tbody>{GridRows(gridSize, snake, food)}</tbody></table>
}

function GridRows(gridSize: number, snake: snake, food: food) {
    const rows : any[] = [];
    for(let r = 0; r < gridSize; r++) {
    let row = <tr key={`row-${r}`}>{GridCells(r, gridSize, snake, food)}</tr>
        rows.push(row);
    }
    return(rows);
}

function GridCells(rowIndex: number, gridSize: number, snake: snake, food: food) {
    
    const cells : any [] = [];
    for(let c = 0; c < gridSize; c++) {

        let cellClass : string = "";

        if(food.x == c && food.y == rowIndex) cellClass = "food";

        if(snake.some(o => o.x == c && o.y == rowIndex)) {
            cellClass = "snake";
        }

        let cell = <td className={cellClass} key={`${rowIndex}-${c}`}></td>;
        cells.push(cell);
    }
    
    return(cells);
    
}