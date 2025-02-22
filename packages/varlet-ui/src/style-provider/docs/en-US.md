# Style Provider

### Intro

Component libraries organize styles through [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties).
Each component has a corresponding style variable, you can directly replace the style variable on the root node by overriding it with a CSS file.
Or use StyleProvider components.

### Basic Style Variable

Here are some basic style variables for the component library

```css
/* playground-ignore */
:root {
  --font-size-xs: 10px;
  --font-size-sm: 12px;
  --font-size-md: 14px;
  --font-size-lg: 16px;
  --icon-size-xs: 16px;
  --icon-size-sm: 18px;
  --icon-size-md: 20px;
  --icon-size-lg: 22px;
  --color-body: #fff;
  --color-text: #333;
  --color-primary: #3a7afe;
  --color-info: #00afef;
  --color-success: #00c48f;
  --color-warning: #ff9f00;
  --color-danger: #f44336;
  --color-disabled: #e0e0e0;
  --color-text-disabled: #aaa;
  --color-on-primary: #fff;
  --color-on-info: #fff;
  --color-on-success: #fff;
  --color-on-warning: #fff;
  --color-on-danger: #fff;
  --color-primary-container: #3a7afe;
  --color-info-container: #00afef;
  --color-success-container: #00c48f;
  --color-warning-container: #ff9f00;
  --color-danger-container: #f44336;
  --color-on-primary-container: #fff;
  --color-on-info-container: #fff;
  --color-on-success-container: #fff;
  --color-on-warning-container: #fff;
  --color-on-danger-container: #fff;
  --color-surface-container: #fff;
  --color-surface-container-low: #fff;
  --color-surface-container-high: #fff;
  --color-surface-container-highest: #fff;
  --color-inverse-surface: #333;
  --color-outline: rgba(0, 0, 0, 0.12);
  --color-on-surface-variant: #888;
  --opacity-disabled: 0.6;
  --opacity-hover: 0.15;
  --opacity-focus: 0.2;
  --cubic-bezier: cubic-bezier(0.25, 0.8, 0.5, 1);
  --shadow-key-umbra-opacity: rgba(0, 0, 0, 0.2);
  --shadow-key-penumbra-opacity: rgba(0, 0, 0, 0.14);
  --shadow-key-ambient-opacity: rgba(0, 0, 0, 0.12);
}
```

### Modify Styles At Runtime

Maybe you have a need to replace the style while the program is runtime, like a one-click skin change or something.
The component library provides a StyleProvider component to assist in managing styles,
Component provides' `component call` and `function call` and two invocation modes.

### Component Call

Component calls can have a scope of custom component styles, Scope contamination is avoided.
Note that some elements sent outside the StyleProvider using the `teleport` will not work.

```html
<script setup>
import { ref, reactive } from 'vue'

const state = reactive({
  score: 5,
  license: true,
})

const successTheme = {
  '--rate-primary-color': 'var(--color-success)',
  '--button-primary-color': 'var(--color-success)',
  '--switch-handle-active-background': 'var(--color-success)',
  '--switch-track-active-background': 'var(--color-success)',
}

const styleVars = ref(null)

function toggleTheme() {
  styleVars.value = styleVars.value ? null : successTheme
}
</script>

<template>
  <var-style-provider :style-vars="styleVars">
    <var-rate v-model="state.score" />
    <var-switch v-model="state.license" />
    <var-button 
      style="margin-top: 10px" 
      type="primary"
      block
      @click="toggleTheme"
    >
      Toggle Theme
    </var-button>
  </var-style-provider>
</template>
```

### Function Call

A functional call is to update variables directly on `:root`, which is suitable for situations where a global update style is required.

```html
<script setup>
import { StyleProvider } from '@varlet/ui'

let rootStyleVars = null

const darkTheme = {
  '--color-primary': 'var(--color-info)'
}

function toggleRootTheme() {
  rootStyleVars = rootStyleVars ? null : darkTheme
  StyleProvider(rootStyleVars)
}
</script>

<template>
  <var-button type="primary" block @click="toggleRootTheme">Toggle Root Theme</var-button>
</template>
```

## API

### Props

| Prop         | Description   | Type                     | Default | 
|--------------|---------------|--------------------------|---------| 
| `style-vars` | CSS variables | _Record<string, string>_ | `{}`    |
| `tag`        | Tag name      | _string_                 | `div`   |

### Slots

| Name | Description | SlotProps |
| --- | --- | --- |
| `default` | Component content | `-` |

### Style Variables

The following is a style variable universal in the module library. Please check the style variable table at the bottom of each component document with unique style variables in each component.

| Variable | Default |
| --- | --- |
| `--font-size-xs` | `10px` |
| `--font-size-sm` | `12px` |
| `--font-size-md` | `14px` |
| `--font-size-lg` | `16px` |
| `--icon-size-xs` | `16px` |
| `--icon-size-sm` | `18px` |
| `--icon-size-md` | `20px` |
| `--icon-size-lg` | `22px` |
| `--color-body` | `#fff` |
| `--color-text` | `#333` |
| `--color-primary` | `#3a7afe` |
| `--color-info` | `#00afef` |
| `--color-success` | `#00c48f` |
| `--color-warning` | `#ff9f00` |
| `--color-danger` | `#f44336` |
| `--color-disabled` | `#e0e0e0` |
| `--color-text-disabled` | `#aaa` |
| `--color-on-primary` | `#fff` |
| `--color-on-info` | `#fff` |
| `--color-on-success` | `#fff` |
| `--color-on-warning` | `#fff` |
| `--color-on-danger` | `#fff` |
| `--color-primary-container` | `#3a7afe` |
| `--color-info-container` | `#00afef` |
| `--color-success-container` | `#00c48f` |
| `--color-warning-container` | `#ff9f00` |
| `--color-danger-container` | `#f44336` |
| `--color-on-primary-container` | `#fff` |
| `--color-on-info-container` | `#fff` |
| `--color-on-success-container` | `#fff` |
| `--color-on-warning-container` | `#fff` |
| `--color-on-danger-container` | `#fff` |
| `--color-surface-container` | `#fff` |
| `--color-surface-container-low` | `#fff` |
| `--color-surface-container-high` | `#fff` |
| `--color-surface-container-highest` | `#fff` |
| `--color-inverse-surface` | `#333` |
| `--color-outline` | `rgba(0, 0, 0, 0.12)` |
| `--color-on-surface-variant` | `#888` |
| `--opacity-disabled` | `0.6` |
| `--opacity-hover` | `0.15` |
| `--opacity-focus` | `0.2` |
| `--cubic-bezier` | `cubic-bezier(0.25, 0.8, 0.5, 1)` |
| `--shadow-key-umbra-opacity` | `rgba(0, 0, 0, 0.2)` |
| `--shadow-key-penumbra-opacity` | `rgba(0, 0, 0, 0.14)` |
| `--shadow-key-ambient-opacity` | `rgba(0, 0, 0, 0.12)` |