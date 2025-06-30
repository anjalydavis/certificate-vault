# CredHex - Certificate Vault

A modern, secure certificate management application built with React, TypeScript, and Supabase.

## Features

- 🔐 **Secure Authentication** - Email/password authentication with Supabase
- 📁 **Certificate Management** - Upload, view, edit, and delete certificates
- 🎨 **Beautiful UI** - Modern glass-morphism design with dark/light themes
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🔍 **Search & Filter** - Find certificates quickly with search functionality
- 📊 **Dashboard** - Overview of your certificates with statistics
- 🌙 **Theme Toggle** - Switch between light and dark modes
- ✨ **Animations** - Smooth transitions and background animations

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd credhex
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Create a `.env` file based on `.env.example`
   - Add your Supabase credentials

4. **Run the development server**
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

The application uses the following database structure:

- **certificates** table with user authentication and file storage
- **Row Level Security (RLS)** policies for data protection
- **Storage bucket** for certificate files

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Notifications**: React Hot Toast
- **Build Tool**: Vite

## License

MIT License