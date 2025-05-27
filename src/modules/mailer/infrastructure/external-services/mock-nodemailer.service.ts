import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MockNodemailerService {
  private from: string = 'mock@example.com';
  private sentEmails: Array<{
    to: string;
    subject: string;
    html: string;
    attachments?: any[];
  }> = [];

  constructor(private configService: ConfigService) {}

  async sendEmail(options: {
    to: string;
    subject: string;
    html: string;
    attachments?: any[];
  }) {
    this.sentEmails.push(options);

    return Promise.resolve();
  }

  createEmailTemplate(content: string, title: string = 'Notificación'): string {
    return `
      <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        body {
           font-family: Arial, sans-serif;
           line-height: 1.6;
           color: #4a3f35;
           max-width: 600px;
           margin: 0 auto;
           padding: 20px;
         }
        .email-container {
          background-color: #f9f5f0;
          border-radius: 8px;
          padding: 20px;
        }
        .email-header {
          background-color: #6f4e37; /* Color café en lugar de azul */
          color: white;
          padding: 10px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .email-body {
          background-color: white;
          padding: 20px;
          border-radius: 0 0 8px 8px;
        }
        .button {
          display: inline-block;
          background-color: #6f4e37; /* Botón color café */
          color: #ffffff;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 4px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>${title}</h1>
        </div>
        <div class="email-body">
          ${content}
        </div>
      </div>
    </body>
    </html>
    `;
  }

  getEmails() {
    return this.sentEmails;
  }

  clearEmails() {
    this.sentEmails = [];
  }
}
