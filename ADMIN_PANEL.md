# Admin Panel Documentation

## Overview

This project includes a comprehensive administrative panel for managing products, images, and system settings. The panel is built with React, TypeScript, Tailwind CSS, and integrates with Shopify's Admin API.

## Features

### 1. Dashboard (`/admin/dashboard`)
- Central hub for all administrative functions
- Quick statistics overview
- Navigation to all admin sections
- Quick action buttons for common tasks

### 2. Product Management (`/admin/products`)
- **Create Products**: Add new products with details like title, description, price, vendor, type, and tags
- **Edit Products**: Update existing product information
- **Delete Products**: Remove products from the catalog
- **Search & Filter**: Find products quickly by name/handle and filter by status (Active, Draft, Archived)
- **Categories**: Assign products to collections/categories
- **Options & Variants**: Configure product options (size, color, etc.) and variants
- **Image Gallery**: Manage product images with drag-and-drop reordering

### 3. Media Management (`/admin/media`)
- **Upload Images**: Support for multiple image uploads
- **File Validation**: 
  - Supported formats: JPEG, PNG, GIF, WebP
  - Maximum file size: 10MB per image
- **Image Organization**: Reorder images, add captions, and delete unwanted media
- **Shopify Sync**: All changes are synchronized with Shopify Admin API

### 4. Settings (`/admin/settings`)
- **General Settings**: Site name, description
- **Business Information**: Company details, address, contact information
- **Email Configuration**: Contact and support email addresses
- **SEO Settings**: Meta title, description, and keywords
- **Feature Flags**: Enable/disable features like product reviews, wishlist, newsletter
- **Shopify Integration**: View current API configuration

### 5. Configurator (`/admin/configurator`)
- Product configuration tool (inherited from existing system)

## Authentication

The admin panel uses a secure authentication system:

1. **Login Page** (`/admin/login`)
   - Uses a shared secret for authentication
   - Session stored locally with expiration (8 hours)
   - SHA-256 hashing for security

2. **Default Credentials**
   - The default secret hash is: `16175223c8ddce5ace0493c948569c211b03c4c6bb3d3e484434999448cffe01`
   - This corresponds to the secret: `admin123` (for testing purposes only)
   - **IMPORTANT**: Change this in production by setting `VITE_ADMIN_SHARED_SECRET_HASH` environment variable

3. **Protected Routes**
   - All admin routes (except login) require authentication
   - Unauthenticated users are redirected to `/admin/login`

## Environment Variables

Required environment variables (add to `.env` file):

```env
# Shopify Storefront API (for public-facing store)
VITE_SHOPIFY_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-token
VITE_SHOPIFY_API_VERSION=2024-07

# Shopify Admin API (for admin panel)
VITE_SHOPIFY_ADMIN_API_TOKEN=your-admin-api-token

# Admin Authentication
VITE_ADMIN_SHARED_SECRET_HASH=your-sha256-hash
```

### Getting Shopify API Credentials

1. **Storefront Access Token**:
   - Go to your Shopify Admin → Apps → Develop apps
   - Create a new app or use existing
   - Configure Storefront API access
   - Copy the Storefront Access Token

2. **Admin API Token**:
   - In the same app, configure Admin API access
   - Select required scopes: `read_products`, `write_products`, `read_files`, `write_files`
   - Copy the Admin API access token

### Generating a Secure Admin Secret Hash

To generate a SHA-256 hash for your admin secret:

```javascript
// In browser console or Node.js
const crypto = require('crypto');
const secret = 'your-secret-password';
const hash = crypto.createHash('sha256').update(secret).digest('hex');
console.log(hash);
```

