import * as React from 'react';
import {CSSProperties} from "react";
import * as _ from 'underscore';

import ReactResizeDetector from 'react-resize-detector';

// @ts-ignore
import {jsPlumbInstance} from "jsplumb";
import MapEditorState from "../types/MapEditorState";

import MapStore from '../stores/MapStore';

import * as MapActions from "../actions/MapActions";
import * as MapEditorActions from '../actions/MapEditorActions';
import MapEditorStore from '../stores/MapEditorStore';

import {SyntheticEvent} from "react";
import Node from './Node';
import NodeConnection from "./NodeConnection";

const axisSupport = {
    border: '1px dashed silver',
    borderWidth: 1,
    bottom: '10px',
    position: 'absolute' as 'absolute',
    top: '3%',
    zIndex: '1'
};

const axisSupport1 = _.extend(_.clone(axisSupport), {left: '25.5%'});
const axisSupport2 = _.extend(_.clone(axisSupport), {left: '51%'});
const axisSupport3 = _.extend(_.clone(axisSupport), {left: '76.5%'});

const axisX = {
    backgroundColor: 'gray',
    border: '1px solid gray',
    bottom: '20px',
    height: 1,
    left: '3px',
    marginLeft: 0,
    marginRight: 0,
    position: 'absolute' as 'absolute',
    right: '10px',
    zIndex: 2,
};

const arrowX = {
    borderBottom: '4px solid transparent',
    borderLeft: '12px solid gray',
    borderTop: '4px solid transparent',
    bottom: '18px',
    height: 0,
    position: 'absolute' as 'absolute',
    right: '5px',
    width: 0,
    zIndex: 2
};

const axisY = {
    backgroundColor: 'gray',
    border: '1px solid gray',
    borderWidth: 1,
    bottom: '20px',
    left: '3px',
    position: 'absolute' as 'absolute',
    top: '10px',
    width: 1,
    zIndex: 2,
};

const arrowY = {
    borderBottom: '12px solid gray',
    borderLeft: '4px solid transparent',
    borderRight: '4px solid transparent',
    height: 0,
    left: '0px',
    position: 'absolute' as 'absolute',
    top: '5px',
    width: 0,
    zIndex: 2
};

const valueCaption = {
    fontSize: 'smaller',
    left: '15px',
    position: 'absolute' as 'absolute',
    top: '10px',
    zIndex: 3
};

const evolutionCaption = {
    bottom: '23px',
    fontSize: 'smaller',
    position: 'absolute' as 'absolute',
    right: '17px',
    zIndex: 3
};

const genesisStyle = {
    fontSize: 'smaller',
    left: '10%',
    marginTop: 2,
    position: 'absolute' as 'absolute',
};

const customBuiltStyle = {
    fontSize: 'smaller',
    left: '36%',
    marginTop: 2,
    position: 'absolute' as 'absolute',
};
const productStyle = {
    fontSize: 'smaller',
    left: '60%',
    marginTop: 2,
    position: 'absolute' as 'absolute',
};

const commodityStyle = {
    fontSize: 'smaller',
    left: '85%',
    marginTop: 2,
    position: 'absolute' as 'absolute',
};

export interface IProps {
    connectionStyler : (type:string) => any | null,
    jsPlumbInstance: jsPlumbInstance,
    styler: (type: string) => HTMLDivElement | any | null,
};

export default class MapCanvas extends React.Component<IProps, MapEditorState> {
    private jsPlumbInstance: jsPlumbInstance;
    private input: HTMLDivElement | null;

    constructor(props: IProps) {
        super(props);
        this.jsPlumbInstance = props.jsPlumbInstance;
        this.state = MapEditorStore.getState();
    }

    public onClickHandler = (event: SyntheticEvent) => {
        MapEditorActions.blurAll();
        event.preventDefault();
        event.stopPropagation();
    }
    public componentWillMount = () => {
        MapEditorStore.addChangeListener(this.onChange);
        MapStore.addChangeListener(this.onChange);
    }
    public componentWillUnmount = () => {
        MapEditorStore.removeChangeListener(this.onChange);
        MapStore.addChangeListener(this.onChange);
    }
    public componentDidUpdate = () => {
        this.jsPlumbInstance.setSuspendDrawing(false, true);
    }

