# 🚀 Deployment Guide

This guide covers deploying Freezer Web to various platforms.

## Prerequisites

- Node.js 18+
- Supabase account
- Git repository

## 1. Supabase Setup

### Create Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be ready

### Database Setup

1. Go to SQL Editor in your Supabase dashboard
2. Run the main schema:
   ```sql
   -- Copy contents of supabase/supabase.sql
   ```
3. Run the seed data:
   ```sql
   -- Copy contents of supabase/supabase_catalog_seed.sql
   ```
4. (Optional) Run admin functions:
   ```sql
   -- Copy contents of supabase/admin_catalog_management.sql
   ```

### Get API Keys

1. Go to Settings > API
2. Copy your Project URL and anon key

## 2. Environment Variables

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Vercel Deployment (Recommended)

### Automatic Deployment

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard
5. Deploy!

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

## 4. Netlify Deployment

### Automatic Deployment

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Connect your GitHub repository
4. Set build command: `npm run build`
5. Set publish directory: `dist`
6. Add environment variables in Site settings
7. Deploy!

### Manual Deployment

```bash
# Build the project
npm run build

# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

## 5. GitHub Pages Deployment

### Using GitHub Actions

1. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

2. Add secrets to your repository:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## 6. AWS Amplify Deployment

1. Go to [AWS Amplify](https://aws.amazon.com/amplify/)
2. Connect your GitHub repository
3. Set build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
   ```
4. Add environment variables
5. Deploy!

## 7. Docker Deployment

### Create Dockerfile

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Create nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

### Build and Run

```bash
# Build image
docker build -t freezer-web .

# Run container
docker run -p 80:80 freezer-web
```

## 8. Environment Variables for Production

Make sure to set these environment variables in your deployment platform:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

## 9. Post-Deployment Checklist

- [ ] Environment variables are set
- [ ] Database schema is deployed
- [ ] Seed data is loaded
- [ ] RLS policies are active
- [ ] App is accessible via HTTPS
- [ ] Authentication is working
- [ ] Real-time updates are working

## 10. Monitoring and Maintenance

### Supabase Dashboard

- Monitor database performance
- Check authentication logs
- Review RLS policy effectiveness

### Application Monitoring

- Set up error tracking (Sentry, LogRocket)
- Monitor performance metrics
- Track user analytics

### Database Maintenance

- Regular backups
- Monitor storage usage
- Optimize queries as needed

## 11. Troubleshooting

### Common Issues

**Build Failures**

- Check environment variables
- Verify Node.js version
- Run `npm run lint` locally

**Database Connection Issues**

- Verify Supabase URL and key
- Check RLS policies
- Ensure database is accessible

**Authentication Issues**

- Check Supabase Auth settings
- Verify redirect URLs
- Check CORS settings

**Real-time Issues**

- Verify Supabase realtime is enabled
- Check subscription permissions
- Monitor network connectivity

## 12. Scaling Considerations

### Database

- Monitor query performance
- Add indexes as needed
- Consider read replicas for high traffic

### Application

- Use CDN for static assets
- Implement caching strategies
- Monitor memory usage

### Supabase

- Upgrade plan as needed
- Monitor API usage
- Set up alerts for limits

---

**Happy Deploying! 🚀**
