---

## 🔐 Authentication

- Email/password registration and login via **BetterAuth**
- Google OAuth login
- JWT token verification on all protected API routes
- Role-based authorization — **buyer**, **seller**, **admin**
- Super admin (`admin@admin.com`) has full platform control

---

## 💳 Payment Flow

1. Buyer clicks **Place Order** on product page
2. Redirected to **Checkout page** with order summary
3. Clicks **Proceed to Payment** → Stripe hosted checkout
4. After successful payment → **Payment Success page**
5. Order and payment saved to MongoDB automatically
6. Product removed from wishlist automatically

---

## 🚀 Challenges Implemented

| Challenge | Details |
|-----------|---------|
| Advanced Search & Sort | Search by name/category, sort by price |
| Pagination | 9 products per page on All Products page |
| JWT Authentication | Token verification + role-based authorization |

---

## ⚙️ Environment Variables

### Client (.env)
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

### Server (.env)
```env
MONGODB_URI=
CLIENT_URL=
PORT=5000
```

---

## 🏃 Run Locally

### Client
```bash
git clone https://github.com/SadAfrin/NestBazaar-client.git
cd NestBazaar-client
npm install
npm run dev
```

### Server
```bash
git clone https://github.com/SadAfrin/NestBazaar-server.git
cd NestBazaar-server
npm install
node index.js
```

---

## 📦 MongoDB Collections

| Collection | Description |
|------------|-------------|
| `users` | Custom user profiles with role and status |
| `user` | BetterAuth managed authentication |
| `products` | Product listings with seller info |
| `orders` | Order records with buyer/seller info |
| `payments` | Payment transaction records |
| `reviews` | Product reviews with ratings |

---

## 👨‍💻 Developer

**Sad Afrin**
- GitHub: [@SadAfrin](https://github.com/SadAfrin)
- Batch: PH-L1 | Assignment 10