import * as React from 'react';
import './App.css';

import Palette, {IPaletteComponents} from './components/Palette';
import logo from './logo.svg';

import { faUser } from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


import * as jsPlumb from "jsplumb";
import MapCanvas from "./components/MapCanvas";

const params: IPaletteComponents = [
    {
        id: 0, key: "UserComponent", label: 'Stakeholder', visualElement: <div style={{
            backgroundColor: 'white'
        }}> <FontAwesomeIcon icon={faUser} color='rgb(0,120,155)'/> </div>
    },
    {
        id: 1, key: "UserNeedComponent", label: 'Need', visualElement: <div style={{
            backgroundColor: 'rgb(0,120,155)',
            border : '1px solid black',
            borderRadius: 6,
            height: 10,
            width: 10
        }}/>
    },
    {
        id: 2, key: "InternalComponent", label: 'Internal Component', visualElement: <div style={{
            backgroundColor: 'white',
            border : '1px solid black',
            borderRadius: 6,
            height: 10,
            width: 10
        }}/>
    },
    {
        id: 3, key: "ExternalComponent", label: 'External Component', visualElement: <div style={{
            backgroundColor: 'gray',
            border : '1px solid black',
            borderRadius: 6,
            height: 10,
            width: 10
        }}/>
    },
    {
        id: 4, key: "Comment", label: 'Comment', visualElement: <div style={{
            backgroundColor: 'yellow',
            border : '1px solid orange',
            borderRadius: 4,
            height: 10
        }}/>
    }
];

const jsPlumbInstance = jsPlumb.jsPlumb.getInstance();

class App extends React.Component {
    public render() {
        return (
            <div style={{display: 'flex', height: '100%', flexFlow: 'column'}}>
                <header className="App-header" style={{flex: "0 1 auto"}}>
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <div style={{display: 'flex', flex: "1 1 auto",}}>
                    <Palette components={params} jsPlumbInstance={jsPlumbInstance}/>
                    <MapCanvas jsPlumbInstance={jsPlumbInstance}/>
                </div>
            </div>
        );
    }
}

export default App;
