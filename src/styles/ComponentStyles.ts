import { css } from 'lit';

const ComponentStyles = css`
  .wrapper {
    background-color: var(--card-background);
    border: 1px solid var(--card-border-color);
    border-radius: var(--card-border-radius);
    box-shadow: var(--card-box-shadow);
    padding: var(--card-padding);
    display: flex;
    gap: 4px;
    height: 46px;
    width: fit-content;
    box-sizing: border-box;
    overflow: hidden;
  }
  h2 {
    margin: 0 0 10px;
    font-size: 1rem;
    font-weight: 500;
  }
  label {
    font-size: 0.9rem;
    margin-right: 8px;
  }
  select {
    padding: 4px 6px;
    font-size: 0.9rem;
    border: 1px solid var(--card-border-color);
    border-radius: 4px;
    background-color: var(--card-background);
    color: inherit;
  }

  .visualiser {
    width: 16px;
    height: 100%;
    background: var(--visualiser-background);
    margin-top: 8px;
    border-radius: 5px;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
  }
  .level {
    height: 100%;
    width: 100%;
    background: var(--visualiser-level-color);
    transition: width 0.1s ease-in-out;
  }
`;

export default ComponentStyles;
