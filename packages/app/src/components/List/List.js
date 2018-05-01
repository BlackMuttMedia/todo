import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import config from "config";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default class extends React.Component {
  static propTypes = {
    updateOrder: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    children: PropTypes.any.isRequired
  };

  getItemStyle = (isDragging, draggableStyle) => ({
    ...draggableStyle
  });

  onDragEnd = result => {
    if (!result.destination) {
      return;
    }

    this.props.updateOrder(result);
  };

  render() {
    // some of the code is based on the example from https://github.com/atlassian/react-beautiful-dnd
    // as noted there - it could be useful to break this down into several components
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              isDraggingOver={snapshot.isDraggingOver}
              style={{
                paddingTop: 10,
                paddingBottom: 10,
                border: `1px solid ${config.colors.grayBorder}`
              }}
            >
              {this.props.items.map((item, index) => (
                <Draggable
                  key={item.todoId}
                  draggableId={item.todoId}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        paddingLeft: 10,
                        paddingRight: 10
                      }}
                    >
                      {this.props.children(item)}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}
