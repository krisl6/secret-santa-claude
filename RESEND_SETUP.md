# Resend Email Integration Setup

This Secret Santa app uses [Resend](https://resend.com) to send email notifications to participants.

## Features

The app sends email notifications for:

1. **Team Creation**: When an organizer creates a new team
2. **Team Joined**: When a participant joins a team
3. **Draw Completed**: When the Secret Santa draw is performed, each participant receives their assignment

## Setup Instructions

### 1. Create a Resend Account

1. Go to [resend.com](https://resend.com) and sign up for a free account
2. The free tier includes:
   - 100 emails/day
   - 1 custom domain
   - Full API access

### 2. Get Your API Key

1. Log in to your Resend dashboard
2. Navigate to **API Keys** section
3. Click **Create API Key**
4. Give it a name (e.g., "Secret Santa Production")
5. Copy the API key (starts with `re_`)

### 3. Configure Environment Variables

Add the following to your `.env` file (locally) and Netlify environment variables (production):

```bash
# Required: Your Resend API key
RESEND_API_KEY="re_your_api_key_here"

# Optional: Custom sender email (must be verified in Resend)
# If not set, uses default: "Secret Santa <onboarding@resend.dev>"
RESEND_FROM_EMAIL="Secret Santa <noreply@yourdomain.com>"

# Required: Your application URL for email links
NEXT_PUBLIC_APP_URL="https://your-site.netlify.app"
```

### 4. (Optional) Set Up Custom Domain

To use a custom sender email address:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain name
4. Add the DNS records shown to your domain provider
5. Wait for verification (usually a few minutes)
6. Set `RESEND_FROM_EMAIL` in your environment variables

### 5. Deploy to Netlify

When deploying to Netlify, add these environment variables:

1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add the following variables:
   - `RESEND_API_KEY`: Your Resend API key
   - `RESEND_FROM_EMAIL`: (Optional) Your verified sender email
   - `NEXT_PUBLIC_APP_URL`: Your Netlify site URL (e.g., `https://your-site.netlify.app`)

## Email Collection

The app collects email addresses during:

1. **Team Creation**: Organizer can optionally provide their email
2. **Team Join**: Participants can optionally provide their email

**Note**: Email addresses are optional. If a participant doesn't provide an email, they simply won't receive email notifications.

## Database Schema

The email field has been added to the `Participant` model:

```prisma
model Participant {
  id          String   @id @default(cuid())
  teamId      String
  displayName String
  email       String?  // Optional email field
  // ... other fields
}
```

## Migration

After adding the Resend integration, you'll need to run a database migration:

```bash
# Create migration
npx prisma migrate dev --name add_participant_email

# Or deploy migration (production)
npx prisma migrate deploy
```

## Testing Locally

1. Set up your `.env` file with `RESEND_API_KEY`
2. Run the development server: `npm run dev`
3. Create a team with your email address
4. Check your email inbox for the notification

## Troubleshooting

### Emails Not Sending

1. **Check API Key**: Ensure `RESEND_API_KEY` is set correctly
2. **Check Logs**: Look for error messages in Netlify function logs
3. **Free Tier Limits**: Ensure you haven't exceeded 100 emails/day on free tier
4. **Email Validation**: Resend validates email addresses - invalid emails will fail

### Emails Going to Spam

1. **Set Up DKIM/SPF**: Configure your custom domain properly
2. **Use Custom Domain**: Emails from verified domains are less likely to be marked as spam
3. **Warm Up**: New domains may need time to build reputation

### Custom Domain Not Verified

1. **DNS Propagation**: Wait 24-48 hours for DNS changes to propagate
2. **Check DNS Records**: Verify all records are added correctly
3. **Contact Support**: Reach out to Resend support if issues persist

## Cost Considerations

- **Free Tier**: 100 emails/day, perfect for small teams
- **Pro Tier** ($20/month): 50,000 emails/month
- **Each draw** for a team of 10 sends 10 emails
- **Monitor usage** in Resend dashboard

## Privacy & Security

- Email addresses are stored securely in the database
- Emails are sent via Resend's secure API
- No email addresses are shared with third parties
- Users can opt out by not providing their email

## Support

For Resend-specific issues:
- Documentation: https://resend.com/docs
- Support: https://resend.com/support

For app-specific issues:
- Check the main README.md
- Review TROUBLESHOOTING.md
