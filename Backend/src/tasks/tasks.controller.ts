import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateProjectDto } from './dto/create-project-dto';
import { UpdateProjectDto } from './dto/update-project-dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AssignTaskDto } from './dto/assign-task-dto';
import { RemoveUserTaskDto } from './dto/remover-user-task-dto';
import { CreateSubtaskDto } from './dto/create-subtask-dto';
import { AssignSubTaskDto } from './dto/assign-subtask-dto';
import { JwtAuthGuard } from 'src/Guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('projects/:email')
  async getProjects(@Param('email') email: string) {
    const res = await this.tasksService.getUserProjects(email);
    return res;
  }

  @Get('all-tasks/:email')
  async getAllTasks(@Param('email') email:string){
    const res = await this.tasksService.getAllUserTasks(email);
    return res;
  }

  @Get('project-members/:projectId')
  async getProjectMembers(@Param('projectId') projectId: string) {
    const res = await this.tasksService.getAllProjectMembers(projectId);
    return res;
  }

  @Get('assigned-tasks/:userId/:date')
  async getUserTasksByDate(
    @Param('userId') userId: string,
    @Param('date') date: string,
  ) {
    const res = await this.tasksService.getUserTasksByDate(userId, date);
    return res;
  }

  @Get('project-tasks/:projectId')
  async getTasksByProject(@Param('projectId') projectId: string) {
    const res = await this.tasksService.getTasksByProject(projectId);
    return res;
  }

  @Post('create-project')
  createProject(@Body() createProjectDto: CreateProjectDto) {
    const res = this.tasksService.createProject(createProjectDto);
    return res;
  }

  @Post('create-task')
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    const res = await this.tasksService.createTask(createTaskDto);
    return res;
  }

  @Post('create-subtask')
  async createSubtask(@Body() createSubtaskDto: CreateSubtaskDto) {
    const res = await this.tasksService.crateSubtask(createSubtaskDto);
    return res;
  }

  @Patch('update-project/:id')
  async updateProject(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return await this.tasksService.updateProject(id, updateProjectDto);
  }

  @Patch('update-task/:id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return await this.tasksService.updateTask(id, updateTaskDto);
  }

  @Post('assign-task')
  async assignTask(@Body() assignTaskDto: AssignTaskDto) {
    const res = await this.tasksService.assignTask(assignTaskDto);
    return res;
  }

  @Post('assign-subtask')
  async assignSubtask(@Body() assignSubtaskDto: AssignSubTaskDto) {
    const res = await this.tasksService.assignSubTask(assignSubtaskDto);
    return res;
  }

  @Delete('remove-user-task')
  async removeUserFromTask(@Query() query: RemoveUserTaskDto) {
    const { userId, taskId } = query;
    return await this.tasksService.removeUserFromTask(userId, taskId);
  }

  @Delete('delete-project/:id')
  async deleteProject(@Param('id') id: string) {
    return await this.tasksService.deleteProject(id);
  }

  @Delete('delete-task/:id')
  async deleteTask(@Param('id') id: string) {
    return await this.tasksService.deleteTask(id);
  }

  @Delete('delete-subtask/:id')
  async deleteSubtask(@Param('id') id: string) {
    return await this.tasksService.deleteSubtask(id);
  }

  @Post('send-project-invitation')
  async sendProjectInvitation(
    @Body() { projectId, to }: { projectId: string; to: string },
  ) {
    const res = await this.tasksService.sendProjectInvitation(projectId, to);
    return res;
  }

  @Post('join-project')
  async joinProject(
    @Body() { projectId, memberId }: { projectId: string; memberId: string },
  ) {
    const res = await this.tasksService.joinProject(projectId, memberId);
    return res;
  }
}
