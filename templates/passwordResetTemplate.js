
module.exports = (name, resetLink) => `
  <div style="font-family: 'Arial', sans-serif; padding: 20px; color: #333;">
    <h2 style="color: #f44336;">Password Reset Request</h2>
    <p>Hi ${name},</p>
    <p>We received a request to reset your password. Click the button below to set a new one.</p>
    <a href="${resetLink}" target="_blank" 
       style="display: inline-block; padding: 10px 20px; background-color: #f44336; 
              color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px;">
      Reset Password
    </a>
    <p style="margin-top: 20px;">If you didn’t request this, you can safely ignore this email.</p>
    <hr style="margin-top: 30px;" />
    <small>This link will expire in 15 minutes for your protection.</small>
  </div>
`;


