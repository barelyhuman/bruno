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

  .bruno-cm6-editor .cm-scroller::-webkit-scrollbar {
    width: 0.6rem;
    height: 0.6rem;
  }

  .bruno-cm6-editor .cm-scroller::-webkit-scrollbar-track {
    background-color: ${(props) => (props.$isDark ? 'transparent' : '#f1f1f1')};
  }

  .bruno-cm6-editor .cm-scroller::-webkit-scrollbar-thumb {
    background-color: ${(props) => (props.$isDark ? '#444444' : '#d2d7db')};
    border-radius: 5rem;
  }

  .cm-variable-valid {
    color: ${(props) => props.theme.codemirror.variable.valid};
  }
  .cm-variable-invalid {
    color: ${(props) => props.theme.codemirror.variable.invalid};
  }

  /* Search panel inputs (CM6 native search) */
  .bruno-cm6-editor .cm-panel input {
    background: transparent;
    border: 1px solid #d3d6db;
    outline: none;
    border-radius: 0;
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

  .CodeMirror-overlayscroll-horizontal div,
  .CodeMirror-overlayscroll-vertical div {
    background: ${(props) => (props.$isDark ? '#444444' : '#d2d7db')};
  }

  .CodeMirror-dialog {
    overflow: visible;
    input {
      background: transparent;
      border: 1px solid #d3d6db;
      outline: none;
      border-radius: 0;
    }
  }

  .CodeMirror-matchingbracket {
    background: ${(props) => props.theme.status.success.background} !important;
    text-decoration: unset;
  }

  .CodeMirror-nonmatchingbracket {
    color: ${(props) => props.theme.colors.text.danger} !important;
    background: ${(props) => props.theme.status.danger.background} !important;
    text-decoration: unset;
  }
`;

export default StyledWrapper;
