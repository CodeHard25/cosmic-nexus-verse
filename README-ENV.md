
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

### Stripe Payment Gateway
**Secret Name:** `STRIPE_SECRET_KEY`
**Where to get it:** https://dashboard.stripe.com/apikeys
**Used for:** Payment processing and subscriptions

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
- Requires: `STRIPE_SECRET_KEY`
- Features: One-time payments, subscription billing, premium features

### Real-time Chat
- Requires: Supabase configuration (automatically set up)
- Features: WebSocket-based real-time messaging between friends

### Profile Pictures & File Storage
- Requires: Supabase configuration (automatically set up)
- Features: Upload and store profile pictures, file attachments

## Testing

For development and testing:
- Use Stripe test keys (they start with `sk_test_`)
- OpenAI provides free credits for new accounts
- Stable Diffusion API offers free credits for testing

## Security Notes

- Never commit API keys to version control
- Use test keys during development
- Rotate keys regularly in production
- Monitor API usage and costs
- Set up billing alerts for external APIs

## Support

If you need help obtaining any of these API keys:
- OpenAI: https://help.openai.com/
- Stripe: https://support.stripe.com/
- Stability AI: https://platform.stability.ai/docs
- Supabase: https://supabase.com/docs
