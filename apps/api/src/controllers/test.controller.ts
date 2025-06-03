import { Controller, Post, Body, Get } from '@nestjs/common';
import { EmailService } from '../modules/email/email.service';

@Controller('test')
export class TestController {
  constructor(private emailService: EmailService) {}

  @Post('email')
  async testEmail(@Body() body: { to: string; name?: string }) {
    try {
      await this.emailService.sendWelcomeEmail(
        body.to,
        body.name || 'Test User'
      );
      return { 
        success: true, 
        message: 'Email sent successfully',
        mailhogUrl: 'http://localhost:8025'
      };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  @Get('email/status')
  async getEmailStatus() {
    return {
      smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        from: process.env.SMTP_FROM,
      },
      mailhog: {
        webInterface: 'http://localhost:8025',
        smtpPort: 1025,
      },
      status: 'configured'
    };
  }
}

