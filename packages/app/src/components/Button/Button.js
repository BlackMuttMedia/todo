import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import config from "config";

const Button = styled.button`
  height: 48px;
  padding: 15px;
  border: none;
  border-radius: 5px;
  background-color: ${props => props.backgroundColor};
  color: ${props => props.color};
  font-size: ${config.fontSizes.small};
`;

export default class extends Component {
  static propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func,
    style: PropTypes.object
  };

  getBackgroundColor = () => {
    const { backgroundColor } = this.props;
    return backgroundColor || config.colors.primary;
  };

  getColor = () => {
    const { color } = this.props;
    return color || config.colors.light;
  };

  render() {
    const backgroundColor = this.getBackgroundColor();
    const { children, onClick, style } = this.props;

    return (
      <Button
        backgroundColor={backgroundColor}
        color={this.getColor()}
        onClick={onClick}
        style={style}
      >
        {children}
      </Button>
    );
  }
}
