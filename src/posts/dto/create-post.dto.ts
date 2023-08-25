import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  title: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  text: string;

  @IsString()
  @IsUrl()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsOptional()
  image: string;
}
