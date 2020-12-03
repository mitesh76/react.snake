import * as React from 'react';

export interface ISnakeBodyProps {
   snakebody: number [][];
}

export default class Game extends React.Component<ISnakeBodyProps> {

    public render() {
        const {snakebody} = this.props;

        return (
            snakebody.map(s => {
                return <div className="snake-body" style={{ top: `${s[0].toString()}%`, left: `${s[1]}%`}}></div>
            })
        )
    }
}