    public render() {
        this.jsPlumbInstance.setSuspendDrawing(true);
        let realCanvasDivStyle = {
            bottom: 22,
            left: 4,
            position: 'absolute',
            right: 5,
            top: 5,
            zIndex: 5
        } as CSSProperties;
        if (this.state.dragInProgress) {
            realCanvasDivStyle = _.extend(realCanvasDivStyle, {
                border: '1px solid #00789b',
                borderColor: "#00789b",
                boxShadow: "0 0 10px 3px #00789b",
            });
        }

        let nodes = [] as any[];
        let connections = [] as any[];
        if (this.state.width !== 0 && this.state.height !== 0) {
            nodes = this.renderNodes(MapStore.getState().nodes);
            connections = this.renderConnections(MapStore.getState().connections);
        }

        return (
            <div style={{flex: '1 1 auto', minHeight: 500, minWidth: 600, position: 'relative'}}>
                <div>
                    <div style={realCanvasDivStyle}
                         ref={input => this.setContainer(input)} onClick={this.onClickHandler}>
                        <ReactResizeDetector handleWidth={true} handleHeight={true} onResize={this.onResize}/>
                        {nodes}
                        {connections}
                    </div>
                    <div style={axisX}>
                        <div style={genesisStyle}>Genesis</div>
                        <div style={customBuiltStyle}>Custom Built</div>
                        <div style={productStyle}>Product or Rental</div>
                        <div style={commodityStyle}>Commodity/Utility</div>
                    </div>
                    <div style={arrowX}/>
                    <div style={valueCaption}>Visibility</div>
                    <div style={axisY}/>
                    <div style={arrowY}/>
                    <div style={evolutionCaption}>Evolution</div>
                    <div style={axisSupport1}/>
                    <div style={axisSupport2}/>
                    <div style={axisSupport3}/>
                </div>
            </div>
        );
    }
    private setContainer = (input: HTMLDivElement | null) => {
        this.input = input;
        if (!this.input) {
            // noop - component was destroyed, no need to worry about draggable
            return;
        }
        this.jsPlumbInstance.setContainer(this.input);

        this.jsPlumbInstance.unbind('connectionDrag', this.connectionDragStarted);
        this.jsPlumbInstance.unbind('connectionDragStop', this.connectionDragStopped);
        this.jsPlumbInstance.unbind('beforeDrop', this.beforeDropListener);

        this.jsPlumbInstance.bind('connectionDrag', this.connectionDragStarted);
        this.jsPlumbInstance.bind('connectionDragStop', this.connectionDragStopped);
        this.jsPlumbInstance.bind('beforeDrop', this.beforeDropListener);
    }
    private connectionDragStarted = (event: any) => {
        MapEditorActions.scopeDragActivated(event.scope, event.sourceId);
    }
    private connectionDragStopped = (event: any) => {
        MapEditorActions.scopeDragDectivated(event.scope, event.targetId);
    }

    private beforeDropListener = (connection: any) => {
        MapActions.connectionInitiated(connection.scope, connection.sourceId, connection.targetId);
        MapEditorActions.turnOffRecentDropTarget();
        return false;
    }

    private onResize = (width: number, height: number) => {
        MapEditorActions.resize(width, height, this.input);
    }
    private onChange = () => {
        this.setState(MapEditorStore.getState());
    }

    // TODO: fix types
    private renderNodes(nodes: any[]) {
        const result = [];
        for (const node of nodes) {
            const focused = this.state.focusedNodes.indexOf(node.id) > -1;
            result.push(<Node id={node.id} key={node.id} name={node.name} jsPlumbInstance={this.jsPlumbInstance}
                              evolution={node.evolution} visibility={node.visibility} parentWidth={this.state.width}
                              parentHeight={this.state.height} styler={this.props.styler} type={node.type}
                              focused={focused} activeDragScope={this.state.activeScope} multiNodeFocus={this.state.focusedNodes.length > 1}
                              nodeDroppedOntoId={this.state.nodeDroppedOntoId}/>);
        }
        return result;
    }

    private renderConnections(connections: any) {
        const result = [];
        for(const connectionDescription of connections){
            result.push(<NodeConnection jsPlumbInstance={this.jsPlumbInstance} scope={connectionDescription.scope} sourceId={connectionDescription.sourceId} styler={this.props.connectionStyler} targetId={connectionDescription.targetId}/>)
        }
        return result;
    }
}