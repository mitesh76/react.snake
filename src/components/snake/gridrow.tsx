import * as React from 'react';
import GridCol, { SnakePart } from './gridcol';

export interface IGridRowProps {
    gridSize: number;
    snake: SnakePart[];
    rowIndex: number;
    foodPosition: number[];
}

export default class Row extends React.Component<IGridRowProps> {

    public render() {

        const {snake, rowIndex, gridSize, foodPosition} = this.props;
        
        let cols = [];
        for(var colIndex = 0; colIndex < gridSize; colIndex++) {
            cols.push(<GridCol key={`${rowIndex}-${colIndex}`} snake={snake} foodPosition={foodPosition} rowIndex={rowIndex} colIndex={colIndex}></GridCol>)
        }

        return <tr>{cols}</tr>
    }
}