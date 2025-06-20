import { IsEmail, IsString,IsArray, ArrayNotEmpty } from "class-validator";


export class AssignTaskDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsEmail({}, { each: true }) 
  userIds: string[];

  @IsString()
  taskId: string;
}