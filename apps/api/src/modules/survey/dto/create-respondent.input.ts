import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsEmail, MaxLength, IsObject } from 'class-validator';

@InputType()
export class CreateRespondentInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

