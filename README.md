# Niryaat Saathi - Import-Export Intelligence Platform

A production-grade full-stack web platform designed for Indian Exporters, Importers, and Admins. Built with finance-grade UI inspired by Angel One, providing comprehensive market intelligence, trade data, and government scheme information.

## Features

### For Exporters
- **Market Intelligence**: Product trends, export growth charts, top importing countries
- **Country Relations**: Trade agreements, tariff information, bilateral trade data
- **Government Benefits**: RoDTEP, MAI, EPCG and other export promotion schemes
- **Importer Ratings**: Search and rate importers based on payment reliability and compliance
- **Service Marketplace**: Find CHA, logistics, insurance, and export finance providers

### For Importers
- **Profile Management**: Maintain company profile with IEC code verification
- **Ratings & Reviews**: View ratings and feedback from exporters
- **Trade Information**: Access tariff and compliance information

### For Admins
- **User Approval**: Approve/reject new user registrations
- **Content Management**: Manage schemes, news, and trade data
- **Platform Analytics**: Monitor user activity and platform usage

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and builds
- Tailwind CSS for styling
- React Router for navigation
- Recharts for data visualization
- Lucide React for icons
- Dark/Light mode support

### Backend & Database
- Supabase (PostgreSQL database)
- Supabase Auth for user authentication
- Row Level Security (RLS) for data protection
- Real-time subscriptions

### Authentication
- Email/Password with custom registration fields
- JWT-based session management
- Role-based access control (Exporter/Importer/Admin)
- Approval workflow for new users

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account

### Environment Setup

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Fill in your Supabase credentials in `.env`:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. The database schema is already set up with migrations. Sample data has been populated automatically.

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## User Registration

New users must provide:
- Full Name
- Email & Password
- Role (Exporter/Importer)
- Company Name
- IEC Code (10 digit alphanumeric)
- Country
- Phone Number
- Business Type (MSME/Startup/Enterprise)
- Product HS Codes (optional, can add multiple)

**Note**: All new registrations require admin approval before access is granted.

## Database Schema

### Core Tables
- `profiles` - User profiles with business information
- `user_hs_codes` - User's product HS codes
- `products` - Master product catalog with trending status
- `trade_statistics` - Historical trade data by country and year
- `country_relations` - Trade agreements and bilateral relations
- `tariffs` - Tariff rates and required certifications
- `government_schemes` - Export promotion schemes
- `news_feed` - Trade news and policy updates
- `importer_ratings` - Rating system for importers
- `service_providers` - CHA, logistics, insurance services
- `notifications` - User notifications

### Security
All tables have Row Level Security (RLS) enabled with policies for:
- Authenticated user access
- Role-based permissions
- Owner-only updates
- Admin privileges

## Module Overview

### 1. Dashboard
Personalized overview with:
- Export growth trends
- Top importing countries
- Latest trade news
- Eligible government schemes
- Policy notifications

### 2. Market Intel
Product explorer featuring:
- HS code search
- Trending status indicators
- Export growth charts
- Top 5 importing countries
- Market size and margin estimates

### 3. Country Relations
Trade information including:
- Country-wise trade agreements
- FTA status
- Trade balance charts
- Tariff finder by HS code
- Required certifications and documents

### 4. Government Benefits
Scheme finder with:
- Filter by HS code, country, business type
- RoDTEP, MAI, EPCG, and other schemes
- Eligibility checker
- Trade news and DGFT notifications
- Official links to scheme details

### 5. Profile & Services
User management featuring:
- Company profile with IEC verification
- Product HS codes management
- Importer rating system (for exporters)
- Rating history (for importers)
- Service provider marketplace

## Design Philosophy

### UI/UX Guidelines
- Finance-grade professional interface
- Clean card-based layouts
- Deep blue primary color with subtle accents
- No flashy gradients or purple hues
- Data-dense but readable
- Smooth animations and transitions
- Loading skeletons for better UX
- Responsive design (mobile to desktop)

### Color Scheme
- Primary: Deep Blue (#2563eb)
- Accent: Saffron/Gold for highlights
- Background: Slate tones
- Dark mode support with proper contrast

## Deployment

### Frontend (Vercel)
```bash
# Build the project
npm run build

# Deploy to Vercel
vercel --prod
```

### Database (Supabase)
Database is already deployed on Supabase with:
- PostgreSQL with proper indexes
- Row Level Security enabled
- Automatic backups
- Connection pooling

## API Integration

The platform is designed to integrate with:
- **UN Comtrade API** - Trade statistics (requires API key)
- **World Bank Open Data** - Country indicators
- **NewsAPI/GNews** - Trade news (requires API key)
- **DGFT Notifications** - Policy updates (RSS/scraping)

Add API keys to `.env`:
```
VITE_UN_COMTRADE_API_KEY=your_key
VITE_NEWS_API_KEY=your_key
```

## Sample Data

The database comes pre-populated with:
- 10 sample products (Coffee, Tea, Cotton, Jewelry, etc.)
- 20 countries with trade relations
- Trade statistics for multiple years
- 4 major government schemes
- 5 news articles
- 4 service providers

## Admin Setup

To create an admin user:
1. Register normally through the app
2. Use Supabase dashboard to:
   - Set `is_approved = true` in profiles table
   - Change `role` to 'admin'
   - Admin can then approve other users

## Production Checklist

- [x] Database schema with RLS
- [x] Authentication with JWT
- [x] Role-based access control
- [x] Protected routes
- [x] Error handling
- [x] Loading states
- [x] Sample data
- [x] Production build tested
- [x] Environment variables documented
- [x] Responsive design
- [x] Dark/Light mode

## Support & Documentation

For issues or questions:
- Check Supabase logs for database errors
- Review browser console for frontend errors
- Ensure environment variables are set correctly
- Verify user approval status for login issues

## License

Proprietary - All rights reserved

## Credits

Built with modern web technologies for Indian import-export community.
Inspired by Angel One's finance-grade interface design.
