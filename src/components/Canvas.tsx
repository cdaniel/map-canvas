import * as React from 'react';

import * as jsPlumb from './../../node_modules/jsplumb';

import {jsPlumbInstance} from "jsplumb";



interface IPaletteComponent {
    id: number;
    key: string;
    label: string;
    visualElement: object;
};

export interface IPaletteComponents extends Array<IPaletteComponent> {};

export interface IProps {
    components : IPaletteComponents,
    jsPlumbInstance:jsPlumbInstance
}

export default class Canvas extends React.Component<IProps, object> {

    private components : IPaletteComponents;
    private jsPlumbInstance : jsPlumbInstance;

    constructor(props:IProps) {
        super(props);
        this.components = props.components;
        this.jsPlumbInstance = props.jsPlumbInstance;
    }

    public renderComponent(component: IPaletteComponent){
        const key = component.key;
        return  <div ref={this.makeDraggable.bind(this, key)} key={key} style={{margin:10}}><div>{component.visualElement}</div><span>{component.label}</span></div>;
    }

    public makeDraggable(type:string, input:{}){

        if (input === null) {
            // noop - component was destroyed, no need to worry about draggable
            return;
        }
        const d = this.jsPlumbInstance.draggable(input, {
            clone: true,
            grid: [
                '10', '10'
            ],
            ignoreZoom: true
        } as jsPlumb.DragOptions);
        return d;
    }

    public renderComponents(components : IPaletteComponents){
        const result = [];
        for(let i = 0; i < components.length; i++){
            const component : IPaletteComponent = this.components[i];
            result.push(this.renderComponent(component));
        }
        return result;
    }

    public render() {
        const renderedComponents = this.renderComponents(this.components);
        return (
            <div style={{width:170, borderWidth: 1, borderColor: 'gray', borderStyle:'dotted'}}>
                <div style={{marginLeft: 10,}}>
                     {renderedComponents}
                </div>
            </div>
        );
    }

}