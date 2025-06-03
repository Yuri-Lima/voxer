import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { IsString, IsOptional, IsEnum, MaxLength, IsBoolean } from 'class-validator';
import { SurveyResponse } from './survey-response.entity';
import { User } from './user.entity';

export enum SurveyType {
  MARKET_RESEARCH = 'market_research',
  CUSTOMER_SATISFACTION = 'customer_satisfaction',
  EMPLOYEE_FEEDBACK = 'employee_feedback',
  PRODUCT_FEEDBACK = 'product_feedback',
  GENERAL = 'general',
}

export enum SurveyStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  CLOSED = 'closed',
}

registerEnumType(SurveyType, {
  name: 'SurveyType',
});

registerEnumType(SurveyStatus, {
  name: 'SurveyStatus',
});

@Entity('survey_templates')
@ObjectType()
export class SurveyTemplate {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id!: string;

  @Column()
  @Field()
  @IsString()
  @MaxLength(255)
  title!: string;

  @Column('text', { nullable: true })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Column({
    type: 'enum',
    enum: SurveyType,
    default: SurveyType.GENERAL,
  })
  @Field(() => SurveyType)
  @IsEnum(SurveyType)
  type!: SurveyType;

  @Column({
    type: 'enum',
    enum: SurveyStatus,
    default: SurveyStatus.DRAFT,
  })
  @Field(() => SurveyStatus)
  @IsEnum(SurveyStatus)
  status!: SurveyStatus;

  @Column('jsonb')
  @Field(() => String)
  schema!: Record<string, any>; // Schema dinâmico dos campos

  @Column('jsonb', { nullable: true })
  @Field(() => String, { nullable: true })
  @IsOptional()
  settings?: Record<string, any>; // Configurações adicionais

  @Column({ default: false })
  @Field()
  @IsBoolean()
  isPublic!: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  createdById?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'createdById' })
  @Field(() => User, { nullable: true })
  createdBy?: User;

  @OneToMany(() => SurveyResponse, response => response.surveyTemplate)
  @Field(() => [SurveyResponse], { nullable: true })
  responses?: SurveyResponse[];

  @CreateDateColumn()
  @Field()
  createdAt!: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt!: Date;
}

