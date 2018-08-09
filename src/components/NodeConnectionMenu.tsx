import * as React from 'react';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export interface IProps {
    name: string,
    icon: any,
    action:any,
    connection:any
}

const menuItemNormalColor = 'gray';

const menuItemHighlightColor = 'rgb(0,120,155)';

export default class NodeConnectionMenu extends React.Component<IProps, any> {

    constructor(props: IProps) {
        super(props);
        this.state = {};
    }

    public render() {
        const highlightColor = this.props.name === 'delete' ? 'orange' : menuItemHighlightColor;
        const color = this.state.hoveredMenu ? highlightColor : menuItemNormalColor;
        return <span id={this.props.name} key={this.props.name} onMouseDown={this.clickWrapper()} onMouseEnter={this.onMouseOverFunction} onMouseLeave={this.onMouseLeaveFunction}
                     style={{zIndex:50, backgroundColor:'white', padding:2, margin:2}}>
                    <FontAwesomeIcon icon={this.props.icon} color={color}/>
                </span>;
    }

    public onMouseOverFunction = () => {
            this.setState({hoveredMenu : true});
    }

    public onMouseLeaveFunction = () => {
        this.setState({hoveredMenu : null});
    }

    public clickWrapper = () => {
        const sourceId = this.props.connection.sourceId;
        const targetId = this.props.connection.targetId;
        const scope = this.props.connection.scope;
        return (event:any) => {
            event.preventDefault();
            event.stopPropagation();
            this.props.action(sourceId, targetId, scope);
        }
    }

}