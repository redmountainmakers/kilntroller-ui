import React from 'react';

class Section extends React.Component {
    render() {
        const SectionStyle = {
            backgroundColor : this.props.backgroundColor,
            height          : '100vh',
            width           : '100vh',
            overflow        : 'auto',
        };
        return (
            <div className="Section" style={ SectionStyle } />
        );
    }
}

Section.propTypes = {
    backgroundColor : React.PropTypes.string,
};

export default Section;
