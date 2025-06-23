import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { CreateSubtaskDto } from './create-subtask-dto';

export class UpdateSubTaskDto extends PartialType(CreateSubtaskDto) {}