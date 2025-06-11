# My Financial Journey

A comprehensive financial education platform built with Next.js that helps users learn about budgeting, expense tracking, and savings planning.

## Features

- **Budget Planner**: Create and manage monthly budgets with income sources and expense categories
- **Expense Tracker**: Log and categorize daily expenses with detailed analytics
- **Savings Calculator**: Calculate savings goals and track progress over time
- **Financial Education**: Learn essential financial concepts and terminology
- **Progress Tracking**: Monitor your financial learning journey with achievements
- **Budget Templates**: Quick-start templates for different life situations

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 18.18.0 or later
- npm or yarn

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

## Building for Production

### Static Export

To build a static version of the app:

\`\`\`bash
npm run build
\`\`\`

This creates an optimized production build that can be deployed to any static hosting service.

### Deployment Options

- **Vercel**: `vercel` (one-command deployment)
- **Netlify**: Drag and drop the `out` folder
- **GitHub Pages**: Upload the `out` folder contents
- **AWS S3**: Upload the `out` folder contents

## Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
├── components/            # Reusable React components
├── lib/                   # Utility functions and types
├── public/               # Static assets
└── styles/               # Global styles
\`\`\`

## Features Overview

### Budget Planner
- Add multiple income sources
- Create budget categories with color coding
- Track planned vs actual spending
- Visual charts and comparisons
- Pre-built budget templates

### Expense Tracker
- Quick expense entry with categories
- Daily, weekly, and monthly summaries
- Category-wise spending analysis
- Visual spending patterns

### Savings Calculator
- Calculate time to reach savings goals
- Track multiple savings goals
- Progress visualization
- Monthly contribution planning

### Educational Content
- Financial terminology glossary
- Budget planning guides
- Savings strategies
- Progress milestones and achievements

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
