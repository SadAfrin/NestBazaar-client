# 🛍️ NestBazaar — Second-Hand Marketplace

A full-stack second-hand marketplace where buyers can purchase pre-owned products, sellers can list items, and admins can manage the entire platform.

🌐 **Live Site:** [nest-bazaar-client.vercel.app](https://nest-bazaar-client.vercel.app)
🔧 **Server API:** [nest-bazaar-server.vercel.app](https://nest-bazaar-server.vercel.app)

---

## 📖 Overview

NestBazaar is a role-based e-commerce platform tailored for the second-hand goods market. It supports three distinct user roles — **Buyer**, **Seller**, and **Admin** — each with a dedicated dashboard and permission set. The platform handles the full commerce lifecycle: listing, discovery, secure checkout via Stripe, order tracking, and platform-wide analytics.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js | React framework (frontend) |
| Express.js | Backend server / REST API |
| MongoDB Atlas | Database |
| HeroUI | UI component library |
| Tailwind CSS | Styling |
| BetterAuth | Authentication (email/password + Google OAuth) |
| Framer Motion | Animations |
| Recharts | Analytics charts |
| Stripe | Payment gateway |

---

## ✨ Core Features

### 👤 Buyer
- Browse, search, filter, and sort products
- Add products to wishlist
- Secure Stripe checkout with order summary
- Track order status with a timeline progress bar
- Cancel orders before shipment
- View payment history and transaction records
- Write product reviews with star ratings
- Update profile and change password

### 🏪 Seller
- Add, edit, and delete product listings
- Manage incoming orders with step-by-step status updates
- View sales analytics with charts
- Track revenue and pending orders

### 🛡️ Admin
- Platform overview with real-time statistics
- Manage users — block/unblock, delete, change roles
- Super admin can manage other admins
- Approve, reject, and delete product listings
- Monitor all orders and payment transactions
- Platform-wide analytics with charts

---

## 🔐 Authentication & Security

- Email/password and Google OAuth via **BetterAuth**
- JWT token verification on all protected API routes
- Role-based authorization enforced on both client and server
- Super admin (`admin@admin.com`) has full platform control

---

## 💳 Payment Flow

1. Buyer clicks **Place Order** on the product page
2. Redirected to the **Checkout** page with a full order summary
3. Clicks **Proceed to Payment** → Stripe-hosted checkout
4. On successful payment → redirected to **Payment Success** page
5. Order and payment details are saved to the database automatically
6. Product is automatically removed from the wishlist

---

## 🚀 Notable Implementation Challenges

| Challenge | Details |
|-----------|---------|
| Advanced Search & Sort | Search by name/category, sort by price (low → high / high → low) |
| Pagination | 9 products per page on the All Products page |
| JWT + Role Authorization | Token verification and role-based protection across API routes |

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following:

```env
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
MONGODB_URI=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_BETTER_AUTH_URL=
NEXT_PUBLIC_SERVER_URL=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_SUPER_ADMIN_EMAIL=admin@admin.com
```

---

## 📦 Dependencies (Key Packages)

- `next` — React framework
- `express` — backend server
- `mongodb` / `mongoose` — database connection & modeling
- `better-auth` — authentication
- `stripe` — payment processing
- `framer-motion` — animations
- `recharts` — charts and analytics
- `tailwindcss` — utility-first styling
- HeroUI component packages

> Full list available in `package.json` for both client and server.

---

## 🏃 Run Locally

**Clone the repository:**
```bash
git clone https://github.com/SadAfrin/NestBazaar-client.git
cd NestBazaar-client
```

**Install dependencies:**
```bash
npm install
```

**Set up environment variables:**
Create a `.env` file in the root directory and add the variables listed in the [Environment Variables](#️-environment-variables) section above.

**Run the development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

> ⚠️ Note: This is the client repo. For full functionality, also clone and run the [server repo](https://nest-bazaar-server.vercel.app) with its own `.env` configuration.

---

## 🔑 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `admin@admin.com` | `$Admin123` |
| Seller | `mad@gmail.com` | `12345678` |
| Buyer | `sad@gmail.com` | `12345678` |

**Stripe Test Card:**
`4242 4242 4242 4242` — Expiry: any future `mm/yy` — CVC: any 3 digits (e.g. `123`)

---
