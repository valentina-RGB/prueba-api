import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TemplateService {
  private templateDir: string;
  private cssPath: string;
  private cssContent: string;

  constructor() {
    this.templateDir = path.join(
      process.cwd(),
      'src',
      'modules',
      'mailer',
      'infrastructure',
      'templates',
    );

    this.cssPath = path.join(this.templateDir, 'email-style.css');

    this.cssContent = fs.existsSync(this.cssPath)
      ? fs.readFileSync(this.cssPath, 'utf8')
      : '';
  }

  loadTemplate(templateName: string, context: Record<string, any>): string {
    try {
      const templatePath = path.join(this.templateDir, `${templateName}.html`);
      let template = fs.readFileSync(templatePath, 'utf8');

      template = this.injectCss(template, this.cssContent);

      return this.replaceVariables(template, context);
    } catch (error) {
      console.error(`Error loading template ${templateName}:`, error);
      throw new Error(`Template ${templateName} not found`);
    }
  }

  private injectCss(template: string, css: string): string {
    const styleTag = `<style>${css}</style>`;
    if (template.includes('</head>')) {
      return template.replace('</head>', `${styleTag}\n</head>`);
    } else {
      return `${styleTag}\n${template}`;
    }
  }

  private replaceVariables(
    template: string,
    context: Record<string, any>,
  ): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return context[key] || match;
    });
  }
}
