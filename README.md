# My Financial Journey

A comprehensive financial education platform built with Next.js. This application helps users learn about budgeting, expense tracking, and savings planning through interactive tools and educational content.

## Features

- 📊 **Budget Planner**: Create and manage monthly budgets with income sources and expense categories
- 💰 **Expense Tracker**: Track daily expenses and analyze spending patterns
- 🎯 **Savings Calculator**: Calculate savings goals and track progress
- 📚 **Financial Education**: Learn essential financial terms and concepts
- 📈 **Progress Tracking**: Monitor your financial learning journey
- 🎨 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd financial-journey
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This application is configured for static export and can be deployed to any static hosting service:

### Build for Production

\`\`\`bash
npm run build
\`\`\`

This creates an optimized static build in the `out` directory.

### Deploy to Vercel

The easiest way to deploy is using Vercel:

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

### Deploy to Other Platforms

The static files in the `out` directory can be deployed to:
- Netlify
- GitHub Pages
- AWS S3
- Any static hosting service

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── budget-planner/     # Budget planning page
│   ├── expense-tracker/    # Expense tracking page
│   ├── savings-calculator/ # Savings calculator page
│   ├── financial-terms/    # Financial education page
│   ├── faq/               # FAQ page
│   ├── progress/          # Progress tracking page
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
├── public/               # Static assets
└── styles/              # Global styles
\`\`\`

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Recharts** - Charts and data visualization

## Features Overview

### Budget Planner
- Add multiple income sources
- Create budget categories with color coding
- Track planned vs actual spending
- Visual budget breakdown with charts

### Expense Tracker
- Log daily expenses with categories
- View spending patterns and summaries
- Category-wise expense analysis
- Recent transactions history

### Savings Calculator
- Calculate time to reach savings goals
- Create and track multiple savings goals
- Progress visualization
- Goal achievement celebrations

### Educational Content
- Comprehensive financial terms glossary
- Step-by-step learning path
- Progress tracking and achievements
- FAQ section for common questions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you have any questions or need help, please open an issue in the repository.
\`\`\`

Create a deployment-ready vercel.json:
