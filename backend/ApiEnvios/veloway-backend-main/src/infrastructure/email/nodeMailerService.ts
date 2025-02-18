import nodemailer, { type Transporter } from 'nodemailer';

interface EmailOptions {
  to: string
  subject: string
  text?: string
  html?: string
}

export class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER || '"Soporte" <soporte@example.com>',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    await this.transporter.sendMail(mailOptions);
  }
}
