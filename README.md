**Deployed URL:** https://tour-booking-frontend-sigma.vercel.app

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
# VoyaLink Frontend

A modern Sri Lanka tour booking platform built with React, TypeScript and TailwindCSS.

**Live URL:** https://tour-booking-frontend-sigma.vercel.app

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| TypeScript | 5 | Type safety |
| Vite | 6 | Build tool |
| TailwindCSS | 4 | Styling |
| React Router | 6 | Routing |
| Axios | latest | HTTP client |

---

## Project Structure
src/
├── components/
│   ├── UserNavbar.tsx       # Responsive navbar for user pages
│   └── AdminNavbar.tsx      # Responsive navbar for admin pages
├── context/
│   └── AuthContext.tsx      # Global auth state
├── hooks/
│   └── useAuth.ts           # Auth hook
├── pages/
│   ├── Home.tsx             # Landing page
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx        # User dashboard
│   ├── Tours.tsx            # Browse tours
│   ├── TourDetail.tsx       # Tour detail + booking
│   ├── MyBookings.tsx       # User bookings
│   ├── MyPayments.tsx       # Payment history
│   ├── Payment.tsx          # Advance/balance payment
│   ├── AIChat.tsx           # AI travel assistant
│   ├── AdminDashboard.tsx
│   ├── AdminTours.tsx
│   ├── AdminBookings.tsx
│   └── AdminPayments.tsx
├── router/
│   └── index.tsx            # All routes + ProtectedRoute
├── service/
│   ├── api.ts               # Axios instance + interceptors
│   ├── auth.ts
│   ├── tour.ts
│   ├── booking.ts
│   ├── payment.ts
│   └── ai.ts
├── App.tsx
├── main.tsx
└── index.css
---

## Setup & Run

### 1. Clone and install

```bash
git clone https://github.com/SithuminiDulanjalee/tour-booking-frontend.git
cd tour-booking-frontend
npm install
```

### 2. Create `.env`

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Run development server

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## Routes

| Route | Page | Access |
|---|---|---|
| `/` | Home | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/tours` | Browse tours | Public |
| `/tours/:id` | Tour detail + booking | Public |
| `/dashboard` | User dashboard | User |
| `/my-bookings` | My bookings | User |
| `/my-payments` | Payment history | User |
| `/payment/:bookingId` | Payment flow | User |
| `/ai` | AI travel chat | User only |
| `/admin` | Admin dashboard | Admin |
| `/admin/tours` | Manage tours | Admin |
| `/admin/bookings` | Manage bookings | Admin |
| `/admin/payments` | Manage payments | Admin |

---

## Key Features

**Authentication** — JWT access tokens (30 min) + refresh tokens (7 days). Axios interceptors auto-refresh expired tokens.

**Two-stage LKR payments** — Users pay 30% advance, admin confirms, users pay 70% balance. Payment progress bar tracks each stage.

**AI Travel Assistant** — Groq · Llama 3 powered chat at `/ai`. Conversation history stored in `localStorage` — persists across sessions, never saved to database. USER role only.

**Responsive design** — Mobile hamburger nav, responsive grids, horizontal-scroll tables on small screens.

---

## Build for Production

```bash
npm run build
```

Output goes to `dist/` folder.

---

## Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Set environment variable: VITE_API_URL = https://tour-booking-backend-production.up.railway.app/api/v1
4. Deploy

Vercel auto-deploys on every push to `main`.

---

## Deployed URLs

| Environment | URL |
|---|---|
| Frontend (Vercel) | https://tour-booking-frontend-sigma.vercel.app |
| Backend API | https://tour-booking-backend-production.up.railway.app |

---

## Screenshots

<img width="1895" height="892" alt="image" src="https://github.com/user-attachments/assets/01de26b6-2775-46e9-b4aa-d84dbf28542f" />
<img width="1887" height="898" alt="image" src="https://github.com/user-attachments/assets/948c72ad-d5eb-4d0f-bf5f-2dfc780ec385" />
<img width="1885" height="857" alt="image" src="https://github.com/user-attachments/assets/4c68b16c-d9cd-45be-a003-679233c86763" />
<img width="1885" height="902" alt="image" src="https://github.com/user-attachments/assets/2b3fe7af-2631-4a08-a096-0e7800a50f47" />
<img width="1887" height="863" alt="image" src="https://github.com/user-attachments/assets/d3b01f23-cd4f-42ae-9478-9a554705f515" />

---

## Author

Sithumini Dulanjalee ITS2020 — Rapid Application Development · IJSE
