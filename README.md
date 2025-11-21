# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/134b12cb-c9bd-4d93-8d41-3c53164baeb3

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/134b12cb-c9bd-4d93-8d41-3c53164baeb3) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

### Environment configuration

Before running the project, copy `.env.example` to `.env` and fill in your Shopify Storefront credentials:

```
VITE_SHOPIFY_DOMAIN=your-shopify-domain.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
VITE_SHOPIFY_API_VERSION=2024-07
```

These variables are required for the storefront API calls and should be provided by your deployment environment.

#### Admin Authentication Setup

The admin area (`/admin/*` routes) is protected by password authentication using SHA-256 hashing. To set up admin access:

1. Generate a SHA-256 hash of your desired password:
   ```bash
   echo -n "your_password_here" | sha256sum
   ```

2. Add the hash to your `.env` file:
   ```
   VITE_ADMIN_SHARED_SECRET_HASH=your_generated_hash_here
   ```

3. When logging in to `/admin/login`, enter your password (the interface is in Portuguese).

**⚠️ Security Notes:**
- The password is hashed client-side using SHA-256 before comparison
- Never commit your `.env` file or expose your password hash
- Admin sessions are stored locally and expire after 8 hours
- Change the default password in production for security

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/134b12cb-c9bd-4d93-8d41-3c53164baeb3) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
