import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export const createNodemailerTransport = (configService: ConfigService) => {
  return nodemailer.createTransport({
    host: configService.get<string>('EMAIL_HOST', 'smtp.gmail.com'),
    port: configService.get<number>('EMAIL_PORT', 587),
    secure: configService.get<boolean>('EMAIL_SECURE', false),
    auth: {
      user: configService.get<string>('EMAIL_USER'),
      pass: configService.get<string>('EMAIL_PASS'),
    },
  });
};
