import React from 'react';
import Section from './Section.jsx';
// import Graph from './Graph.jsx';
import Status from './Status.jsx';


class Container extends React.Component {
  render() {
    var containerStyle = {

    };
    return (
      <div style={containerStyle} className="Container">
        <Status backgroundColor="white"/>
        <Section backgroundColor="blue"/>
        <Section backgroundColor="yellow"/>
        <Section backgroundColor="purple"/>
      </div>
    );
  }
}
export default Container;
