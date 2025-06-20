import { IsEmail, IsString } from "class-validator";

export class RemoveUserTaskDto{
    @IsEmail()
    userId:string
    @IsString()
    taskId:string
}