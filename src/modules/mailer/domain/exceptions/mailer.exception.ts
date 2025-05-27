export class MailerException extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'MailerException';
    }
  }