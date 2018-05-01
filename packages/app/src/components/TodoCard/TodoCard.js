import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import config from "config";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid ${config.colors.grayBorder};
  height: 30px;
  padding: 20px;
  margin-bottom: 10px;
  background-color: ${config.colors.light};
  opacity: ${props => (props.checked ? 0.7 : 1)};
`;

const Left = styled.div`
  width: 10%;
`;

const Right = styled.div`
  width: 90%;
`;

const Text = styled.span`
  font-size: ${config.fontSizes.medium};
`;

const Checkbox = styled.input`
  zoom: 2;
`;

const TodoCard = ({ todoId, title, onChange, checked }) => (
  <Wrapper checked={checked}>
    <Left>
      <Checkbox
        checked={checked}
        type="checkbox"
        onChange={e => onChange(todoId, e.target.checked)}
      />
    </Left>
    <Right>
      <Text>{title}</Text>
    </Right>
  </Wrapper>
);

export default TodoCard;
