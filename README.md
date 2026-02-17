<<<<<<< HEAD
# Smart Bookmark App

A modern, feature-rich bookmark management application built with Next.js 15, Supabase, and Framer Motion. Save, organize, and access your favorite websites with real-time synchronization and beautiful animations.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E)

## Features

### Authentication
- **Google OAuth** integration via Supabase
- Secure session management
- Protected routes with automatic redirect

### Bookmark Management
- **Add bookmarks** with title, URL, and category
- **Delete bookmarks** with one click
- **Instant Search** to find bookmarks by title or URL
- **Category Filtering** to organize and view specific groups
- **Real-time updates** across all devices
- **Row-level security** ensures data privacy

### Modern UI/UX
- **Beautiful gradient designs** with indigo and purple themes
- **Split-layout login page** with feature showcase
- **Responsive design** works on all screen sizes
- **Premium card designs** with shadows and hover effects

### Smooth Animations
- **Framer Motion** powered animations
- **Page transitions** with fade and slide effects
- **Staggered entrance** animations
- **Floating icons** and pulsing backgrounds
- **Interactive hover** effects throughout

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ and npm installed
- A **Supabase account** ([Sign up here](https://supabase.com))
- **Google OAuth credentials** (configured in Supabase)

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd smart-bookmark-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project in [Supabase](https://supabase.com)
2. Go to **Authentication** → **Providers** → Enable **Google**
3. Configure Google OAuth:
   - Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com)
   - Add authorized redirect URI: `https://<your-project>.supabase.co/auth/v1/callback`
   - Add Client ID and Secret to Supabase

### 4. Create Database Tables

Run the following SQL in Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create bookmarks table
CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can only view their own bookmarks"
    ON bookmarks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks"
    ON bookmarks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
    ON bookmarks FOR DELETE
    USING (auth.uid() = user_id);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
```

### 5. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> **Note**: Get these values from Supabase Dashboard → Settings → API

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
smart-bookmark-app/
├── app/
│   ├── actions.ts              # Server actions for bookmarks
│   ├── auth/
│   │   ├── actions.ts          # Auth server actions
│   │   └── callback/
│   │       └── route.ts        # OAuth callback handler
│   ├── login/
│   │   └── page.tsx            # Login page with animations
│   ├── page.tsx                # Main dashboard (Client Component)
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles + custom animations
├── components/
│   ├── add-bookmark-form.tsx   # Form to add bookmarks
│   └── realtime-bookmarks.tsx  # Real-time bookmark list
├── utils/
│   └── supabase/
│       ├── client.ts           # Client-side Supabase
│       ├── server.ts           # Server-side Supabase
│       └── middleware.ts       # Session management
├── middleware.ts               # Next.js middleware
└── supabase/
    └── schema.sql              # Database schema
```

## Key Features Explained

### Real-time Synchronization
Bookmarks update instantly across all your devices using Supabase Realtime subscriptions.

### Row-Level Security
Your bookmarks are private and only accessible to you. Database policies ensure users can only access their own data.

### Framer Motion Animations
- **Login page**: Floating icons, pulsing backgrounds, slide-in effects
- **Dashboard**: Staggered entrance, navbar slide-down, card scale-up
- **Page transitions**: Smooth fade and slide when navigating

### Split Layout Login
- **Left side**: Feature showcase with animated highlights
- **Right side**: Google sign-in form
- **Mobile responsive**: Adapts to smaller screens

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Troubleshooting

### Authentication Issues

**Problem**: "Unsupported provider" error  
**Solution**: 
- Ensure Google provider is enabled in Supabase
- Verify OAuth redirect URI matches Supabase project URL
- Check that Client ID and Secret are correct

**Problem**: Session not persisting  
**Solution**: 
- Clear browser cookies and localStorage
- Verify middleware is configured correctly

### Build Issues

**Problem**: "next/headers" error in Client Component  
**Solution**: 
- Use `@/utils/supabase/client` in Client Components
- Use `@/utils/supabase/server` only in Server Components

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Update Supabase redirect URLs:
   - Add: `https://your-app.vercel.app/auth/callback`
   - Update Google OAuth redirect URIs

## Customization

### Colors
Edit `tailwind.config.ts` to change the color scheme. Current theme uses indigo and purple gradients.

### Animations
Modify animation variants in components or add new ones in `globals.css`.

### Layout
Adjust the split-layout ratio in `app/login/page.tsx` by changing the `lg:w-1/2` classes.

## License

MIT License - feel free to use this project for learning or personal use.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with love using Next.js and Supabase**
=======
# bookmark
>>>>>>> eda24dbd079b786e71af5d7283d46a35bf425d35
