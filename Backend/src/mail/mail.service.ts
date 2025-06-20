import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { ProjectInvitationDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });
  async sendMail(mail: CreateMailDto) {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: mail.to,
      subject: mail.subject,
      text: mail.text,
    });
  }

  async sendProjectInvitation(mail: ProjectInvitationDto) {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: mail.to,
      subject: mail.subject,
      text: mail.text + ' ' + mail.projectId,

    });
  }
}
