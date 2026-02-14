const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendResetEmail = async (email, name, resetToken) => {
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = {
        name: "Sales Dashboard",
        email: process.env.BREVO_SENDER_EMAIL || "suhasparitala33@gmail.com"
    };
    sendSmtpEmail.to = [{ email: email }];
    sendSmtpEmail.templateId = 1;
    sendSmtpEmail.params = {
        name: name,
        reset_link: resetLink
    };

    console.log('Sending email with params:', JSON.stringify(sendSmtpEmail));

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('BREVO RESPONSE:', JSON.stringify(data));
        return data;
    } catch (error) {
        console.error('BREVO ERROR:', error.response?.body || error);
        throw error;
    }
};

module.exports = { sendResetEmail };
