import * as React from 'react';

// @ts-ignore
import {Connection, ElementGroupRef, ElementRef, Endpoint, jsPlumbInstance} from "jsplumb";


export interface IConnectionProps {
    jsPlumbInstance:jsPlumbInstance,
    scope: string,
    sourceId: string,
    targetId: string,
    styler: (type:string) => string | any;
}

export default class NodeConnection extends React.Component<IConnectionProps, any> {

    private jsPlumbInstance: jsPlumbInstance;

    constructor(props: IConnectionProps) {
        super(props);
        this.jsPlumbInstance = props.jsPlumbInstance;
        this.state = {};
    }

    public render() {
        // this is noop, as connections are rendered using jsplumb
        return null;
    }

    public componentDidMount = () => {
        const computedStyle = this.props.styler(this.props.scope);
        const params = {
            anchors : [computedStyle.sourceAnchors, computedStyle.targetAnchors],
            connector: computedStyle.connector,
            detachable : false,
            endpoint: computedStyle.endpoint,
            scope: this.props.scope,
            source:this.props.sourceId,
            target:this.props.targetId,
        };

        this.setState({connection:this.jsPlumbInstance.connect(params as any)});
    }

    public componentDidUpdate = () => {
        this.jsPlumbInstance.revalidate(this.props.sourceId);
        this.jsPlumbInstance.revalidate(this.props.targetId);
    }

    public componentWillUnmount = () => {
        this.jsPlumbInstance.detach(this.state.connection);
        this.setState({connection:null});
    }
}