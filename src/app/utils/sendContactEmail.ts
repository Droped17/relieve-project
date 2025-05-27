import fs from 'fs';
import path from 'path';
import { sendEmail } from '../lib/mailer';

export const sendContactEmail = async ({
  to,
  subject,
  username,
  actionUrl,
  transactionId
}: {
  to: string;
  subject: string;
  username: string;
  actionUrl: string;
  transactionId: string;
}) => {
  const filePath = path.join(process.cwd(), 'src/app/emailTemplates', 'booking.html');
  let html = fs.readFileSync(filePath, 'utf8');

  html = html.replace(/{{username}}/g, username);
  html = html.replace(/{{actionUrl}}/g, actionUrl);
  html = html.replace(/{{transactionId}}/g, transactionId)

  await sendEmail({
    to,
    subject,
    html,
  });
};
