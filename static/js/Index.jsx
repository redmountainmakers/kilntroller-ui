import React from 'react';
import {render} from 'react-dom';

import Container from './Container.jsx';



class App extends React.Component {
    render () {
        var MainStyle = {
        };
        return (
            <Container  style={MainStyle}/>
        );
    }
}

render(<App/>, document.getElementById('app'));
