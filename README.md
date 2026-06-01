# Padel in Rio Web

Web application for Padel in Rio, built with Next.js, Supabase, and Tailwind CSS.

## 🛠️ Technologies

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Maps**: [Google Maps API](https://developers.google.com/maps)
- **Testing**: [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## 💻 Getting Started

### Prerequisites

- Node.js (developed originally in v22.20)
- npm (developed originally in v11.7)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (optional)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Croking09/padel-in-rio-web.git
   cd padel-in-rio-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

> [!WARNING]
> Remember the .env.local file should contain dev keys, not production keys.

| Variable                               | Description                                          |
| :------------------------------------- | :--------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Your Supabase project URL                            |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon/public key                        |
| `SUPABASE_SERVICE_KEY`                 | Your Supabase service role key (keep secret)         |
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY`          | Google Maps JavaScript API Key                       |
| `TELEGRAM_BOT_TOKEN`                   | Token from @BotFather for Telegram integration       |
| `ADMIN_CHAT_IDS`                       | Comma-separated list of Telegram chat IDs for admins |

### Local Development

> [!IMPORTANT]  
> Everytime the DB gets reset the auth scheme deletes all data. Make sure to create at least an admin account (check SQL snippets).

1. **Start Supabase (Optional for local DB)**:
   If you want to run Supabase locally:

   ```bash
   supabase start
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

## 🧪 Testing

Run the test suite using Jest:

```bash
npm run test
```

To run tests in watch mode:

```bash
npm run test:watch
```
