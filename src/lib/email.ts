import resend from './resend'
import {
  getTeamCreatedEmail,
  getTeamJoinedEmail,
  getDrawCompletedEmail,
} from './email-templates'

interface SendTeamCreatedEmailParams {
  to: string
  organizerName: string
  teamName: string
  companyName?: string
  eventDate: string
  token: string
  teamUrl: string
}

interface SendTeamJoinedEmailParams {
  to: string
  participantName: string
  teamName: string
  companyName?: string
  eventDate: string
  teamUrl: string
}

interface SendDrawCompletedEmailParams {
  to: string
  participantName: string
  teamName: string
  receiverName: string
  teamUrl: string
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Secret Santa <onboarding@resend.dev>'

export async function sendTeamCreatedEmail(params: SendTeamCreatedEmailParams) {
  try {
    const { subject, html } = getTeamCreatedEmail(params)

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject,
      html,
    })

    if (error) {
      console.error('Failed to send team created email:', error)
      return { success: false, error }
    }

    console.log('Team created email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending team created email:', error)
    return { success: false, error }
  }
}

export async function sendTeamJoinedEmail(params: SendTeamJoinedEmailParams) {
  try {
    const { subject, html } = getTeamJoinedEmail(params)

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject,
      html,
    })

    if (error) {
      console.error('Failed to send team joined email:', error)
      return { success: false, error }
    }

    console.log('Team joined email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending team joined email:', error)
    return { success: false, error }
  }
}

export async function sendDrawCompletedEmail(params: SendDrawCompletedEmailParams) {
  try {
    const { subject, html } = getDrawCompletedEmail(params)

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject,
      html,
    })

    if (error) {
      console.error('Failed to send draw completed email:', error)
      return { success: false, error }
    }

    console.log('Draw completed email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending draw completed email:', error)
    return { success: false, error }
  }
}

/**
 * Send emails to multiple participants for draw completion
 */
export async function sendDrawCompletedEmailsToAll(
  assignments: Array<{
    to: string
    participantName: string
    teamName: string
    receiverName: string
    teamUrl: string
  }>
) {
  const results = await Promise.allSettled(
    assignments.map((params) => sendDrawCompletedEmail(params))
  )

  const successful = results.filter((r) => r.status === 'fulfilled').length
  const failed = results.filter((r) => r.status === 'rejected').length

  console.log(`Draw emails sent: ${successful} successful, ${failed} failed`)

  return { successful, failed, results }
}
