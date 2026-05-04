import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendMailActiveAccount(email: string, token: string) {
    const appName = this.configService.get<string>('APP_NAME') ?? 'Uni Crypto';
    const activationBaseUrl =
      this.configService.get<string>('ACTIVATION_URL') ??
      this.configService.get<string>('CLIENT_URL') ??
      this.configService.get<string>('ADMIN_URL') ??
      'http://localhost:3000/activate-account';

    const activationUrl = `${activationBaseUrl}${
      activationBaseUrl.includes('?') ? '&' : '?'
    }token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

    await this.mailerService.sendMail({
      to: email,
      subject: `Activate your ${appName} account`,
      template: 'activation',
      context: {
        appName,
        email,
        token,
        activationUrl,
        supportEmail:
          this.configService.get<string>('MAIL_USER') ??
          'support@uni-crypto.local',
        currentYear: new Date().getFullYear(),
      },
    });
  }
}
