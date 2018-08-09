import * as React from 'react';

export interface IRubberbandProps {
    startPos : {left:number, top:number},
    endPos : {left:number, top:number},
    parentHeight: number,
    parentWidth: number
}

const menuItemHighlightColor = 'rgb(0,120,155)';

export default class RubberBand extends React.Component<IRubberbandProps, any> {

    constructor(props: IRubberbandProps) {
        super(props);
    }

    public render() {


        const trueLeft = this.props.startPos.left < this.props.endPos.left ? this.props.startPos.left : this.props.endPos.left;
        const trueTop = this.props.startPos.top < this.props.endPos.top ? this.props.startPos.top : this.props.endPos.top;

        const trueRight = this.props.startPos.left > this.props.endPos.left ? this.props.startPos.left : this.props.endPos.left;
        const trueBottom = this.props.startPos.top > this.props.endPos.top ? this.props.startPos.top : this.props.endPos.top;

        const left = trueLeft * this.props.parentWidth;
        const top = trueTop * this.props.parentHeight;
        const right = (1 - trueRight) * this.props.parentWidth;
        const bottom = (1 - trueBottom ) * this.props.parentHeight;

        if(trueRight * this.props.parentWidth - left < 20 && trueBottom* this.props.parentHeight - top < 20) {
            return null;
        }

        const zIndex = 4;
        const position = 'absolute' as 'absolute';
        const boxShadow = '0 0 3px ' + menuItemHighlightColor;
        const border = '1px solid ' + menuItemHighlightColor;
        const componentStyle = {border, bottom, boxShadow,left, right, top, zIndex, position};

        return (
            <div key={"rubberband"} style={componentStyle}/>
        );
    }

}