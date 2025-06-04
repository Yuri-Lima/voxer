import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { MarketSurveyService } from '../../services/market-survey.service';
import { MarketSurveyResolver } from './market-survey.resolver';
import { SurveyTemplate, SurveyResponse, Respondent } from '@voxer/api';

@Module({
  imports: [
    TypeOrmModule.forFeature([SurveyTemplate, SurveyResponse, Respondent]),
    HttpModule,
  ],
  providers: [MarketSurveyService, MarketSurveyResolver],
  exports: [MarketSurveyService],
})
export class MarketSurveyModule { }

