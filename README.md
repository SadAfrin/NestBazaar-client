# NestBazaar — Second-Hand Marketplace

A full-stack second-hand marketplace where buyers can purchase pre-owned products, sellers can list items, and admins can manage the entire platform.

🌐 **Live Site:** [https://nest-bazaar-client.vercel.app](https://nest-bazaar-client.vercel.app)
🔧 **Server:** [https://nest-bazaar-server.vercel.app](https://nest-bazaar-server.vercel.app)

---

## 🔑 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@admin.com | admin123 |
| Seller | mad@gmail.com | 123456 |
| Buyer | sad@gmail.com | 123456 |

> **Stripe Test Card:** `4242 4242 4242 4242` — Expiry: `12/26` — CVC: `123`

---

## ✨ Features

### Buyer
- Browse, search, filter and sort products
- Add products to wishlist
- Secure Stripe checkout with order summary
- Track order status with timeline progress bar
- Cancel orders before shipment
- View payment history and transaction records
- Write product reviews with star ratings
- Update profile and change password

### Seller
- Add, edit and delete product listings
- Manage incoming orders with step-by-step status updates
- View sales analytics with charts
- Track revenue and pending orders

### Admin
- Platform overview with real-time statistics
- Manage users — block/unblock, delete, change roles
- Super admin can manage other admins
- Approve, reject and delete product listings
- Monitor all orders and payment transactions
- Platform analytics with charts

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework |
| HeroUI v3 | UI components |
| Tailwind CSS v4 | Styling |
| BetterAuth | Authentication |
| Framer Motion | Animations |
| Recharts | Charts |
| Stripe | Payment gateway |
| MongoDB Atlas | Database |
| Express.js | Backend server |

---

## 🔐 Authentication & Security

- Email/password and Google OAuth via BetterAuth
- JWT token verification on all protected API routes
- Role-based authorization on both client and server
- Super admin (`admin@admin.com`) has full platform control

---

## 💳 Payment Flow

1. Buyer clicks **Place Order** on product page
2. Redirected to **Checkout page** with full order summary
3. Clicks **Proceed to Payment** → Stripe hosted checkout
4. After successful payment → **Payment Success page**
5. Order and payment saved to database automatically
6. Product removed from wishlist automatically

---

## 🚀 Challenges Implemented

| Challenge | Details |
|-----------|---------|
| Advanced Search & Sort | Search by name/category, sort by price low/high |
| Pagination | 9 products per page on All Products page |
| JWT + Role Authorization | Token verification and role-based API protection |

---

## ⚙️ Environment Variables

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

## 🏃 Run Locally

```bash
git clone https://github.com/SadAfrin/NestBazaar-client.git
cd NestBazaar-client
npm install
npm run dev
```

---

## 👨‍💻 Developer

**Sadia Afrin** — PH-L1 | Assignment 10