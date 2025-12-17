interface TeamCreatedEmailParams {
  organizerName: string
  teamName: string
  companyName?: string
  eventDate: string
  token: string
  teamUrl: string
}

interface TeamJoinedEmailParams {
  participantName: string
  teamName: string
  companyName?: string
  eventDate: string
  teamUrl: string
}

interface DrawCompletedEmailParams {
  participantName: string
  teamName: string
  receiverName: string
  teamUrl: string
}

export function getTeamCreatedEmail({
  organizerName,
  teamName,
  companyName,
  eventDate,
  token,
  teamUrl,
}: TeamCreatedEmailParams): { subject: string; html: string } {
  const companyText = companyName ? ` for ${companyName}` : ''
  const eventDateFormatted = new Date(eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return {
    subject: `🎅 You've created a Secret Santa team: ${teamName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Secret Santa Team Created</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #C8102E 0%, #8B0000 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎅 Secret Santa Team Created! 🎄</h1>
          </div>

          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; margin-bottom: 20px;">Hi ${organizerName}! 👋</p>

            <p style="font-size: 16px; margin-bottom: 20px;">
              Congratulations! You've successfully created a Secret Santa team${companyText}. 🎉
            </p>

            <div style="background-color: #FFF8E7; border-left: 4px solid #C8102E; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <h2 style="color: #C8102E; margin-top: 0; font-size: 20px;">📋 Team Details</h2>
              <p style="margin: 5px 0;"><strong>Team Name:</strong> ${teamName}</p>
              ${companyName ? `<p style="margin: 5px 0;"><strong>Company:</strong> ${companyName}</p>` : ''}
              <p style="margin: 5px 0;"><strong>Event Date:</strong> ${eventDateFormatted}</p>
              <p style="margin: 5px 0;"><strong>Team Token:</strong> <code style="background-color: #E8F5E9; padding: 5px 10px; border-radius: 3px; font-size: 18px; color: #0F5132; font-weight: bold;">${token}</code></p>
            </div>

            <div style="background-color: #E8F5E9; border-left: 4px solid #0F5132; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <h3 style="color: #0F5132; margin-top: 0; font-size: 18px;">📢 Next Steps:</h3>
              <ol style="margin: 10px 0; padding-left: 20px;">
                <li style="margin: 5px 0;">Share the team token (<code style="background-color: white; padding: 2px 6px; border-radius: 3px;">${token}</code>) with your team members</li>
                <li style="margin: 5px 0;">Wait for everyone to join and add their wishlists</li>
                <li style="margin: 5px 0;">Perform the Secret Santa draw when ready</li>
              </ol>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${teamUrl}" style="display: inline-block; background: linear-gradient(135deg, #C8102E 0%, #8B0000 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                🎁 Manage Your Team
              </a>
            </div>

            <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              Happy gifting! 🎅✨<br>
              The Secret Santa Team
            </p>
          </div>
        </body>
      </html>
    `,
  }
}

export function getTeamJoinedEmail({
  participantName,
  teamName,
  companyName,
  eventDate,
  teamUrl,
}: TeamJoinedEmailParams): { subject: string; html: string } {
  const companyText = companyName ? ` (${companyName})` : ''
  const eventDateFormatted = new Date(eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return {
    subject: `🎄 You've joined the Secret Santa team: ${teamName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Secret Santa</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #0F5132 0%, #0A3D2E 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎄 Welcome to Secret Santa! 🎁</h1>
          </div>

          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; margin-bottom: 20px;">Hi ${participantName}! 👋</p>

            <p style="font-size: 16px; margin-bottom: 20px;">
              You've successfully joined the Secret Santa team <strong>${teamName}</strong>${companyText}! 🎉
            </p>

            <div style="background-color: #FFF8E7; border-left: 4px solid #C8102E; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <h2 style="color: #C8102E; margin-top: 0; font-size: 20px;">📋 Event Details</h2>
              <p style="margin: 5px 0;"><strong>Team Name:</strong> ${teamName}</p>
              ${companyName ? `<p style="margin: 5px 0;"><strong>Company:</strong> ${companyName}</p>` : ''}
              <p style="margin: 5px 0;"><strong>Event Date:</strong> ${eventDateFormatted}</p>
            </div>

            <div style="background-color: #E8F5E9; border-left: 4px solid #0F5132; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <h3 style="color: #0F5132; margin-top: 0; font-size: 18px;">📝 Next Steps:</h3>
              <ol style="margin: 10px 0; padding-left: 20px;">
                <li style="margin: 5px 0;">Add items to your wishlist (1-3 items)</li>
                <li style="margin: 5px 0;">Wait for the organizer to perform the draw</li>
                <li style="margin: 5px 0;">You'll be notified when you receive your Secret Santa assignment!</li>
              </ol>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${teamUrl}" style="display: inline-block; background: linear-gradient(135deg, #0F5132 0%, #0A3D2E 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                ✨ Add Your Wishlist
              </a>
            </div>

            <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              Get ready for the gift exchange! 🎅✨<br>
              The Secret Santa Team
            </p>
          </div>
        </body>
      </html>
    `,
  }
}

export function getDrawCompletedEmail({
  participantName,
  teamName,
  receiverName,
  teamUrl,
}: DrawCompletedEmailParams): { subject: string; html: string } {
  return {
    subject: `🎁 Your Secret Santa assignment is ready!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Secret Santa Assignment</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #C8102E 0%, #8B0000 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎁 Your Secret Santa Assignment! 🎅</h1>
          </div>

          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; margin-bottom: 20px;">Hi ${participantName}! 👋</p>

            <p style="font-size: 16px; margin-bottom: 20px;">
              The Secret Santa draw for <strong>${teamName}</strong> has been completed! 🎉
            </p>

            <div style="background-color: #FFF8E7; border-left: 4px solid #C8102E; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center;">
              <h2 style="color: #C8102E; margin-top: 0; font-size: 22px;">🎯 You're buying a gift for:</h2>
              <p style="font-size: 28px; font-weight: bold; color: #0F5132; margin: 15px 0;">${receiverName}</p>
              <p style="font-size: 14px; color: #666; margin-top: 10px;">🤫 Keep it a secret!</p>
            </div>

            <div style="background-color: #E8F5E9; border-left: 4px solid #0F5132; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <h3 style="color: #0F5132; margin-top: 0; font-size: 18px;">📝 What to do next:</h3>
              <ol style="margin: 10px 0; padding-left: 20px;">
                <li style="margin: 5px 0;">View ${receiverName}'s wishlist items</li>
                <li style="margin: 5px 0;">Choose and purchase a gift</li>
                <li style="margin: 5px 0;">Mark it as purchased in the app</li>
                <li style="margin: 5px 0;">Give your gift on the event day!</li>
              </ol>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${teamUrl}" style="display: inline-block; background: linear-gradient(135deg, #C8102E 0%, #8B0000 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                🎁 View Wishlist
              </a>
            </div>

            <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              Remember: It's a secret! 🤫✨<br>
              The Secret Santa Team
            </p>
          </div>
        </body>
      </html>
    `,
  }
}
