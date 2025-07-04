
# Environment Variables Configuration

This application requires several API keys and configuration values to function properly. Below are the required environment variables and where to obtain them:

## Supabase Configuration
These are automatically configured by Lovable:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for edge functions)

## Required API Keys (Set in Supabase Edge Function Secrets)

### OpenAI API Key
**Secret Name:** `OPENAI_API_KEY`
**Where to get it:** https://platform.openai.com/api-keys
**Used for:** AI chat, code suggestions, and image generation with DALL-E

### Razorpay Payment Gateway
**Secret Name:** `RAZORPAY_KEY_ID`
**Where to get it:** https://dashboard.razorpay.com/app/keys
**Used for:** Payment processing key ID

**Secret Name:** `RAZORPAY_KEY_SECRET`
**Where to get it:** https://dashboard.razorpay.com/app/keys
**Used for:** Payment processing secret key

### Stable Diffusion API (Optional - Alternative to DALL-E)
**Secret Name:** `STABILITY_API_KEY`
**Where to get it:** https://platform.stability.ai/account/keys
**Used for:** Alternative AI image generation

## How to Set Up API Keys

1. Go to your Supabase dashboard
2. Navigate to Project Settings > Edge Functions > Manage secrets
3. Add each secret with the exact name specified above
4. Enter the corresponding API key value

## Features and Dependencies

### AI Chat & Code Suggestions
- Requires: `OPENAI_API_KEY`
- Features: General AI chat, coding assistance, code generation

### Image Generation
- Option 1: OpenAI DALL-E (requires `OPENAI_API_KEY`)
- Option 2: Stable Diffusion (requires `STABILITY_API_KEY`)

### Payment System
- Requires: `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
- Features: One-time payments, subscription billing, premium features
- Currency: INR (Indian Rupees)

### Real-time Chat
- Requires: Supabase configuration (automatically set up)
- Features: WebSocket-based real-time messaging between friends

### Profile Pictures & File Storage
- Requires: Supabase configuration (automatically set up)
- Features: Upload and store profile pictures, file attachments

## Razorpay Setup

### Getting Razorpay Keys
1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Complete KYC verification for live mode
3. Go to Settings > API Keys
4. Generate API keys for Test/Live mode
5. Add both Key ID and Key Secret to Supabase secrets

### Razorpay Features Used
- **One-time Payments**: For cart checkout and individual purchases
- **Subscriptions**: For premium plan billing
- **Indian Payment Methods**: UPI, Cards, Net Banking, Wallets
- **GST Calculation**: 18% GST applied on all transactions

## Testing

For development and testing:
- Use Razorpay test keys (they start with `rzp_test_`)
- OpenAI provides free credits for new accounts
- Stable Diffusion API offers free credits for testing
- Test payments with Razorpay test cards and UPI

## Security Notes

- Never commit API keys to version control
- Use test keys during development
- Rotate keys regularly in production
- Monitor API usage and costs
- Set up billing alerts for external APIs
- Razorpay webhook integration recommended for production

## Support

If you need help obtaining any of these API keys:
- OpenAI: https://help.openai.com/
- Razorpay: https://razorpay.com/support/
- Stability AI: https://platform.stability.ai/docs
- Supabase: https://supabase.com/docs
