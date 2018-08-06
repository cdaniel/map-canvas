
interface IMapState {
    nodes : Array<{
        evolution : number,
        id : string,
        name : string,
        type: string,
        visibility : number,
        }>;
    connections : Array<{
       scope : string,
       sourceId : string,
       targetId : string
    }>;
}

export default IMapState;