import * as React from 'react';
import './App.css';

import Canvas, {IPaletteComponents} from './components/Canvas';
import logo from './logo.svg';

import * as jsPlumb from "jsplumb";



const params: IPaletteComponents = [
    {
        id: 0, key: "0", label: 'CId', visualElement: <div style={{
              backgroundColor: 'silver',float:
            'left', height: 20,width: 20}}/>
    },
    {id: 1, key: "01", label: 'Modified By', visualElement: <div style={{
            backgroundColor: 'yellow',float:
                'left', height: 20,width: 20}}/>},
    {id: 2, key: "02", label: 'Modified Date', visualElement: <div style={{
            backgroundColor: 'red',float:
                'left', height: 20,width: 20}}/>},
    {id: 3, key: "03", label: 'Status', visualElement: <div style={{
            backgroundColor: 'green',float:
                'left', height: 20,width: 20}}/>},
    {id: 4, key: "04", label: 'Status > Type', visualElement: <div style={{
            backgroundColor: 'black',float:
                'left', height: 20,width: 20}}/>},
    {id: 5, key: "05", label: 'Title', visualElement: <div style={{
            backgroundColor: 'blue',float:
                'left', height: 20,width: 20}}/>},
    {id: 6, key: "06", label: 'Type', visualElement: <div style={{
            backgroundColor: 'purple',float:
                'left', height: 20,width: 20}}/>},
    {id: 7, key: "087", label: 'Type > Status', visualElement: <div style={{
            backgroundColor: 'gray',float:
                'left', height: 20,width: 20}}/>}
];

const jsPlumbInstance = jsPlumb.jsPlumb.getInstance();
class App extends React.Component {
  public render() {
    return (
      <div style={{display:'flex',height:'100%', flexFlow:'column'}}>
        <header className="App-header" style={{flex:"0 1 auto"}}>
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
          <div style={{display:'flex', flex:"1 1 auto",}}>
              <Canvas components={params} jsPlumbInstance={jsPlumbInstance}/>
              <div style={{background:'red', flex:'1 1 auto', minHeight:500, minWidth:600}}>blah</div>
          </div>
      </div>
    );
  }
}

export default App;
