import * as React from 'react';
import {CSSProperties} from "react";
import * as _ from 'underscore';

import ReactResizeDetector from 'react-resize-detector';

import {jsPlumbInstance} from "jsplumb";
import MapEditorState from "../types/MapEditorState";

import * as MapEditorActions from '../actions/MapEditorActions';
import MapEditorStore from '../stores/MapEditorStore';


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
    jsPlumbInstance: jsPlumbInstance
}

export default class MapCanvas extends React.Component<IProps, MapEditorState> {

    private jsPlumbInstance: jsPlumbInstance;
    private input: HTMLDivElement | null;

    constructor(props: IProps) {
        super(props);
        this.jsPlumbInstance = props.jsPlumbInstance;
        this.state = MapEditorStore.getState();
    }

    public render() {
        let realCanvasDivStyle = {position: 'absolute', left: 4, right: 5, top: 5, bottom: 22, zIndex: 5} as CSSProperties;
        if(this.state.dragInProgress){
            realCanvasDivStyle = _.extend(realCanvasDivStyle, {
                border: '1px solid #00789b',
                borderColor: "#00789b",
                boxShadow: "0 0 10px 3px #00789b",
            });
        }
        return (
            <div style={{flex: '1 1 auto', minHeight: 500, minWidth: 600, position: 'relative'}}>
                <div>
                    <div style={realCanvasDivStyle}
                         ref={input => this.setContainer(input)}>
                        <ReactResizeDetector handleWidth={true} handleHeight={true} onResize={this.onResize}
                                             refreshMode="debounce"
                                             refreshRate={50}/>
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

    public componentWillMount = () => {
        MapEditorStore.addChangeListener(this.onChange);
    }

    public componentWillUnmount = () => {
        MapEditorStore.removeChangeListener(this.onChange);
    }

    private setContainer = (input: HTMLDivElement | null) => {
        this.input = input;
        if (this.input === null) {
            // noop - component was destroyed, no need to worry about draggable
            return;
        }
        this.jsPlumbInstance.setContainer(this.input);
    }
    private onResize = (width: number, height: number) => {
        MapEditorActions.resize(width,height);
    }

    private onChange = () => {
        this.setState(MapEditorStore.getState());
    }

}