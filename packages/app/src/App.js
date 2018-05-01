import React, { Component } from "react";
import TodoList, { TodoListContainer } from "./components/TodoList";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  min-width: 640px;
`;

class App extends Component {
  render() {
    return (
      <Wrapper>
        <TodoListContainer>
          {(items, actions) => <TodoList items={items} actions={actions} />}
        </TodoListContainer>
      </Wrapper>
    );
  }
}

export default App;
