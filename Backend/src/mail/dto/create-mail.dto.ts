import { IsEmail, IsString } from "class-validator";
export class CreateMailDto {
    @IsEmail()
    to: string;
    @IsString()
    subject: string;
    @IsString()
    text:string;
}
