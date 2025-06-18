import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateProjectDto } from './dto/create-project-dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { ProjectInvitationDto } from 'src/mail/dto/create-mail.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService, private mailService: MailService) {}

  async createProject(createProjectDto:CreateProjectDto){
    const data = {
      pname:createProjectDto.title,
      description:createProjectDto.description,
      startDate:createProjectDto.startDate ? new Date(createProjectDto.startDate) : new Date(),
      dueDate:createProjectDto.endDate ? new Date(createProjectDto.endDate) : null,
      ownerId:createProjectDto.userId
    }
    const project = await this.prisma.project.create({data});
    return {message:"Project created successfully",project};
  }
  
  async sendProjectInvitation(projectId:string,memberId:string){
    const mail:ProjectInvitationDto = {
      to:memberId,
      subject:"Project Invitation",
      text:"You have been invited to join a project",
      projectId:projectId
    }
    await this.mailService.sendProjectInvitation(mail);
    return {message:"Invitation sent successfully"}
  }

  async joinProject(projectId:string,memberId:string){
    
  }

  findAll() {
    return `This action returns all tasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
