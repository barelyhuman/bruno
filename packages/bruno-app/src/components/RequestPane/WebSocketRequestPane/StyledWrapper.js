import styled from "styled-components";

const StyledWrapper = styled.div`
  .ws-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .ws-messages {
    min-height: 120px;
    max-height: 260px;
    overflow-y: auto;
  }

  .ws-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-radius: 3px;
    padding: 0.5rem 0.75rem;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
    word-break: break-word;

    &.sent{
        max-width: 50ch;
        background: ${(props) => props.theme.requestTabPanel.ws.message.sent.bg};
        margin-left:auto;
    }
    &.received{
        max-width: 50ch;
        background: ${(props) => props.theme.requestTabPanel.ws.message.received.bg};
        margin-right:auto;
    }
  }
  
  .ws-error {
    margin-top: 1rem;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    background: var(--color-error-bg);
    color: var(--color-error);
    border: 1px solid var(--color-error);
    font-size: 0.95rem;
  }

  .ws-input {
    padding: 0.5rem 0.75rem;
    border: 0.5px solid  ${(props) => props.theme.input.border};
    background: ${(props) => props.theme.input.bg};
    font-size: 1rem;
    outline: none;
    transition: border 0.2s;


    &:focus{
        border: 0.5px solid  ${(props) => props.theme.input.focusBorder};
    }

    &:disabled{
        cursor: not-allowed;
    }
  }
`;

export default StyledWrapper;
