import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsOptional, IsUUID, IsObject } from 'class-validator';

@InputType()
export class SubmitSurveyResponseInput {
  @Field(() => ID)
  @IsUUID()
  surveyTemplateId: string;

  @Field(() => String)
  @IsObject()
  answers: Record<string, any>;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  respondentId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

