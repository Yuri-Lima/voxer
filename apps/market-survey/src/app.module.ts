import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { join } from 'path';

import { MarketSurveyModule } from './modules/survey/market-survey.module';
import { TemplateModule } from './modules/template/template.module';

// Entidades compartilhadas (referenciando a API principal)
import { SurveyTemplate } from '../../../apps/api/src/entities/survey-template.entity';
import { SurveyResponse } from '../../../apps/api/src/entities/survey-response.entity';
import { Respondent } from '../../../apps/api/src/entities/respondent.entity';

@Module({
  imports: [
    // Configuração de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configuração GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'apps/market-survey/src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
      context: ({ req, res }: { req: any; res: any }) => ({ req, res }),
    }),

    // Configuração TypeORM (conecta ao mesmo ban    // Configuração TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: './voxer_studio.db',
        entities: [Respondent, SurveyTemplate, SurveyResponse],
        synchronize: true, // Para desenvolvimento
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    // HTTP Module para comunicação com API principal
    HttpModule,

    // Módulos da aplicação
    MarketSurveyModule,
    TemplateModule,
  ],
})
export class AppModule {}

