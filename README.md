# SunEdge Power

A clean, professional website for SunEdge Power - Florida's premier commercial and industrial solar installation partner.

## Tech Stack

- **Frontend:** Vite + React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Deploy:** Vercel or any static host

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The site will open at http://localhost:5173

## Project Structure

```
sunedge-power/
├── src/
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Tailwind styles
├── public/               # Static assets
├── index.html            # HTML template
└── package.json
```

## Development

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## Deployment

Build and deploy the `dist` folder to any static hosting:

```bash
npm run build
# Deploy the 'dist' folder
```

### Vercel (recommended)
```bash
vercel --prod
```

## License

MIT

## About

SunEdge Power LLC
Licensed, Bonded & Insured
Class A General Contractor
Florida's Premier C&I Solar Installation Partner
