# Freezer Web - Inventory Management System

A modern Single Page Application (SPA) for managing freezer inventory built with React, TypeScript, Mantine UI, and Supabase.

## 🚀 Features

- **Authentication**: Secure user registration and login with Supabase Auth
- **Freezer Management**: Create, edit, and delete freezers
- **Shelf Organization**: Manage shelves within each freezer (default 7 shelves)
- **Product Tracking**: Add, edit, and track products with expiry dates
- **Smart Notifications**: Color-coded expiry warnings (green/yellow/red)
- **Localized Product Catalog**: Pre-populated catalog with 300+ products in 3 languages with emoji categories (read-only for all users)
- **Real-time Updates**: Live synchronization across devices
- **Multi-language Support**: English, Russian, and Italian
- **Responsive Design**: Works on desktop and mobile devices
- **CSV Export/Import**: Export inventory data for backup

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Library**: Mantine 7 (components, forms, notifications)
- **Styling**: TailwindCSS + Mantine styles
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Internationalization**: react-i18next
- **Date Handling**: date-fns
- **Code Quality**: ESLint + Prettier + Husky

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd freezer-web
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy `env.example` to `.env` and fill in your Supabase credentials:

```bash
cp env.example .env
```

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set up Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the schema script:

```sql
-- Copy and paste the contents of supabase/supabase.sql
```

4. Run the seed data script:

```sql
-- Copy and paste the contents of supabase/supabase_catalog_seed_localized.sql
-- This includes 300+ products with emojis and 3-language descriptions
```

5. (Optional) Run the admin functions script for catalog management:

```sql
-- Copy and paste the contents of supabase/admin_catalog_management.sql
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── FreezerCard.tsx     # Freezer display card
│   ├── FreezerDrawer.tsx   # Freezer details drawer
│   ├── FreezerForm.tsx     # Freezer create/edit form
│   ├── Navbar.tsx          # Main navigation
│   ├── ProductChip.tsx     # Product display chip
│   ├── ProductForm.tsx     # Product create/edit form
│   ├── ProtectedRoute.tsx  # Auth route wrapper
│   └── ShelfCard.tsx       # Shelf display card
├── i18n/               # Internationalization
│   ├── index.ts
│   └── locales/
│       ├── en/translation.json
│       ├── ru/translation.json
│       └── it/translation.json
├── pages/              # Page components
│   ├── Dashboard.tsx       # Main dashboard
│   ├── Login.tsx          # Login page
│   ├── ProductsList.tsx   # All products view
│   └── Register.tsx       # Registration page
├── store/              # State management
│   ├── authStore.ts       # Authentication state
│   └── freezerStore.ts    # Freezer/product state
├── supabase/           # Database client
│   └── supabaseClient.ts
├── types/              # TypeScript types
│   ├── freezer.ts
│   ├── product.ts
│   └── shelf.ts
├── utils/              # Utility functions
│   ├── date.ts           # Date formatting
│   └── i18nHelpers.ts    # i18n utilities
├── styles/
│   └── index.css         # Global styles
├── App.tsx             # Main app component
└── main.tsx            # App entry point
```

## 🗄 Database Schema

### Tables

- **freezers**: User's freezer units (private per user)
- **shelves**: Shelves within each freezer (default 7, private per user)
- **product_catalog**: Shared product database (read-only for all users)
- **products**: User's actual inventory items (private per user)

### Key Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Shared Catalog**: Common product database accessible to all users (read-only)
- **User Isolation**: Each user's freezers, shelves, and products are completely private
- **Automatic Triggers**: Default shelves created when freezer is added
- **Indexes**: Optimized for common queries
- **Real-time**: Live updates via Supabase subscriptions

## 🌍 Internationalization

The app supports 3 languages:

- English (en) - Default
- Russian (ru)
- Italian (it)

Language can be changed via the navbar language selector.

## 🎨 UI Components

Built with Mantine UI components:

- **Cards**: Freezer and shelf displays
- **Modals**: Product forms and confirmations
- **Drawers**: Freezer details and shelf management
- **Forms**: Input validation and error handling
- **Notifications**: Success/error messages
- **Grid**: Responsive layouts

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (768px), md (1024px), lg (1280px)
- Touch-friendly interface
- Optimized for mobile inventory management

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Git Hooks
npm run prepare      # Install husky hooks
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

### Other Platforms

The app is a standard Vite React app and can be deployed to:

- Netlify
- GitHub Pages
- AWS Amplify
- Any static hosting service

## 🔒 Security

- **Authentication**: Supabase Auth with email/password
- **Authorization**: Row Level Security (RLS) policies
- **Data Validation**: Client and server-side validation
- **HTTPS**: Required for production deployment
- **User Isolation**: Complete data separation between users
- **Shared Resources**: Read-only access to common catalog

## 📈 Scalability

- **Multi-tenant Architecture**: Each user has isolated data
- **Shared Catalog**: Common product database reduces storage overhead
- **Efficient Queries**: Optimized indexes for fast data retrieval
- **Real-time Updates**: Live synchronization without polling
- **Horizontal Scaling**: Supabase handles database scaling automatically

## 🔧 Administration

### Catalog Management

The product catalog is shared across all users and can be managed by administrators:

- **Add Products**: Use `add_product_to_catalog()` function
- **Update Products**: Use `update_product_in_catalog()` function
- **Remove Products**: Use `remove_product_from_catalog()` function
- **View Statistics**: Use `get_catalog_stats()` function
- **Usage Analytics**: Query `catalog_usage_stats` view

### Database Functions

```sql
-- Add a new product to the catalog
SELECT add_product_to_catalog('New Product', 'Category', 'kg', 'Description');

-- Update an existing product
SELECT update_product_in_catalog('product-uuid', 'Updated Name', 'New Category');

-- Get catalog statistics
SELECT * FROM get_catalog_stats();

-- View usage statistics
SELECT * FROM catalog_usage_stats ORDER BY usage_count DESC;
```

## 🐛 Troubleshooting

### Common Issues

1. **Supabase Connection Error**
   - Check your environment variables
   - Verify Supabase project is active
   - Ensure RLS policies are set up correctly

2. **Build Errors**
   - Run `npm run lint:fix` to fix code issues
   - Check TypeScript errors with `npm run build`

3. **Database Issues**
   - Verify all SQL scripts were run successfully
   - Check Supabase logs for errors

### Getting Help

- Check the [Mantine documentation](https://mantine.dev)
- Review [Supabase documentation](https://supabase.com/docs)
- Open an issue in the repository

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Barcode scanning
- [ ] Recipe suggestions based on inventory
- [ ] Shopping list generation
- [ ] Advanced analytics and reporting
- [ ] Multi-user household support
- [ ] API for third-party integrations

---

**Happy Freezer Management! 🧊**
