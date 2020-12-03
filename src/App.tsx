import * as React from "react";
import Game from './components/snake/one-player/Game';
//import Game from './two-players/Game';

export default class App extends React.Component<{}> {
    
    render() {
        return <Game gridSize={30} portals={true}></Game>
    }

}
