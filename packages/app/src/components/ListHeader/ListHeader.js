import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import config from "config";

import Button from "../Button";
import Input from "../Input";

const Wrapper = styled.div`
  height: 100px;
  background-color: ${config.colors.gray};
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border: 1px solid ${config.colors.grayBorder};
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Left = styled.div`
  margin: 0;
  width: 75%;
  padding-left: 15px;
`;

const Right = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  width: 25%;
  padding-right: 15px;
`;

export default class extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  };

  state = { todoValue: "" };

  isValid = () => !this.state.todoValue.length < 1;

  addTodo = () => {
    const { onSubmit } = this.props;
    const { todoValue } = this.state;

    if (!this.isValid()) {
      this.setState({ errorText: "Please add a valid todo" });
      return;
    }

    onSubmit(todoValue);
    this.setState({ todoValue: "", errorText: null });
  };

  render() {
    return (
      <Wrapper>
        <Left data-id="huh">
          <Input
            value={this.state.todoValue}
            errorText={this.state.errorText}
            onChange={todoValue => {
              this.setState({ todoValue, errorText: null });
            }}
          />
        </Left>
        <Right>
          <Button style={{ width: "80%" }} onClick={this.addTodo}>
            Add
          </Button>
        </Right>
      </Wrapper>
    );
  }
}
