import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsEnum, MaxLength, IsObject } from 'class-validator';
import { SurveyType } from '../../../entities/survey-template.entity';

@InputType()
export class CreateSurveyTemplateInput {
  @Field()
  @IsString()
  @MaxLength(255)
  title!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => SurveyType)
  @IsEnum(SurveyType)
  type!: SurveyType;

  @Field(() => String)
  @IsObject()
  schema!: Record<string, any>;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  createdById?: string;
}

