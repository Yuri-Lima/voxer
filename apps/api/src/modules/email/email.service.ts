import { Injectable, Inject } from '@nestjs/common';
import type { EmailProvider } from './interfaces/email-provider.interface';
import { SendEmailOptions } from './interfaces/email-provider.interface';

export const EMAIL_PROVIDER = 'EMAIL_PROVIDER';

@Injectable()
export class EmailService {
  constructor(
    @Inject(EMAIL_PROVIDER)
    private emailProvider: EmailProvider,
  ) { }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const options: SendEmailOptions = {
      to,
      subject: 'Welcome to Voxer Studio',
      html: `
        <h1>Welcome to Voxer Studio, ${name}!</h1>
        <p>Thank you for joining our survey platform.</p>
        <p>You can now create and manage surveys with our powerful tools.</p>
        <p>Best regards,<br>The Voxer Studio Team</p>
      `,
      text: `Welcome to Voxer Studio, ${name}! Thank you for joining our survey platform.`,
    };

    await this.emailProvider.sendEmail(options);
  }

  async sendSurveyInvitation(to: string, surveyTitle: string, surveyUrl: string): Promise<void> {
    const options: SendEmailOptions = {
      to,
      subject: `You're invited to participate in: ${surveyTitle}`,
      html: `
        <h1>Survey Invitation</h1>
        <p>You have been invited to participate in the following survey:</p>
        <h2>${surveyTitle}</h2>
        <p>Click the link below to start the survey:</p>
        <a href="${surveyUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Start Survey</a>
        <p>Thank you for your participation!</p>
      `,
      text: `You're invited to participate in: ${surveyTitle}. Visit: ${surveyUrl}`,
    };

    await this.emailProvider.sendEmail(options);
  }

  async sendSurveyResponseNotification(to: string, surveyTitle: string, responseId: string): Promise<void> {
    const options: SendEmailOptions = {
      to,
      subject: `New response received for: ${surveyTitle}`,
      html: `
        <h1>New Survey Response</h1>
        <p>A new response has been submitted for your survey:</p>
        <h2>${surveyTitle}</h2>
        <p>Response ID: ${responseId}</p>
        <p>You can view the response details in your admin dashboard.</p>
      `,
      text: `New response received for: ${surveyTitle}. Response ID: ${responseId}`,
    };

    await this.emailProvider.sendEmail(options);
  }

  async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const options: SendEmailOptions = {
      to,
      subject: 'Reset de Senha - Voxer Studio',
      html: `
        <h2>Reset de Senha</h2>
        <p>Você solicitou um reset de senha. Clique no link abaixo para redefinir sua senha:</p>
        <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Redefinir Senha</a>
        <p>Este link expira em 1 hora.</p>
      `,
      text: `Reset de senha: ${resetUrl}`,
    };

    await this.emailProvider.sendEmail(options);
  }

  async sendCustomEmail(options: SendEmailOptions): Promise<void> {
    await this.emailProvider.sendEmail(options);
  }
}

