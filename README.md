# 🛒 Modern E-commerce Platform

A full-featured e-commerce application built with Next.js 15, featuring both a public storefront and an admin dashboard. This project demonstrates modern web development practices with TypeScript, state management, authentication, and a beautiful UI.

## 🎯 What This Product Is About

This is a complete e-commerce solution that includes:

- **🛍️ Public Storefront**: A modern shopping experience with product browsing, search, filtering, and shopping cart
- **📊 Admin Dashboard**: A comprehensive management system for products, users, and orders
- **🔐 Authentication**: Secure login/signup with demo Google OAuth integration
- **💳 Shopping Cart**: Persistent cart with checkout flow simulation
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

The application simulates a real e-commerce platform using the [Fake Store API](https://fakestoreapi.com/) for product data and implements mock authentication and checkout processes.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Modern web browser

### Installation & Running

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd <project-folder>
   bun install
   ```

2. **Run the development server:**
```bash
   bun run dev
   ```

3. **Open your browser:**
   - Visit `http://localhost:3000` to see the storefront
   - Visit `http://localhost:3000/dashboard` for the admin panel

### Demo Credentials
- **Regular Login**: Any email/password (minimum 6 characters)
- **Google Login**: Click the Google button for instant demo access

## 🏗️ Project Architecture

### Core Technologies & Libraries

#### **Frontend Framework**
- **Next.js 15** (`next`): React framework with App Router, server components, and optimizations
- **React 19** (`react`, `react-dom`): Modern React with concurrent features and hooks
- **TypeScript 5** (`typescript`): Type safety and developer experience

#### **UI & Styling**
- **Tailwind CSS 4** (`tailwindcss`): Utility-first CSS framework for rapid styling
- **Radix UI** (`@radix-ui/*`): Headless, accessible UI components:
  - `react-dialog`: Modal dialogs and overlays
  - `react-dropdown-menu`: Accessible dropdown menus
  - `react-select`: Customizable select components
  - `react-tabs`: Tab navigation components
  - `react-tooltip`: Informative tooltips
- **Lucide React** (`lucide-react`): Beautiful, customizable SVG icons
- **Class Variance Authority** (`class-variance-authority`): Component variant management
- **Tailwind Merge** (`tailwind-merge`): Intelligent CSS class merging
- **Next Themes** (`next-themes`): Dark/light theme switching

#### **State Management**
- **Zustand** (`zustand`): Lightweight, flexible state management with persistence
- **React Hook Form** (`react-hook-form`): Performant forms with minimal re-renders
- **Zod** (`zod`): TypeScript-first schema validation

#### **HTTP & API**
- **Axios** (`axios`): Promise-based HTTP client for API requests

#### **User Experience**
- **Sonner** (`sonner`): Beautiful toast notifications
- **Hookform Resolvers** (`@hookform/resolvers`): Zod integration for forms

#### **Development Tools**
- **ESLint** (`eslint`): Code linting and quality enforcement
- **PostCSS** (`@tailwindcss/postcss`): CSS processing
- **tw-animate-css** (`tw-animate-css`): Additional Tailwind animations

## 📁 File Structure Explained

### **Root Configuration**
- `package.json` - Project dependencies and scripts
- `next.config.ts` - Next.js configuration (includes image domains for external APIs)
- `tsconfig.json` - TypeScript configuration
- `postcss.config.mjs` - PostCSS configuration for Tailwind
- `eslint.config.mjs` - ESLint linting rules
- `components.json` - shadcn/ui component configuration
- `bun.lock` - Dependency lock file for Bun package manager

### **App Directory (Next.js App Router)**

#### **Main Pages**
- `app/page.tsx` - **Homepage/Storefront**: Hero section, featured products, categories
- `app/layout.tsx` - **Root Layout**: Global layout with theme provider and toast notifications
- `app/globals.css` - Global styles and Tailwind directives

#### **Authentication Pages**
- `app/login/page.tsx` - **Login Page**: User authentication with email/password and Google OAuth
- `app/signup/page.tsx` - **Registration Page**: User account creation with form validation

#### **Public Shopping Pages**
- `app/products/page.tsx` - **Product Catalog**: Searchable, filterable product listing with pagination
- `app/product/[id]/page.tsx` - **Product Details**: Individual product view with full information and add-to-cart

#### **Admin Dashboard**
- `app/dashboard/layout.tsx` - **Dashboard Layout**: Protected layout with authentication guard
- `app/dashboard/page.tsx` - **Dashboard Home**: Admin overview and statistics
- `app/dashboard/products/page.tsx` - **Product Management**: CRUD operations for products
- `app/dashboard/users/page.tsx` - **User Management**: View and manage user accounts
- `app/dashboard/products/[id]/page.tsx` - **Product Details Admin**: Detailed product view for admins

### **Components Directory**

#### **Layout Components**
- `public-layout.tsx` - **Storefront Layout**: Header, navigation, footer for public pages
- `app-sidebar.tsx` - **Admin Sidebar**: Navigation sidebar for dashboard with user menu
- `dashboard-auth-guard.tsx` - **Authentication Guard**: Protects dashboard routes from unauthorized access

#### **Feature Components**
- `floating-cart.tsx` - **Floating Cart Button**: Persistent shopping cart access button
- `cart-modal.tsx` - **Shopping Cart**: Side panel with cart items and checkout flow
- `add-product-modal.tsx` - **Product Creation**: Modal for adding new products with validation
- `products-table.tsx` - **Product Table**: Data table for product management with actions
- `users-table.tsx` - **User Table**: Data table for user management
- `products-search.tsx` - **Product Search**: Search and filter component for products
- `users-search.tsx` - **User Search**: Search component for user management

#### **Form Components**
- `login-form.tsx` - **Login Form**: Authentication form with validation
- `signup-form.tsx` - **Registration Form**: User creation form with validation
- `search-form.tsx` - **Search Component**: Reusable search input component

#### **UI Components (shadcn/ui)**
All located in `components/ui/` - Pre-built, accessible components:
- `button.tsx`, `input.tsx`, `label.tsx` - Basic form elements
- `card.tsx`, `dialog.tsx`, `sheet.tsx` - Container components
- `table.tsx`, `pagination.tsx` - Data display components
- `dropdown-menu.tsx`, `select.tsx`, `tabs.tsx` - Navigation components
- `badge.tsx`, `skeleton.tsx`, `tooltip.tsx` - Utility components
- `sidebar.tsx`, `separator.tsx`, `breadcrumb.tsx` - Layout components
- `sonner.tsx`, `textarea.tsx` - Specialized components

#### **Utility Components**
- `theme-provider.tsx` - **Theme Management**: Dark/light mode provider
- `version-switcher.tsx` - **Version Selector**: Component version switcher
- `table-skeleton.tsx` - **Loading State**: Skeleton loader for tables

### **Library Directory (`lib/`)**

#### **State Management Stores**
- `auth-store.ts` - **Authentication State**: User login, logout, session management with Zustand
- `products-store.ts` - **Product State**: Product CRUD operations, filtering, pagination
- `cart-store.ts` - **Shopping Cart State**: Cart items, quantities, checkout with localStorage persistence
- `users-store.ts` - **User Management State**: User CRUD operations for admin

#### **API & Data**
- `mock-api.ts` - **API Layer**: Mock API functions that simulate real backend calls using Fake Store API
- `axios.ts` - **HTTP Client**: Configured Axios instance for API requests
- `schemas.ts` - **Validation Schemas**: Zod schemas for form validation and type safety

#### **Utilities**
- `utils.ts` - **Helper Functions**: Utility functions including class name merging

### **Hooks Directory**
- `hooks/use-mobile.ts` - **Mobile Detection**: Hook for responsive design behavior

### **Public Assets**
- `public/` - Static assets including SVG icons and images

## 🔧 Key Features Explained

### **🛍️ Shopping Experience**
- **Product Browsing**: Grid view with search, category filters, and price ranges
- **Product Details**: Comprehensive product pages with images, descriptions, and ratings
- **Shopping Cart**: Add/remove items, quantity management, persistent storage
- **Checkout Flow**: Multi-step checkout with customer and payment forms (simulated)

### **📊 Admin Dashboard**
- **Product Management**: Add, edit, delete products with form validation
- **User Management**: View user accounts and details
- **Protected Routes**: Authentication required for admin access
- **Responsive Design**: Works on all device sizes

### **🔐 Authentication System**
- **Multiple Login Methods**: Email/password and Google OAuth (demo)
- **Session Management**: Persistent sessions with localStorage
- **Route Protection**: Automatic redirects for protected pages
- **User Profiles**: User information management

### **🎨 Modern UI/UX**
- **Dark/Light Themes**: System-aware theme switching
- **Responsive Design**: Mobile-first approach
- **Loading States**: Skeleton loaders and loading indicators
- **Toast Notifications**: User feedback for all actions
- **Accessibility**: ARIA-compliant components from Radix UI

### **⚡ Performance Features**
- **Server Components**: Next.js 15 App Router optimizations
- **Image Optimization**: Next.js Image component with external domain support
- **Code Splitting**: Automatic bundle splitting for faster loads
- **Optimistic Updates**: Immediate UI feedback with error rollback

## 🎯 Technical Highlights

### **State Management Strategy**
- **Zustand**: Lightweight, no boilerplate state management
- **Persistence**: Automatic cart persistence with localStorage
- **Optimistic Updates**: Immediate UI feedback with rollback on errors

### **Form Handling**
- **React Hook Form**: High-performance forms with minimal re-renders
- **Zod Validation**: Type-safe schema validation
- **Error Handling**: Comprehensive error states and user feedback

### **API Integration**
- **Mock API Layer**: Realistic API simulation with delays and error handling
- **External API**: Integration with Fake Store API for product data
- **Error Boundaries**: Graceful error handling throughout the application

### **Developer Experience**
- **TypeScript**: Full type safety across the application
- **ESLint**: Code quality and consistency enforcement
- **Component Library**: Reusable, accessible UI components
- **Modern Tooling**: Next.js 15, React 19, and latest dependencies

## 🚦 Development Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality

## 🎨 Customization

The application is built with customization in mind:
- **Theme Colors**: Modify CSS variables in `globals.css`
- **Components**: Extend or modify shadcn/ui components
- **API**: Replace mock API with real backend endpoints
- **Authentication**: Integrate with real OAuth providers
- **Payment**: Connect to real payment processors

## 📝 Notes

- The application uses mock data and simulated API calls for demonstration
- All authentication is for demo purposes only
- Checkout process is simulated and doesn't process real payments
- External images are loaded from Fake Store API

This project serves as an excellent foundation for building production e-commerce applications with modern web technologies and best practices.