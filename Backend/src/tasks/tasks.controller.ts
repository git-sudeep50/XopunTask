import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateProjectDto } from './dto/create-project-dto';
import { UpdateProjectDto } from './dto/update-project-dto';


@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('projects/:email')
  async getProjects(@Param('email') email: string){
    const res = await this.tasksService.getUserProjects(email);
    return res;
  }

  @Post('create-project')
  createProject(@Body() createProjectDto:CreateProjectDto){
    const res = this.tasksService.createProject(createProjectDto);
    return res;
  }

  @Patch('update-project/:id')
  async updateProject(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return await this.tasksService.updateProject(id, updateProjectDto);
  }

  @Post('send-project-invitation')
  async sendProjectInvitation(@Body() {projectId, to}:{projectId:string, to:string}){
    const res = await this.tasksService.sendProjectInvitation(projectId,to);
    return res;
  }

  @Post('join-project')
  async joinProject(@Body() {projectId, memberId}:{projectId:string, memberId:string}){
    const res = await this.tasksService.joinProject(projectId,memberId);
    return res;
  }
}
