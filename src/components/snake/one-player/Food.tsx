
import {Position} from './position';
export class Food {
    name: string;
    value: number;
    position: Position;
    direction: string;

    constructor (name: string, value: number, position: Position) {
        this.name = name;
        this.value = value;
        this.position = position;
        this.direction = this.randomDirection();
    }

    randomDirection() {
        const directions : string[] = ["up","down","left","right"];
        return directions[Math.floor(Math.random() * 4)];
    }

    move(steps?: number, gridSize?: number, direction?: string) {
        if(steps==undefined || gridSize == undefined || direction == undefined) return
        switch(direction) {
            case "up":
                if (this.position.y - steps > 0) this.position.y-=steps; break;
            case "down":
                if (this.position.y + steps < gridSize - 1) this.position.y+=steps; break;
            case "left":
                if (this.position.x - steps > 0) this.position.x-=steps; break;
            case "right":
                if (this.position.x + steps < gridSize - 1) this.position.x+=steps; break;
        }
        this.direction = direction;
    }
}

export class DeadMouse extends Food {
    constructor(position: Position) {
        super("Dead Mouse", 1, position);
    }
    move() {
        return; //Dead mouse don't move
    }
}


export class BlindMouse extends Food {
    constructor(position: Position) {
        super("Blind Mouse", 2, position);
    }

    getDirection() {
        //movement behaviour logic - blind mouse only moves in a straight line
        return this.direction;
    }

    move(gridSize: number) {
        super.move(1, gridSize, this.getDirection());
    }
}

export class Mouse extends Food {
    constructor(position: Position) {
        super("Mouse", 5, position);
    }

    getDirection() {
        //movement behaviour logic
        const directions : string[] = ["up","down","left","right"];
        return directions[Math.floor(Math.random() * 4)];
    }

    move(gridSize: number) {
        super.move(1, gridSize, this.getDirection());
    }
}

export class Bug extends Food {
    
    constructor(position: Position) {
        super("Bug", 10, position);
    }

    getDirection() {
        //movement behaviour logic
        const directions : string[] = ["up","down","left","right"];
        return directions[Math.floor(Math.random() * 4)];
    }

    move(gridSize: number) {
        super.move(2, gridSize, this.getDirection());
    }
    

}