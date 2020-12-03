import {Position} from './position';

export class Venom {
    position: Position;
    direction: string;

    constructor(position: Position, direction: string) {
        this.position = position;
        this.direction = direction;
    }

    move() {
        switch (this.direction) {
            case "up": this.position.y--; break;
            case "down": this.position.y++; break;
            case "left": this.position.x--; break;
            case "right": this.position.x++; break;
        }
        
    }
}