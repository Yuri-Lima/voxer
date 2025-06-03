import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService, EMAIL_PROVIDER } from './email.service';
import { NodemailerAdapter } from './adapters/nodemailer.adapter';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: EMAIL_PROVIDER,
      useClass: NodemailerAdapter,
    },
    EmailService,
  ],
  exports: [EmailService],
})
export class EmailModule {}

