import { css } from 'lit';

const ThemeStyles = css`
  :host {
    /* Component Defaults */
    --component-font-family: 'Segoe UI', Roboto, sans-serif;
    --component-text-color: #333;

    /* Card Defaults */
    --card-background: #fff;
    --card-border-color: #ddd;
    --card-padding: 4px;
    --card-border-radius: 8px;
    --card-inner-border-radius: 6px;
    --card-box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

    /* Actions Defaults */
    --action-plain-border-color: #ccc;
    --action-plain-background-hover: #ddd;

    --action-accent-background: #007bff;
    --action-accent-background-hover: #0056b3;
    --action-accent-text-color: #fff;

    --action-red-background: #dc3545;
    --action-red-background-hover: #bd2130;
    --action-red-text-color: #fff;

    /* Callout Defaults */
    --callout-accent-background: #007bff33;
    --callout-accent-border: #007bff99;
    --callout-accent-text: #007bff;

    --callout-red-background: #dc354533;
    --callout-red-border: #dc354599;
    --callout-red-text: #dc3545;

    --callout-orange-background: #fd7e1433;
    --callout-orange-border: #fd7e1499;
    --callout-orange-text: #fd7e14;

    /* Visualiser Defaults */
    --visualiser-background: #e0e0e0;
    --visualiser-level-color: #28a745;
  }

  @media (prefers-color-scheme: dark) {
    :host {
      /* Component Dark */
      --component-text-color: #eee;

      /* Card Dark */
      --card-background: #333;
      --card-border-color: #555;

      /* Actions Dark */
      --action-plain-border-color: #555;
      --action-plain-background: #333;
      --action-plain-background-hover: #444;

      --action-accent-background: #0056b3;
      --action-accent-background-hover: #003d80;

      /* Visualiser Dark */
      --visualiser-background: #fff;
    }
  }
  :host {
    box-sizing: border-box;
    font-family: var(--component-font-family);
    color: var(--component-text-color);
  }
`;

export default ThemeStyles;
