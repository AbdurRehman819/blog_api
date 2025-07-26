module.exports = (name, verificationLink) => `
  <div style="font-family: 'Arial', sans-serif; padding: 20px; color: #333;">
    <h2 style="color: #4CAF50;">Welcome to Our Blog Platform, ${name}!</h2>
    <p>Thank you for signing up. Please verify your email to activate your account.</p>
    <a href="${verificationLink}" target="_blank" 
       style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; 
              color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px;">
      Verify Email
    </a>
    <p style="margin-top: 20px;">If you did not request this, please ignore this email.</p>
    <hr style="margin-top: 30px;" />
    <small>This link will expire in 10 minutes for security reasons.</small>
  </div>
`;

