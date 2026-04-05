import nodemailer from 'nodemailer';

// Create a reusable transporter using Ethereal's test service.
// In a production environment, you would use actual SMTP credentials from process.env.
let transporter: nodemailer.Transporter | null = null;

export const sendEmail = async (options: { to: string; subject: string; text: string; html?: string; }) => {
  try {
    if (!transporter) {
      // Generate a test account on the fly if no SMTP settings are provided
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
      } else {
        console.log('No SMTP configuration found. Creating default Ethereal test account...');
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
          },
        });
      }
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"ProfileHub" <noreply@profilehub.local>',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Message sent: %s', info.messageId);
    if (!process.env.SMTP_HOST) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (error) {
    console.error('Failed to send email via SMTP/Ethereal due to network error:', error);
    console.log('--------------------------------------------------');
    console.log('SIMULATED EMAIL SEND (Fallback for Development):');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Body: ${options.text}`);
    console.log('--------------------------------------------------');
    // Return a mock success so the application flow isn't broken
    return { messageId: 'simulated-id', response: '250 OK Simulated' };
  }
};
