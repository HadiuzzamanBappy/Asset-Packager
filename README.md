# Vendor Asset Bundler

A build system for combining and optimizing JavaScript and CSS assets.

## Project Structure
```
project-root/
├── config/              # Configuration files
├── dist/                # Build output (ignored in git)
├── node_modules/        # Dependencies (ignored in git)
├── scripts/             # Build scripts
├── src/                 # Source files
│   ├── css/             # CSS source files
│   └── js/              # JavaScript source files
├── .gitignore           # Git ignore rules
├── package.json         # Project configuration
└── README.md            # This file
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development Build
```bash
npm run build:dev
```

### Production Build
```bash
npm run build
```

### Clean Build Directory
```bash
npm run clean
```

## Features

- Combines multiple JS files into `vendor.js`
- Combines multiple CSS files into `vendor.css`
- Generates minified versions for production
- Automatic dependency sorting (jQuery first)

## Requirements

- Node.js 16+
- npm 8+

---

### Key Notes

1. The `.gitignore` will prevent committing:
   - `node_modules/` (dependencies)
   - `dist/` (build output)
   - Various editor and OS-specific files

2. The `README.md` includes:
   - Project structure overview
   - Installation instructions
   - Usage commands
   - Key features
   - Requirements

3. Place both js and css files in the project root/src/{ css/js } directory.
