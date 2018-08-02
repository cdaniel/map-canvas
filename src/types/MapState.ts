
interface IMapState {
    nodes : Array<{
        evolution : number,
        id : string,
        name : string,
        type: string,
        visibility : number,
        }>;
}

export default IMapState;