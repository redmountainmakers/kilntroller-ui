import React from 'react';


class Hero extends React.Component {

  render() {

    var HeroStyle = {
      height: '100vh',
      width: '100vh'
    };
    return (
      <div className="Hero" style={HeroStyle}></div>
    );
  }
}
export default Hero;
