import * as React from 'react';

import * as jsPlumb from './../../node_modules/jsplumb';

import {jsPlumbInstance} from "jsplumb";
import {ReactElement} from "react";

import * as MapActions from '../actions/MapActions';
import * as MapEditorActions from '../actions/MapEditorActions';

import MapEditorStore from '../stores/MapEditorStore';

interface IPaletteComponent {
    id: number;
    key: string;
    label: string;
    visualElement: ReactElement<HTMLDivElement>;
};

export interface IPaletteComponents extends Array<IPaletteComponent> {
};

export interface IProps {
    components: IPaletteComponents,
    jsPlumbInstance: jsPlumbInstance
}

export default class Palette extends React.Component<IProps, object> {

    private components: IPaletteComponents;
    private jsPlumbInstance: jsPlumbInstance;

    constructor(props: IProps) {
        super(props);
        this.components = props.components;
        this.jsPlumbInstance = props.jsPlumbInstance;
    }

    public renderComponent(component: IPaletteComponent) {
        const key = component.key;
        const style = component.visualElement.props.style;
        if(style){
            style.cssFloat = 'left';
            if(!style.height){
                style.height = '20px';
            }
            if(!style.width) {
                style.width = '20px';
            }
        }
        return <div ref={this.makeDraggable.bind(this, key)} key={key} style={{margin: 10, minWidth: 167,
            width: 167}}>
            <div>{component.visualElement}</div>
            <span>&nbsp;{component.label}</span></div>;
    }

    public makeDraggable(type: string, input: {}) {

        if (input === null) {
            // noop - component was destroyed, no need to worry about draggable
            return;
        }
        const d = this.jsPlumbInstance.draggable(input, {
            clone: true,
            grid: [
                '10', '10'
            ],
            ignoreZoom: true,
            start : () => {
                MapEditorActions.blurAll();
                MapEditorActions.startDrag();
            },
            stop : (params : any ) => {
                MapEditorActions.stopDrag(type, params);
                // if the drop is on the map canvas
                if(MapEditorStore.verifyTarget(params)){
                    const coords = MapEditorStore.normalizeCoord(params.e.offsetX, params.e.offsetY);
                    MapActions.initiateNewNodeCreationProcess(type, coords);
                }
            }
        } as jsPlumb.DragOptions);
        return d;
    }

    public renderComponents(components: IPaletteComponents) {
        const result = [];
        for (let i = 0; i < components.length; i++) {
            const component: IPaletteComponent = this.components[i];
            result.push(this.renderComponent(component));
        }
        return result;
    }

    public render() {
        const renderedComponents = this.renderComponents(this.components);
        return (
            <div style={{
                alignSelf: 'flex-start',
                borderColor: 'gray',
                borderStyle: 'dotted',
                borderWidth: 1,
                fontSize: 'smaller',
                margin: 3,
                minWidth: 170,
                width: 170
            }}>
                <div style={{marginLeft: 3}}>
                    {renderedComponents}
                </div>
            </div>
        );
    }

}