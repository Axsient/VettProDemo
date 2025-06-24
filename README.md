# VETTPRO Dashboard

This is a modern, responsive dashboard application built with Next.js, TypeScript, and Tailwind CSS. It features a dual-theme system (light and dark), custom data visualizations, and a unique, curved sidebar layout.

## Features

- **Next.js 14 App Router**: Utilizes the latest features of Next.js for routing and server components.
- **TypeScript**: Ensures type safety and improves developer experience.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Dual-Theme System**: A beautiful, animated theme switcher for light and dark modes.
- **Custom Visual Effects**: Includes custom-built glassmorphism and luminous glow effects for a modern aesthetic.
- **Data Visualization**: Uses `recharts` for data visualization, wrapped in custom components.
- **Linting and Formatting**: Pre-configured with ESLint and Prettier, enforced by Husky pre-commit hooks.
- **Component-Based Architecture**: Built with reusable components from `shadcn/ui`.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm

### Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The page will auto-update as you edit the files.

## Tech Stack Overview

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Charting**: [Recharts](https://recharts.org/)
- **Linting**: [ESLint](https://eslint.org/)
- **Formatting**: [Prettier](https://prettier.io/)
- **Git Hooks**: [Husky](https://typicode.github.io/husky/)

## Project Structure

The project follows a standard Next.js App Router structure:

-   `src/app/`: Contains all the routes and pages.
-   `src/components/`: Contains all the reusable React components.
-   `src/lib/`: Contains utility functions and library configurations.
-   `src/styles/`: Contains global styles and custom CSS.
-   `public/`: Contains static assets like images and fonts.

## Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).
