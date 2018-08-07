
interface IMapState {
    nodes : Array<{
        evolution : number,
        id : string,
        name : string,
        type: string,
        visibility : number,
        }>;
    connections : Array<{
       label?: string;
       scope : string,
       sourceId : string,
       targetId : string
    }>;
}

export default IMapState;