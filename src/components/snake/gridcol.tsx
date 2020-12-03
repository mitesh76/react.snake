import * as React from 'react';

export interface SnakePart {
    x: number;
    y: number;
}

export interface IGridColProps {
    rowIndex: number;
    colIndex: number;
    snake: SnakePart[];
    foodPosition: number[];
}

export default class Col extends React.Component<IGridColProps> {

    public render() {
        const {rowIndex, colIndex, foodPosition, snake} = this.props;

        let cellClass = snake.some(o => o.x == colIndex && o.y == rowIndex) ? "snake" : (rowIndex == foodPosition[0] && colIndex == foodPosition[1]) ? "food" : "";

        return <td className={cellClass}></td>
    }
}