import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "568bb4546e77e9",
        pass: "c581daf25b3b93"
    }
});

export const sendEmail = async ({ to, subject, html }: {
    to: string;
    subject: string;
    html: string
}) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html
    };
    return transporter.sendMail(mailOptions)
}