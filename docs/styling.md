# Styling the Corti Dictation Web Component

The **Corti Dictation Web Component** provides various CSS variables for customization. You can override these variables to match your design system.

## Overriding Dark/Light Theme
By default, the UI uses the system color-scheme (dark or light). This may not suit your application though, so you can force either dark or light using the `color-scheme` CSS property. For example, the styles below will force light mode.

```css
corti-dictation {
    color-scheme: light;
}
```

## Using CSS Variables
For more control in customization of the UI component, you can redefine the variables inside a global CSS file or within a `<style>` tag. Note, the following CSS variables may change over time.

```css
corti-dictation {
  --component-font-family: 'Arial', sans-serif;
  --component-text-color: #222;
  --card-background: #f9f9f9;
  --action-accent-background: #ff6600;
}
```

## Available Styling Variables

### Component Defaults
| Variable | Default Value (Light) | Description |
|----------|--------------|-------------|
| `--component-font-family` | `-apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, Cantarell, Ubuntu, roboto, noto, helvetica, arial, sans-serif` | The font family used in the component. |
| `--component-text-color` | `#333` | Text color for the component. |

### Card Styling
| Variable | Default Value (Light) | Description |
|----------|--------------|-------------|
| `--card-background` | `#fff` | Background color of the component's card. |
| `--card-border-color` | `#ddd` | Border color of the card. |
| `--card-padding` | `4px` | Padding inside the card. |
| `--card-border-radius` | `8px` | Outer border radius of the card. |
| `--card-inner-border-radius` | `6px` | Inner border radius of the card. |
| `--card-box-shadow` | `0 2px 5px rgba(0, 0, 0, 0.1)` | Shadow effect for the card. |

### Action Buttons
| Variable | Default Value (Light) | Description |
|----------|--------------|-------------|
| `--action-plain-border-color` | `#ccc` | Border color for plain action buttons. |
| `--action-plain-background-hover` | `#ddd` | Background color when hovering over plain action buttons. |
| `--action-accent-background` | `#007bff` | Background color for primary action buttons. |
| `--action-accent-background-hover` | `#0056b3` | Hover background color for primary action buttons. |
| `--action-accent-text-color` | `#fff` | Text color for primary action buttons. |
| `--action-red-background` | `#dc3545` | Background color for recording active action buttons. |
| `--action-red-background-hover` | `#bd2130` | Hover background color for recording active action buttons. |
| `--action-red-text-color` | `#fff` | Text color for recording active action buttons. |

## Customizing with Shadow DOM 
The component uses Shadow DOM, so styles outside of CSS variables must be injected inside the Shadow DOM. Element IDs can change at any time though, so you should only consider this in very specifci situations. You can do this using JavaScript:

```js
document.querySelector('corti-dictation').shadowRoot.querySelector('button').style.color = "red"
```

For further customization, consider using the component’s events and JavaScript APIs to build your own UI.

