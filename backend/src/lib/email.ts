import nodemailer from 'nodemailer';

// Configure the email transporter
const createTransporter = () => {
  // Use environment variables for email configuration
  const config = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  };

  console.log('🔧 Email transporter configuration:');
  console.log('   Host:', config.host);
  console.log('   Port:', config.port);
  console.log('   Secure:', config.secure);
  console.log('   User:', config.auth.user ? '✓ Set' : '✗ Not set');
  console.log('   Pass:', config.auth.pass ? '✓ Set' : '✗ Not set');

  if (!config.auth.user || !config.auth.pass) {
    console.error('⚠️ WARNING: Email credentials not properly configured!');
    console.error('   Please check EMAIL_USER and EMAIL_PASSWORD in .env file');
  }

  return nodemailer.createTransport(config);
};

// Email templates
const getApprovalEmailTemplate = (
  fullName: string,
  email: string,
  password: string,
  loginUrl: string
) => {
  return {
    subject: '🎉 Your Peer Supporter Application Has Been Approved!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .credentials-box {
            background: white;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
          }
          .credential-item {
            margin: 10px 0;
            padding: 10px;
            background: #f0f0f0;
            border-radius: 5px;
          }
          .credential-label {
            font-weight: bold;
            color: #667eea;
            display: block;
            margin-bottom: 5px;
          }
          .credential-value {
            font-family: 'Courier New', monospace;
            font-size: 14px;
            color: #333;
          }
          .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .button:hover {
            background: #5568d3;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
          }
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎉 Congratulations!</h1>
          <p>Your Peer Supporter Application Has Been Approved</p>
        </div>
        
        <div class="content">
          <p>Dear <strong>${fullName}</strong>,</p>
          
          <p>We are thrilled to inform you that your application to become a Peer Supporter at AUI Wellbeing Hub has been <strong>approved</strong>!</p>
          
          <p>Your account has been automatically created. Below are your login credentials:</p>
          
          <div class="credentials-box">
            <div class="credential-item">
              <span class="credential-label">📧 Email:</span>
              <span class="credential-value">${email}</span>
            </div>
            <div class="credential-item">
              <span class="credential-label">🔑 Password:</span>
              <span class="credential-value">${password}</span>
            </div>
          </div>
          
          <div class="warning">
            <strong>⚠️ Important Security Notice:</strong>
            <p>Please change your password immediately after your first login for security purposes. This is a temporary password.</p>
          </div>
          
          <div style="text-align: center;">
            <a href="${loginUrl}" class="button">Login to Your Account</a>
          </div>
          
          <h3>Next Steps:</h3>
          <ul>
            <li>Log in using the credentials provided above</li>
            <li>Change your password in your profile settings</li>
            <li>Complete your peer supporter profile</li>
            <li>Familiarize yourself with the platform and guidelines</li>
            <li>Start supporting your fellow students!</li>
          </ul>
          
          <p>As a peer supporter, you now have access to:</p>
          <ul>
            <li>Private support chat rooms</li>
            <li>Peer room management tools</li>
            <li>Student support requests dashboard</li>
            <li>Training resources and guidelines</li>
          </ul>
          
          <p>Thank you for your commitment to supporting the wellbeing of your fellow students. We're excited to have you on our team!</p>
          
          <p>If you have any questions or need assistance, please don't hesitate to reach out to the Wellbeing Hub administration.</p>
          
          <p>Best regards,<br>
          <strong>AUI Wellbeing Hub Team</strong></p>
          
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© ${new Date().getFullYear()} AUI Wellbeing Hub. Al Akhawayn University in Ifrane.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Dear ${fullName},

Congratulations! Your application to become a Peer Supporter at AUI Wellbeing Hub has been APPROVED!

Your account has been automatically created. Below are your login credentials:

Email: ${email}
Password: ${password}

IMPORTANT: Please change your password immediately after your first login for security purposes.

Login here: ${loginUrl}

Next Steps:
1. Log in using the credentials provided above
2. Change your password in your profile settings
3. Complete your peer supporter profile
4. Familiarize yourself with the platform and guidelines
5. Start supporting your fellow students!

As a peer supporter, you now have access to:
- Private support chat rooms
- Peer room management tools
- Student support requests dashboard
- Training resources and guidelines

Thank you for your commitment to supporting the wellbeing of your fellow students!

Best regards,
AUI Wellbeing Hub Team
    `,
  };
};

const getRejectionEmailTemplate = (
  fullName: string,
  reason: string
) => {
  return {
    subject: 'Update on Your Peer Supporter Application',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .info-box {
            background: white;
            border-left: 4px solid #6c757d;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Peer Supporter Application Update</h1>
        </div>
        
        <div class="content">
          <p>Dear <strong>${fullName}</strong>,</p>
          
          <p>Thank you for your interest in becoming a Peer Supporter at AUI Wellbeing Hub and for taking the time to submit your application.</p>
          
          <p>After careful consideration, we regret to inform you that we are unable to move forward with your application at this time.</p>
          
          <div class="info-box">
            <strong>Reason:</strong>
            <p>${reason}</p>
          </div>
          
          <p>Please know that this decision does not diminish the value of your willingness to support your peers. We encourage you to:</p>
          
          <ul>
            <li>Continue to engage with the Wellbeing Hub as a student user</li>
            <li>Gain more experience in peer support through other campus initiatives</li>
            <li>Consider reapplying in the future if circumstances change</li>
          </ul>
          
          <p>We appreciate your understanding and your commitment to student wellbeing. If you have any questions about this decision, please feel free to contact the Wellbeing Hub administration.</p>
          
          <p>Thank you again for your interest, and we wish you all the best in your endeavors.</p>
          
          <p>Sincerely,<br>
          <strong>AUI Wellbeing Hub Team</strong></p>
          
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>If you have questions, please contact the Wellbeing Hub administration.</p>
            <p>© ${new Date().getFullYear()} AUI Wellbeing Hub. Al Akhawayn University in Ifrane.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Dear ${fullName},

Thank you for your interest in becoming a Peer Supporter at AUI Wellbeing Hub.

After careful consideration, we regret to inform you that we are unable to move forward with your application at this time.

Reason: ${reason}

Please know that this decision does not diminish the value of your willingness to support your peers. We encourage you to:
- Continue to engage with the Wellbeing Hub as a student user
- Gain more experience in peer support through other campus initiatives
- Consider reapplying in the future if circumstances change

Thank you again for your interest.

Sincerely,
AUI Wellbeing Hub Team
    `,
  };
};

