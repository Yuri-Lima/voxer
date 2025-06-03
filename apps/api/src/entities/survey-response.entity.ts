import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { Respondent } from './respondent.entity';
import { SurveyTemplate } from './survey-template.entity';

export enum ResponseStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

registerEnumType(ResponseStatus, {
  name: 'ResponseStatus',
});

@Entity('survey_responses')
@ObjectType()
export class SurveyResponse {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id!: string;

  @Column()
  @Field()
  @IsUUID()
  surveyTemplateId!: string;

  @ManyToOne(() => SurveyTemplate, template => template.responses)
  @JoinColumn({ name: 'surveyTemplateId' })
  @Field(() => SurveyTemplate)
  surveyTemplate!: SurveyTemplate;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  respondentId?: string;

  @ManyToOne(() => Respondent, respondent => respondent.responses, { nullable: true })
  @JoinColumn({ name: 'respondentId' })
  @Field(() => Respondent, { nullable: true })
  respondent?: Respondent;

  @Column('jsonb')
  @Field(() => String)
  answers!: Record<string, any>; // Respostas em formato JSON

  @Column({
    type: 'enum',
    enum: ResponseStatus,
    default: ResponseStatus.IN_PROGRESS,
  })
  @Field(() => ResponseStatus)
  @IsEnum(ResponseStatus)
  status!: ResponseStatus;

  @Column('jsonb', { nullable: true })
  @Field(() => String, { nullable: true })
  @IsOptional()
  metadata?: Record<string, any>; // Metadados adicionais (IP, user agent, etc.)

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  sessionId?: string; // Para rastrear sessões anônimas

  @Column({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  completedAt?: Date;

  @CreateDateColumn()
  @Field()
  createdAt!: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt!: Date;
}