Or use an online SHA-256 generator (ensure it's a trusted source).

## Usage Guide

### Adding a New Product

1. Navigate to `/admin/products`
2. In the left sidebar, fill in the "Novo Produto" form:
   - Enter product name (required)
   - Optionally set a custom URL handle
   - Set the price
   - Choose status (Active, Draft, or Archived)
3. Click "Criar Produto"
4. The product will be created and selected automatically
5. Now you can:
   - Edit full product details in the main panel
   - Assign to categories
   - Add product options/variants
   - Upload images

### Uploading Product Images

1. Select a product from the products list
2. Scroll to the "Galeria do produto" section
3. Click "Choose File" and select one or more images
4. Click "Enviar imagens"
5. Progress bars will show upload status
6. Once uploaded, you can:
   - Reorder images using up/down arrows
   - Edit image captions
   - Delete unwanted images

### Searching Products

1. Go to `/admin/products`
2. Use the search box in the products sidebar
3. Type product name or handle
4. Use the status filter to narrow results
5. Results update automatically

### Configuring Settings

1. Navigate to `/admin/settings`
2. Update the desired settings in each section:
   - General Settings
   - Business Information
   - Email Configuration
   - SEO Settings
   - Feature Flags
3. Click "Salvar Configurações" to save
4. Settings are stored locally (extend to backend as needed)

## Security Considerations

1. **Never commit sensitive data**: Keep API tokens and secrets in `.env` files that are gitignored
2. **Use strong secrets**: The default admin secret is for testing only
3. **HTTPS only**: Always use HTTPS in production
4. **Session expiration**: Admin sessions expire after 8 hours
5. **Token rotation**: Regularly rotate Shopify API tokens
6. **Scope limitation**: Only grant necessary Shopify API scopes

## Technical Details

### Technology Stack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React hooks (useState, useEffect, useMemo)
- **Routing**: React Router v6
- **API Integration**: Shopify GraphQL Admin API & Storefront API
- **Build Tool**: Vite
- **Form Handling**: React Hook Form + Zod validation
- **Toast Notifications**: Sonner

### File Structure
```
src/
├── pages/
│   ├── AdminDashboard.tsx    # Main dashboard
│   ├── AdminProducts.tsx     # Product management
│   ├── AdminMedia.tsx        # Media management
│   ├── AdminSettings.tsx     # System settings
│   └── AdminLogin.tsx        # Authentication
├── components/
│   ├── ProtectedRoute.tsx    # Auth guard for routes
│   └── ui/                   # shadcn/ui components
├── contexts/
│   └── AdminAuthContext.tsx  # Auth state management
├── lib/
│   ├── shopify-admin.ts      # Shopify Admin API client
│   ├── shopify.ts            # Shopify Storefront API client
│   └── auth.ts               # Authentication utilities
└── App.tsx                   # Route configuration
```

## Troubleshooting

### "Token de API Admin não configurado"
- Ensure `VITE_SHOPIFY_ADMIN_API_TOKEN` is set in your `.env` file
- Restart the dev server after adding environment variables

### "Invalid admin secret"
- Check that you're using the correct secret
- Verify the hash in `VITE_ADMIN_SHARED_SECRET_HASH` matches your secret
- Default test secret is `admin123`

### Images not uploading
- Check file size (must be < 10MB)
- Verify file type (JPEG, PNG, GIF, or WebP only)
- Ensure product is selected before uploading
- Check browser console for detailed errors

### Products not loading
- Verify Shopify credentials are correct
- Check network tab for API errors
- Ensure your Shopify app has proper API scopes

## Future Enhancements

Potential improvements for future versions:

1. **Backend Integration**: Store settings in a database instead of localStorage
2. **Bulk Operations**: Select multiple products for batch actions
3. **Advanced Filtering**: Filter by collections, tags, vendor, etc.
4. **Analytics**: Product performance metrics and reports
5. **Image Editing**: Crop, resize, and edit images before upload
6. **Multi-language**: Support for multiple languages in the admin panel
7. **Role-based Access**: Different permission levels for different admin users
8. **Audit Log**: Track all changes made in the admin panel

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Shopify Admin API documentation
3. Check browser console for error details
4. Verify all environment variables are set correctly
