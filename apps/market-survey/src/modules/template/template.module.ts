import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateService } from './template.service';
import { SurveyTemplate } from '../../../../../apps/api/src/entities/survey-template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyTemplate])],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}

