import 'dotenv/config';
import nodemailer from 'nodemailer';

async function sendMailTest(receivers, subject: string, html: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_PASSWORD,
        },
    });
    // receivers가 아이디로 주어져도 이메일 값의 리스트로 변환도 service를 써서 가능할 것 같다.
    const receiversEmail = receivers.join(', ');

    const mailOptions = {
        from: process.env.MAIL_ID,
        to: receiversEmail,
        subject,
        html,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(info);
}
export { sendMailTest };