// Send approval email with credentials
export const sendApprovalEmail = async (
  fullName: string,
  email: string,
  password: string
): Promise<boolean> => {
  try {
    console.log('📧 Attempting to send approval email...');
    console.log('   To:', email);
    console.log('   From:', process.env.EMAIL_USER);
    console.log('   SMTP Host:', process.env.EMAIL_HOST);
    console.log('   SMTP Port:', process.env.EMAIL_PORT);
    
    const transporter = createTransporter();
    const loginUrl = process.env.FRONTEND_URL 
      ? `${process.env.FRONTEND_URL}/login`
      : 'http://localhost:5173/login';

    const emailContent = getApprovalEmailTemplate(fullName, email, password, loginUrl);

    console.log('📨 Sending email via SMTP...');
    const info = await transporter.sendMail({
      from: `"AUI Wellbeing Hub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    console.log(`✅ Approval email sent successfully to ${email}`);
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response);
    return true;
  } catch (error: any) {
    console.error('❌ Error sending approval email:', error);
    console.error('   Error details:', error.message);
    if (error.code) console.error('   Error code:', error.code);
    if (error.command) console.error('   Failed command:', error.command);
    return false;
  }
};

// Send rejection email
export const sendRejectionEmail = async (
  fullName: string,
  email: string,
  reason: string
): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    const emailContent = getRejectionEmailTemplate(fullName, reason);

    await transporter.sendMail({
      from: `"AUI Wellbeing Hub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    console.log(`✅ Rejection email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending rejection email:', error);
    return false;
  }
};

// Generate a random secure password
export const generateSecurePassword = (length: number = 12): string => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  
  const allChars = lowercase + uppercase + numbers + symbols;
  
  let password = '';
  // Ensure at least one character from each category
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};
