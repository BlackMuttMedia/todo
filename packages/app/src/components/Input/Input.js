import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import config from "config";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const StyledInput = styled.input`
  font-size: ${config.fontSizes.medium}
  padding: 0 10px;
  height: 48px;
  width: 100%;
  max-width: 100%;
  border-radius: 5px;
  border: 1px solid ${config.colors.grayBorder};
  shadow: none;
`;

const ErrorText = styled.small`
  position: absolute;
  right: 0;
  font-size: ${config.fontSizes.tiny};
  color: ${config.colors.error};
  margin-top: 10px;
  font-family: sans-serif;
`;

const Input = ({ placeholder, errorText, onChange, value, onSubmit }) => (
  <Wrapper>
    {errorText && <ErrorText>{errorText}</ErrorText>}
    <StyledInput
      type="text"
      value={value}
      placeholder={placeholder}
      onKeyUp={e => {
        if (e.keyCode === 13) {
          onSubmit();
        }
      }}
      onChange={e => {
        onChange(e.target.value);
      }}
    />
  </Wrapper>
);

Input.propTypes = {
  onChange: PropTypes.func.isRequired,
  placeHolder: PropTypes.string,
  errorText: PropTypes.string,
  value: PropTypes.string
};

export default Input;
