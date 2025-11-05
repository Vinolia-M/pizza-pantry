Pizza Pantry - Inventory Management System

- A modern, full-stack inventory management application built for pizza shops using Next.js 15, MongoDB, and Clerk authentication.

## Features

   - User Authentication - Secure sign-up/sign-in with Clerk
   - Inventory Management - Full CRUD operations for inventory items
   - Stock Adjustments - Add/Remove stock with real-time updates
   - Category Organization - Organize items (Dough, Sauce, Cheese, Toppings, etc.)
   - Search & Filter - Search by name and filter by category
   - Low Stock Alerts - Visual indicators for items below reorder threshold
   - Audit Trail - Complete history of all inventory changes with user tracking
   - User Isolation - Each user's inventory is private and secure
   - Responsive Design - Works seamlessly on desktop, tablet, and mobile
   - Animations - Smooth GSAP animations for enhanced UX

## Tech Stack used

   - Framework: Next.js 15 (App Router) with TypeScript
   - Database: MongoDB with Mongoose ODM
   - Authentication: Clerk
   - Styling: Tailwind CSS
   - Animations: GSAP
   - Validation: Zod (server-side and client-side)
   - Icons: Lucide React

## Getting Started

## Installation

1. Clone the repository:
   - git clone https://github.com/Vinolia-M/pizza-pantry.git
   - cd pizza-pantry

2. Install dependencies
   - npm install

3. Set up environment variables
   - Create a .env.local file in the root directory (see .env.example):

4. Configure Clerk
5. Set up MongoDB

6. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```


## Development Approach

This project was developed primarily through official documentation, with AI assistance used for specific technical questions and debugging.

## References

   - Next.js 15 Documentation (https://nextjs.org/docs) - App Router, Route Handlers, Server Components
   - Clerk Documentation (https://clerk.com/docs) - Authentication setup and Next.js integration
   - MongoDB Documentation (https://www.mongodb.com/docs/) & Mongoose Docs (https://mongoosejs.com/docs/)
   - Tailwind CSS Documentation (https://tailwindcss.com/docs/installation/using-vite)
   - TypeScript Handbook (https://www.typescriptlang.org/docs/)
   - Zod Documentation (https://zod.dev/)
   - GSAP Documentation (https://gsap.com/docs/v3/)

## AI Usage Summary

1. Debugging Next.js 15 breaking changes
   - Fixed "params is a Promise" error in route handlers
   - prompt: "Getting error 'params.id must be awaited' in Next.js 15 dynamic routes"

2. Mongoose enum validation troubleshooting
   - Resolved AuditLog action enum validation errors
   - prompt: "Mongoose validation error: 'stock_add' is not a valid enum value"

3. Zod syntax clarification
   - Fixed TypeScript error with Zod v3 enum error messages
   - Changed from errorMap to message property

4. GSAP animation patterns
   - Asked for modal entrance/exit animation examples
   - prompt: "GSAP animation for React modal with scale and fade"

5. Clerk middleware configuration
   - Resolved catch-all route configuration issue

## Link to AI chat
   - https://claude.ai/chat/65a19aa5-33a4-49e2-8ebb-e8056c40707b