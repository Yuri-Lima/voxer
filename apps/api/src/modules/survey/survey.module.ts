import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyService } from './survey.service';
import { SurveyResolver } from './survey.resolver';
import { SurveyTemplate } from '../../entities/survey-template.entity';
import { SurveyResponse } from '../../entities/survey-response.entity';
import { Respondent } from '../../entities/respondent.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SurveyTemplate, SurveyResponse, Respondent]),
  ],
  providers: [SurveyService, SurveyResolver],
  exports: [SurveyService],
})
export class SurveyModule {}

