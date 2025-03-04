import { css } from 'lit';

const CalloutStyles = css`
  .callout {
    background: var(--callout-accent-background);
    border: 1px solid var(--callout-accent-border);
    color: var(--callout-accent-text);
    padding: 8px;
    border-radius: var(--card-inner-border-radius);
    display: flex;
    font-size: 0.9rem;
    gap: 8px;
    align-items: flex-start;
    &.red {
      background: var(--callout-red-background);
      border: 1px solid var(--callout-red-border);
      color: var(--callout-red-text);
    }
    &.orange {
      background: var(--callout-orange-background);
      border: 1px solid var(--callout-orange-border);
      color: var(--callout-orange-text);
    }
  }
`;

export default CalloutStyles;
