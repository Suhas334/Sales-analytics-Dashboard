const { sendResetEmail } = require('./utils/emailService');

const testEmail = async () => {
    const email = 'suhasparitala33@gmail.com'; // User's email from context or ask usage
    const name = 'Test Verification User';
    const resetToken = 'TEST_TOKEN_12345';

    console.log(`Attempting to send test email to ${email}...`);

    try {
        await sendResetEmail(email, name, resetToken);
        console.log('Test email sent successfully!');
    } catch (error) {
        console.error('Failed to send test email:', error);
    }
};

testEmail();
