import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateProjectDto } from './dto/create-project-dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { ProjectInvitationDto } from 'src/mail/dto/create-mail.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateProjectDto } from './dto/update-project-dto';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async getUserProjects(userId: string) {
    try {
      const userProjects = await this.prisma.userProjects.findMany({
        where: { userId: userId },
        include: { project: true },
      });
      console.log(userProjects);
      return userProjects;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to get user projects',
          error: error.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createProject(createProjectDto: CreateProjectDto) {
    const data = {
      pname: createProjectDto.title,
      description: createProjectDto.description,
      startDate: createProjectDto.startDate
        ? new Date(createProjectDto.startDate)
        : new Date(),
      dueDate: createProjectDto.endDate
        ? new Date(createProjectDto.endDate)
        : null,
      ownerId: createProjectDto.userId,
    };
    try {
      const project = await this.prisma.project.create({ data });
      const userProject = await this.prisma.userProjects.create({
        data: {
          userId: createProjectDto.userId,
          projectId: project.pid,
          role: 'OWNER',
        },
      });
      return { message: 'Project created successfully', project };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to create project',
          error: error.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProject(projectId: string, updateProjectDto: UpdateProjectDto) {
  const project = await this.prisma.project.findUnique({
    where: { pid: projectId },
  });

  if (!project) {
    throw new NotFoundException('Project not found');
  }

  if (updateProjectDto.startDate) updateProjectDto.startDate = new Date(updateProjectDto.startDate);
  if (updateProjectDto.dueDate) updateProjectDto.dueDate = new Date(updateProjectDto.dueDate);

  const updated = await this.prisma.project.update({
    where: { pid: projectId },
    data: updateProjectDto,
  });

  return {
    message: 'Project updated successfully',
    updatedProject: updated,
  };
}


  async sendProjectInvitation(projectId: string, memberId: string) {
    const mailObj = {
      to: memberId,
      subject: 'Project Invitation',
      text: 'You have been invited to join a project with project id: ',
      projectId: projectId,
    };

    const mail = plainToInstance(ProjectInvitationDto, mailObj);
    const errors = await validate(mail);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    try {
      await this.mailService.sendProjectInvitation(mail);
      return { message: 'Invitation sent successfully' };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to send invitation email',
          error: error.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async joinProject(projectId: string, memberId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { uid: memberId },
      });
      if (!user)
        throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
      const existingUserProject = await this.prisma.userProjects.findUnique({
        where: {
          userId_projectId: {
            userId: memberId,
            projectId: projectId,
          },
        },
      });
      if (existingUserProject) {
        throw new HttpException(
          'User already joined the project',
          HttpStatus.CONFLICT,
        );
      }
      const project = await this.prisma.project.findUnique({
        where: { pid: projectId },
      });
      if (!project)
        throw new HttpException('Project does not exist', HttpStatus.NOT_FOUND);
      const userProject = await this.prisma.userProjects.create({
        data: {
          userId: memberId,
          projectId: projectId,
          role: 'MEMBER',
        },
      });
      return { message: 'Joined project successfully', userProject };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'Failed to join project',
          error: error.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
