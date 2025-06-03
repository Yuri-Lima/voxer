import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsEnum, MaxLength, IsObject, IsBoolean } from 'class-validator';
import { SurveyType, SurveyStatus } from '../../../entities/survey-template.entity';

@InputType()
export class UpdateSurveyTemplateInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => SurveyType, { nullable: true })
  @IsOptional()
  @IsEnum(SurveyType)
  type?: SurveyType;

  @Field(() => SurveyStatus, { nullable: true })
  @IsOptional()
  @IsEnum(SurveyStatus)
  status?: SurveyStatus;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsObject()
  schema?: Record<string, any>;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

