import React from 'react';


class Hero extends React.Component {

    render() {
        const HeroStyle = {
            height : '100vh',
            width  : '100vh',
        };
        return (
            <div className="Hero" style={ HeroStyle } />
        );
    }
}
export default Hero;
