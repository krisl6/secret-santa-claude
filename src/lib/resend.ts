import { Resend } from 'resend'

// Initialize Resend client
// The API key should be set in environment variables
const resend = new Resend(process.env.RESEND_API_KEY)

export default resend
