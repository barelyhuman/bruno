import styled from 'styled-components';

const StyledWrapper = styled.div`
  .bruno-cm6-editor .cm-editor {
    height: calc(100vh - 9rem);
    background: ${(props) => props.theme.codemirror.bg};
    border: solid 1px ${(props) => props.theme.codemirror.border};
    font-family: ${(props) => (props.font ? props.font : 'default')};
    font-size: ${(props) => props.theme.font.size.base};
  }

  .bruno-cm6-editor .cm-scroller {
    line-break: anywhere;
    overflow: auto;
  }

  .bruno-cm6-editor .cm-content {
    line-break: anywhere;
  }

  .cm-variable-valid {
    color: ${(props) => props.theme.codemirror.variable.valid};
  }
  .cm-variable-invalid {
    color: ${(props) => props.theme.codemirror.variable.invalid};
  }

  /* CM5 selectors kept for coexistence with other editors */
  div.CodeMirror {
    height: calc(100vh - 9rem);
    background: ${(props) => props.theme.codemirror.bg};
    border: solid 1px ${(props) => props.theme.codemirror.border};
    font-family: ${(props) => (props.font ? props.font : 'default')};
    font-size: ${(props) => props.theme.font.size.base};
    line-break: anywhere;
  }
`;

export default StyledWrapper;
