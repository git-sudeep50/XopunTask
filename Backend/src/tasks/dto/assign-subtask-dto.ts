import { IsEmail, IsString,IsArray, ArrayNotEmpty } from "class-validator";


export class AssignSubTaskDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsEmail({}, { each: true }) 
  userIds: string[];

  @IsString()
  subTaskId: string;
}