import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsOptional, IsUUID, IsObject, IsEmail, MaxLength } from 'class-validator';

@InputType()
export class RespondentInfoInput {
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
}

@InputType()
export class SubmitMarketSurveyInput {
  @Field(() => ID)
  @IsUUID()
  templateId!: string;

  @Field(() => String)
  @IsObject()
  answers!: Record<string, any>;

  @Field(() => RespondentInfoInput, { nullable: true })
  @IsOptional()
  respondentInfo?: RespondentInfoInput;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

