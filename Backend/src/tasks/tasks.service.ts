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
import { AssignTaskDto } from './dto/assign-task-dto';
import { CreateSubtaskDto } from './dto/create-subtask-dto';
import { AssignSubTaskDto } from './dto/assign-subtask-dto';
import { UpdateSubTaskDto } from './dto/update-subtask-dto';

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
        include: {
          project: {
            include: { owner: { select: { uid: true, uname: true } } },
          },
        },
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

  async getAllProjectMembers(projectId: string) {
    try {
      const projectMembers = await this.prisma.userProjects.findMany({
        where: { projectId: projectId },
        include: {
          user: {
            select: {
              uname: true,
              uid: true,
            },
          },
        },
      });
      return projectMembers;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to get project members',
          error: error.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllUserTasks(userId:string){
    try{
      const user = await this.prisma.user.findUnique({where:{
        uid:userId
      }});

      if(!user) throw new NotFoundException('User not found');

      const tasks = await  this.prisma.userTasks.findMany({
        where:{
          userId:userId
        },
        include:{
          tasks:true
        }
      });

      return {tasks}


    }catch(error){
      if(error instanceof HttpException) throw error;
      throw new HttpException(
        {
          message: 'Failed to get user tasks',
          error: error.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async getUserTasksByDate(userId: string, date: string) {
    try {
      const dateObj = new Date(date);
      const tasks = await this.prisma.$queryRaw`
  SELECT t.*
  FROM "Task" t
  JOIN "UserTasks" ta ON ta."taskId" = t."tid"
  WHERE ta."userId" = ${userId}
    AND DATE(t."startDate") = DATE(${dateObj.toISOString()})
`;

      return tasks;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to get user tasks',
          error: error.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTasksByProject(projectId: string) {
    try {
      const project = await this.prisma.project.findUnique({
        where: {
          pid: projectId,
        },
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      const tasks = await this.prisma.task.findMany({
        where: {
          projectId: projectId,
        },
        include: {
          UserTasks: true,
        },
      });

      return tasks;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          message: 'Failed to get tasks',
          error: error.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSubtasks(taskId: string) {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT 
        t.tid AS task_id,
        t.title AS task_title,
        s.sid AS subtask_id,
        s.title AS subtask_title,
        s.status AS subtask_status
      FROM 
        "tasks" t
      JOIN 
        "subtasks" s ON t.tid = s.taskId
      WHERE 
        t.tid = ${taskId};
    `;
      console.log('Result:', result);
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch subtasks: ${error.message}`);
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

  async createTask(createTaskDto: CreateTaskDto) {
    const data = {
      tname: createTaskDto.taskName,
      description: createTaskDto.description,
      startDate: createTaskDto.startDate
        ? new Date(createTaskDto.startDate)
        : new Date(),
      dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
      projectId: createTaskDto.projectId,
      ownerId: createTaskDto.ownerId,
      priority: createTaskDto.priority,
    };

    try {
      const project = await this.prisma.project.findUnique({
        where: { pid: createTaskDto.projectId },
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }
      const task = await this.prisma.task.create({ data });
      const userTask = await this.prisma.userTasks.create({
        data: {
          userId: createTaskDto.ownerId,
          taskId: task.tid,
        },
      });
      return { message: 'Task created successfully', task };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          message: 'Failed to create task',
          error: error.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async crateSubtask(createSubtaskDto: CreateSubtaskDto) {
    try {
      const task = await this.prisma.task.findUnique({
        where: { tid: createSubtaskDto.taskId },
      });
      if (!task) {
        throw new NotFoundException('Task not found');
      }

      const data = {
        tname: createSubtaskDto.subtaskName,
        description: createSubtaskDto.description,
        startDate: createSubtaskDto.startDate
          ? new Date(createSubtaskDto.startDate)
          : new Date(),
        dueDate: createSubtaskDto.dueDate
          ? new Date(createSubtaskDto.dueDate)
          : null,
        ownerId: createSubtaskDto.ownerId,
        taskId: createSubtaskDto.taskId,
        priority: createSubtaskDto.priority,
      };

      const subtask = await this.prisma.subtask.create({ data });
      const userSubtasks = await this.prisma.userSubTasks.create({
        data: {
          userId: createSubtaskDto.ownerId,
          subTaskId: subtask.sid,
        },
      });

      return { message: 'Subtask created successfully', subtask };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          message: 'Failed to create subtask',
          error: error.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateTask(taskId: string, updateTaskDto: UpdateTaskDto) {
    try {
      const task = await this.prisma.task.findUnique({
        where: { tid: taskId },
      });

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      if (updateTaskDto.startDate)
        updateTaskDto.startDate = new Date(updateTaskDto.startDate);
      if (updateTaskDto.dueDate)
        updateTaskDto.dueDate = new Date(updateTaskDto.dueDate);

      const data = {
        tname: updateTaskDto.taskName,
        description: updateTaskDto.description,
        startDate: updateTaskDto.startDate,
        dueDate: updateTaskDto.dueDate,
        priority: updateTaskDto.priority,
        status: updateTaskDto.status,
      };

      const updated = await this.prisma.task.update({
        where: { tid: taskId },
        data,
      });

      return {
        message: 'Task updated successfully',
        updatedTask: updated,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          message: 'Failed to update task',
          error: error.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateSubTask(subTaskId: string, updateSubTaskDto: UpdateSubTaskDto) {
    try {
      const subTask = await this.prisma.subtask.findUnique({
        where: { sid: subTaskId },
      });

      if (!subTask) {
        throw new NotFoundException('Sub Task not found');
      }

      if (updateSubTaskDto.startDate)
        updateSubTaskDto.startDate = new Date(updateSubTaskDto.startDate);
      if (updateSubTaskDto.dueDate)
        updateSubTaskDto.dueDate = new Date(updateSubTaskDto.dueDate);

      const data = {
        tname: updateSubTaskDto.subtaskName,
        description: updateSubTaskDto.description,
        startDate: updateSubTaskDto.startDate,
        dueDate: updateSubTaskDto.dueDate,
        priority: updateSubTaskDto.priority,
        status: updateSubTaskDto.status,
      };

      const updated = await this.prisma.subtask.update({
        where: { sid: subTaskId },
        data,
      });

      return {
        message: 'Sub-Task updated successfully',
        updatedTask: updated,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          message: 'Failed to update sub-task',
          error: error.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async assignTask(assignTaskDto: AssignTaskDto) {
    try {
      const task = await this.prisma.task.findUnique({
        where: { tid: assignTaskDto.taskId },
      });

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      const users = await this.prisma.user.findMany({
        where: { uid: { in: assignTaskDto.userIds } },
      });

      if (users.length !== assignTaskDto.userIds.length) {
        throw new NotFoundException('One or more users not found');
      }

      const userTasks = await this.prisma.userTasks.createMany({
        data: assignTaskDto.userIds.map((uid) => {
          return {
            userId: uid,
            taskId: assignTaskDto.taskId,
          };
        }),
      });

      return {
        message: 'Task assigned successfully',
        userTasks,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          message: 'Failed to assign task',
          error: error.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async assignSubTask(assignSubTaskDto: AssignSubTaskDto) {
    try {
      const task = await this.prisma.subtask.findUnique({
        where: { sid: assignSubTaskDto.subTaskId },
      });

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      const users = await this.prisma.user.findMany({
        where: { uid: { in: assignSubTaskDto.userIds } },
      });

      if (users.length !== assignSubTaskDto.userIds.length) {
        throw new NotFoundException('One or more users not found');
      }

      const userTasks = await this.prisma.userSubTasks.createMany({
        data: assignSubTaskDto.userIds.map((uid) => {
          return {
            userId: uid,
            subTaskId: assignSubTaskDto.subTaskId,
          };
        }),
      });

      return {
        message: 'Sub Task assigned successfully',
        userTasks,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          message: 'Failed to assign sub task',
          error: error.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeUserFromTask(userId: string, taskId: string) {
    try {
      const userTask = await this.prisma.userTasks.findUnique({
        where: {
          userId_taskId: {
            userId: userId,
            taskId: taskId,
          },
        },
      });

      if (!userTask) {
        throw new NotFoundException('User not found in task');
      }

      const deleted = await this.prisma.userTasks.delete({
        where: {
          userId_taskId: {
            userId: userId,
            taskId: taskId,
          },
        },
      });

      return {
        message: 'User removed from task successfully',
        deleted,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          message: 'Failed to remove user from task',
          error: error.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async updateProject(projectId: string, updateProjectDto: UpdateProjectDto) {
    try {
      const project = await this.prisma.project.findUnique({
        where: { pid: projectId },
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      if (updateProjectDto.startDate)
        updateProjectDto.startDate = new Date(updateProjectDto.startDate);
      if (updateProjectDto.dueDate)
        updateProjectDto.dueDate = new Date(updateProjectDto.dueDate);

      const updated = await this.prisma.project.update({
        where: { pid: projectId },
        data: updateProjectDto,
      });

      return {
        message: 'Project updated successfully',
        updatedProject: updated,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          message: 'Failed to update project',
          error: error.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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

  async deleteProject(projectId: string) {
    try {
      const project = await this.prisma.project.findUnique({
        where: { pid: projectId },
      });

      if(!project)
        throw new HttpException('Project does not exist', HttpStatus.NOT_FOUND);

      const deleted = await this.prisma.project.delete({
        where: { pid: projectId },
      });
      return { message: 'Project deleted successfully', deleted }
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          message: 'Failed to delete project',
          error: error.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteTask(taskId: string) {
    try {
      const task = await this.prisma.task.findUnique({
        where: { tid: taskId },
      })

      if(!task)
        throw new HttpException('Task does not exist', HttpStatus.NOT_FOUND);

      const deleted = await this.prisma.task.delete({
        where: { tid: taskId },
      });
      return { message: 'Task deleted successfully', deleted }
    } catch (error) {
      if(error instanceof HttpException) throw error;

      throw new HttpException(
        {
          message: 'Failed to delete task',
          error: error.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteSubtask(subtaskId: string) {
    try {
      const subTask = await this.prisma.subtask.findUnique({
        where: { sid: subtaskId },
      });

      if(!subTask)
        throw new HttpException('Subtask does not exist', HttpStatus.NOT_FOUND);

      const deleted = await this.prisma.subtask.delete({
        where: { sid: subtaskId },
      });
      return { message: 'Subtask deleted successfully', deleted }
    } catch (error) {
      if(error instanceof HttpException) throw error;
      
      throw new HttpException(
        {
          message: 'Failed to delete subtask',
          error: error.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
