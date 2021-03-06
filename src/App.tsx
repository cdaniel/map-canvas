import * as React from 'react';
import './App.css';

import {IPaletteComponents, MapActions, MapCanvas, MapEditorStore, Palette} from 'map-canvas-components';

import logo from './logo.svg';

import { faEdit, faTrashAlt, faUser } from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import * as jsPlumb from "jsplumb";

const params: IPaletteComponents = [
    {
        id: 0, key: "user-node", label: 'Stakeholder', visualElement: <div style={{
            backgroundColor: 'white'
        }}> <FontAwesomeIcon icon={faUser} color='rgb(0,120,155)'/> </div>
    },
    {
        id: 1, key: "user-need-node", label: 'Need', visualElement: <div style={{
            backgroundColor: 'rgb(0,120,155)',
            border : '1px solid black',
            borderRadius: 6,
            height: 10,
            width: 10
        }}/>
    },
    {
        id: 2, key: "internal-component-node", label: 'Internal Component', visualElement: <div style={{
            backgroundColor: 'white',
            border : '1px solid black',
            borderRadius: 6,
            height: 10,
            width: 10
        }}/>
    },
    {
        id: 3, key: "external-component-node", label: 'External Component', visualElement: <div style={{
            backgroundColor: 'gray',
            border : '1px solid black',
            borderRadius: 6,
            height: 10,
            width: 10
        }}/>
    },
    {
        id: 4, key: "comment-node", label: 'Comment', visualElement: <div style={{
            backgroundColor: 'yellow',
            border : '1px solid orange',
            borderRadius: 4,
            height: 12
        }}/>
    }
];

function componentBodyStyler(type:string) {
    if (type === "user-node") {
        return {
            component: <FontAwesomeIcon icon={faUser} color='rgb(0,120,155)'/>,
            connections : {
                source : [{
                    name: "user-userneed-dependency",
                    relativePos : {
                        left: 7,
                        top: 40
                    },
                    sourceEndpoint : {
                        connector: ["Straight",{gap: 1}],
                        endpoint:[ "Blank", { radius:1 }],
                        isSource:true,
                    },
                    targetEndpoint : {
                        endpoint:[ "Dot", { radius:3 } ],
                        isTarget:true,
                        reattach:true
                    }
                }],
                target : []
            },
            deletable : true,
            movable : true,
        }
    } else if (type === "user-need-node") {
        return {
            connections : {
                source : [{
                    name: "userneed-component-dependency",
                    relativePos : {
                        left: 5,
                        top: 40
                    },
                    sourceEndpoint : {
                        connector: ["Straight",{gap: 1}],
                        endpoint:[ "Blank", { radius:1 }],
                        isSource:true,
                    },
                    targetEndpoint : {
                        endpoint:[ "Dot", { radius:4 } ],
                        isTarget:true,
                        reattach:true
                    }
                }],
                target : ["user-userneed-dependency", "userneed-component-dependency"]
            },
            deletable: true,
            movable : true,
            style: {
                backgroundColor: 'rgb(0,120,155)',
                border: '1px solid black',
                borderRadius: 5,
                height: 8,
                maxHeight: 8,
                maxWidth: 8,
                width: 8,
            }
        }
    } else if (type === "external-component-node") {
        return {
            connections : {
                source : [{
                    name: "node-node-dependency",
                    relativePos : {
                        left: 5,
                        top: 40
                    },
                    sourceEndpoint : {
                        connector: ["Straight",{gap: 1}],
                        endpoint:[ "Blank", { radius:1 }],
                        isSource:true,
                    },
                    targetEndpoint : {
                        endpoint:[ "Dot", { radius:4 } ],
                        isTarget:true,
                        reattach:true
                    }
                }],
                target : ["userneed-component-dependency", "node-node-dependency"]
            },
            deletable: true,
            movable : true,
            style: {
                backgroundColor: 'gray',
                border: '1px solid black',
                borderRadius: 5,
                height: 8,
                maxHeight: 8,
                maxWidth: 8,
                width: 8,
            }
        }
    } else if (type === "comment-node") {
        return {
            deletable: true,
            movable : true,
            style: {
                backgroundColor: 'yellow',
                border : '1px solid orange',
                borderRadius: 6,
                height: 50,
                maxWidth: 250,
                width: 70,
            }
        }
    } else  {
        // pretend type InternalComponent
        return {
            connections : {
                source : [{
                    name: "node-node-dependency",
                    relativePos : {
                        left: 5,
                        top: 40
                    },
                    sourceEndpoint : {
                        connector: ["Straight",{gap: 1}],
                        endpoint:[ "Blank", { radius:1 }],
                        isSource:true,
                    },
                    targetEndpoint : {
                        endpoint:[ "Dot", { radius:4 } ],
                        isTarget:true,
                        reattach:true
                    }
                }],
                target : ["userneed-component-dependency", "node-node-dependency"]
            },
            deletable: true,
            movable : true,
            style: {
                backgroundColor: 'white',
                border: '1px solid black',
                borderRadius: 5,
                height: 8,
                maxHeight: 8,
                maxWidth: 8,
                width: 8,
            }
        }
    }
}

function nodeConnectionStyler(type:string){
    if(type === 'userneed-component-dependency'){
        return {
            connector: ["Straight",{gap: 1}],
            endpoint:[ "Blank", { radius:1, gap: 1 }],
            endpointStyle : {
                stroke : 'gray',
                strokeWidth : 1
            },
            menu : [
                ['edit', faEdit, MapActions.initiateConnectionEdit],
                ['delete', faTrashAlt, MapActions.initiateConnectionDeletion]
            ],
            sourceAnchors : ['Bottom'],
            targetAnchors : ['Top']
        }
    } else if (type === 'user-userneed-dependency'){
        return {
            connector: ["Straight",{gap: 1}],
            endpoint:[ "Blank", { radius:1, gap: 1 }],
            endpointStyle : {
                dashstyle: '6 6',
                stroke : 'gray',
                strokeWidth : 1
            },
            menu : [
                ['edit', faEdit, MapActions.initiateConnectionEdit],
                ['delete', faTrashAlt, MapActions.initiateConnectionDeletion]
            ],
            sourceAnchors : ['Bottom'],
            targetAnchors : ['Top']
        }
    } else if (type === 'node-node-dependency'){
        return {
            connector: ["Straight",{gap: 1}],
            endpoint:[ "Blank", { radius:1, gap : 1 }],
            endpointStyle : {
                stroke : 'gray',
                strokeWidth : 1
            },
            menu : [
                ['edit', faEdit, MapActions.initiateConnectionEdit],
                ['delete', faTrashAlt, MapActions.initiateConnectionDeletion]
            ],
            sourceAnchors : ['Bottom'],
            targetAnchors : ['Top']
        }
    }
    return null;
}

const jsPlumbInstance = jsPlumb.jsPlumb.getInstance();

MapEditorStore.setJsPlumbInstance(jsPlumbInstance);

jsPlumbInstance.registerConnectionType("focused", {
    paintStyle:{strokeWidth:3},
});
jsPlumbInstance.registerConnectionType("user-userneed-dependency-focused", {
    paintStyle:{dashstyle:'2 2'}
});

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
                    <MapCanvas connectionStyler={nodeConnectionStyler} jsPlumbInstance={jsPlumbInstance} styler={componentBodyStyler} />
                </div>
            </div>
        );
    }
}

export default App;
