import * as React from 'react';

export interface IFoodProps {
   position: number [];
}

export default class Food extends React.Component<IFoodProps> {

    public render() {
        const {position} = this.props;
        return <div className="food" style={{ top: `${position[0].toString()}%`, left: `${position[1]}%`}}></div>
    }
}