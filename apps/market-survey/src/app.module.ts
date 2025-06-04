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
import { SurveyTemplate, SurveyResponse, Respondent, User } from '@voxer/api';

@Module({
  imports: [
    // Configuração de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),

    // Configuração TypeORM (conecta ao mesmo banco de dados)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'password'),
        database: configService.get('DB_NAME', 'voxer_studio'),
        entities: [Respondent, SurveyTemplate, SurveyResponse, User],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
        ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      }),
      inject: [ConfigService],
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

    // HTTP Module para comunicação com API principal
    HttpModule,

    // Módulos da aplicação
    MarketSurveyModule,
    TemplateModule,
  ],
})
export class AppModule { }

