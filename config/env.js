console.log(`[${new Date().toISOString()}] Frontend .env loading...`);
console.log(`[${new Date().toISOString()}] REACT_APP_STRIPE_PUBLISHABLE_KEY:`, process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
console.log(`[${new Date().toISOString()}] REACT_APP_API_URL:`, process.env.REACT_APP_API_URL);

if (!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) {
  console.error(`[${new Date().toISOString()}] REACT_APP_STRIPE_PUBLISHABLE_KEY is not defined. Check frontend/.env file or Vercel dashboard.`);
}
if (!process.env.REACT_APP_API_URL) {
  console.error(`[${new Date().toISOString()}] REACT_APP_API_URL is not defined. Check frontend/.env file or Vercel dashboard. Falling back to https://jeep-ten.vercel.app`);
} else {
  console.log(`[${new Date().toISOString()}] Frontend environment loaded successfully`);
}

export {};