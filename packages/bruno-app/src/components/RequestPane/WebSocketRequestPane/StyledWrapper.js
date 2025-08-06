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
    background: var(--color-bg-secondary);
    border-radius: 8px;
    padding: 1rem;
    border: 1px solid var(--color-border-secondary);
    min-height: 120px;
    max-height: 260px;
    overflow-y: auto;
  }
  .ws-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
    word-break: break-word;
  }
  .ws-message.sent {
    background: var(--color-accent-bg);
    border-left: 3px solid var(--color-accent);
    color: var(--color-fg-primary);
  }
  .ws-message.received {
    background: var(--color-success-bg);
    border-left: 3px solid var(--color-success);
    color: var(--color-fg-primary);
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
