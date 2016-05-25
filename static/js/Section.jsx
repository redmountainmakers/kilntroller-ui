import React from "react";

class Section extends React.Component {
  render() {
    var SectionStyle = {
      backgroundColor: this.props.backgroundColor,
      height: '100vh',
      width: '100vh',
      overflow: 'auto'
    };
    return (
      <div className="Section" style={SectionStyle}></div>
    );
  }
}
export default Section;
