# Components Directory

This directory contains all React components used in the PZNGR web application.

## Structure

```
src/components/
├── Header/
│   ├── Header.js          # Main Header component logic
│   ├── styles.js          # Styled-components for Header
│   └── index.js           # Export file for clean imports
└── README.md              # This documentation file
```

## Component Organization

### Header Component

- **Location**: `src/components/Header/`
- **Main File**: `Header.js` - Contains component logic and JSX
- **Styles File**: `styles.js` - Contains all styled-components
- **Export File**: `index.js` - Enables clean imports

### Usage

```javascript
// Import component
import Header from "../components/Header";

// Use in parent component
<Header />;
```

## Styling Approach

### Styled-Components

- Each component has its own `styles.js` file
- Styled components are exported and imported into the main component
- Separation of concerns: logic vs styling

### Benefits

- **Clean Code**: Logic and styling are separated
- **Maintainability**: Easy to find and modify styles
- **Reusability**: Styled components can be reused
- **Organization**: Clear folder structure

## Adding New Components

1. Create a new folder: `src/components/ComponentName/`
2. Create the main component file: `ComponentName.js`
3. Create the styles file: `styles.js`
4. Create the export file: `index.js`
5. Import and use in your app

### Example Structure

```
ComponentName/
├── ComponentName.js       # Component logic
├── styles.js             # Styled components
└── index.js              # Export file
```
