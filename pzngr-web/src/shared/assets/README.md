# Images Directory

This directory contains all image assets used in the PZNGR web application.

## Structure

```
src/assets/images/
├── Logo_01.jpg          # Main logo image
├── index.js             # Image exports for easy importing
└── README.md           # This documentation file
```

## Usage

### Importing Images

```javascript
// Import specific image
import { Logo01 } from "../assets/images";

// Use in component
<img src={Logo01} alt="PZNGR Logo" />;
```

### Adding New Images

1. Place your image file in this directory
2. Add the export to `index.js`:
   ```javascript
   export { default as ImageName } from "./ImageName.jpg";
   ```
3. Import and use in your component

## Image Guidelines

### Logo Images

- **Format**: JPG or PNG with transparent background preferred
- **Size**: 198x51px (or similar aspect ratio)
- **Quality**: High resolution for crisp display

### General Guidelines

- Use descriptive filenames
- Optimize images for web (compress when possible)
- Include alt text for accessibility
- Consider responsive sizes for different screen sizes

## File Naming Convention

- Use PascalCase for component images: `Logo_01.jpg`
- Use descriptive names: `hero-banner.jpg`, `product-thumbnail.jpg`
- Include version numbers if needed: `logo-v2.jpg`
