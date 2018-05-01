import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import config from "config";

import ListHeader from "../ListHeader";
import List from "../List";
import TodoCard from "../TodoCard";

const Wrapper = styled.div`
  background-color: ${config.colors.gray};
  min-width: 640px;
`;

export default class extends Component {
  render() {
    const { actions, items } = this.props;
    return (
      <Wrapper>
        <ListHeader onSubmit={actions.addTodo} />
        {items && items.length > 0 ? (
          <List items={items} updateOrder={actions.updateOrder}>
            {item => (
              <TodoCard
                todoId={item.todoId}
                title={item.title}
                onChange={actions.updateTodo}
                checked={item.isComplete}
                onRemove={actions.removeTodo}
              />
            )}
          </List>
        ) : (
          <span>No Todos - Please add some 👍</span>
        )}
      </Wrapper>
    );
  }
}
