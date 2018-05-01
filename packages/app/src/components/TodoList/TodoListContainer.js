import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import cuid from "cuid";
import update from "immutability-helper";

import axios from "axios";
import config from "config";

const { getApiRoute, routePaths } = config;

export default class extends Component {
  static propTypes = {
    skipApi: PropTypes.bool
  };

  // we're building the list in the front-end -- if we were dealing with more records,
  // should consider doing this elsewhere
  mapTodosFromResponse = (todoList, metadata) => {
    const firstIndex = metadata.findIndex(m => m.previousId === null);
    const first = metadata[firstIndex].todoId;

    const metadataLookup = metadata.reduce(
      (acc, next) => ({ ...acc, [next.todoId]: next }),
      {}
    );

    const todoListLookup = todoList.reduce(
      (acc, next) => ({
        ...acc,
        [next.id]: next
      }),
      {}
    );

    let records = [];
    let currentId = first;

    while (currentId) {
      records.push({
        ...todoListLookup[currentId],
        todoId: todoListLookup[currentId].id
      });
      currentId = metadataLookup[currentId].nextId;
    }

    return records;
  };

  async componentDidMount() {
    try {
      const response = await axios.get(getApiRoute(routePaths.todos));

      this.setState({
        items: this.mapTodosFromResponse(
          response.data.todoList,
          response.data.metadata
        ),
        loading: false
      });
    } catch (e) {
      console.error(e);
    }
  }

  constructor(props) {
    super(props);

    const { skipApi } = props;

    if (skipApi) {
      this.state = { items: props.items || [] };
    } else {
      this.state = { items: [], isLoading: true };
    }
  }

  removeTodo = async id => {
    try {
      const index = this.state.items.findIndex(i => i.todoId === id);
      const items = [...this.state.items];
      const [removed] = items.splice(index, 1);

      const response = await axios.post(`${getApiRoute(routePaths.archive)}`, {
        todoId: id
      });

      this.setState({ items });
    } catch (ex) {}
  };

  updateTodo = async (id, value) => {
    try {
      const { skipApi } = this.props;

      const index = this.state.items.findIndex(item => item.todoId === id);

      if (!skipApi) {
        const response = await axios.put(
          `${getApiRoute(routePaths.todos)}${id}`,
          {
            isComplete: value
          }
        );
      }

      this.setState({
        items: update(this.state.items, {
          [index]: { isComplete: { $set: value } }
        })
      });
    } catch (ex) {
      console.error(ex);
    }
  };

  addTodo = async title => {
    try {
      const { skipApi } = this.props;

      const items = [...this.state.items];

      if (skipApi === true) {
        items.push({ todoId: cuid(), title, isComplete: false });
        this.setState({ items });
      } else {
        const response = await axios.post(getApiRoute(routePaths.todos), {
          title
        });

        items.push({
          todoId: response.data.id,
          title: response.data.title,
          isComplete: response.data.isComplete
        });
        this.setState({ items });
      }
    } catch (ex) {
      console.error(ex);
    }
  };

  updateOrder = async update => {
    const { skipApi } = this.props;
    const items = [...this.state.items];
    const [removed] = items.splice(update.source.index, 1);
    items.splice(update.destination.index, 0, removed);

    const todoId = update.draggableId;

    const previousId =
      update.destination.index === 0
        ? null
        : items[update.destination.index - 1].todoId;

    // optimistically update the row order
    this.setState({ items }, async () => {
      if (!skipApi) {
        try {
          const update = await axios.post(getApiRoute(routePaths.reorder), {
            todoId,
            previousId
          });
        } catch (ex) {
          console.error(ex);
        }
      }
    });
  };

  render() {
    const { items } = this.state;
    const { updateOrder, addTodo, updateTodo, removeTodo } = this;

    const actions = {
      updateOrder,
      addTodo,
      updateTodo,
      removeTodo
    };

    return this.props.children(items, actions);
  }
}
