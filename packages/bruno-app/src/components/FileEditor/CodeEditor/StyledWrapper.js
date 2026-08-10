import styled from 'styled-components';

const StyledWrapper = styled.div`
  position: relative;
  height: 100%;

  .bruno-cm6-editor .cm-editor {
    height: 100%;
    background: ${(props) => props.theme.codemirror.bg};
    border: solid 1px ${(props) => props.theme.codemirror.border};
    font-family: ${(props) => (props.font ? props.font : 'default')};
    line-break: anywhere;
  }

  .bruno-cm6-editor .cm-scroller {
    line-break: anywhere;
    overflow: auto;
  }

  .cm-variable-valid {
    color: green;
  }
  .cm-variable-invalid {
    color: red;
  }
`;

export default StyledWrapper;
