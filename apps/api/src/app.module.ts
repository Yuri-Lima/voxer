import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

// Resolver básico
import { AppResolver } from './app.resolver';

// Controllers
import { TestController } from './controllers/test.controller';

// Modules
import { EmailModule } from './modules/email/email.module';

// Entities
import { SurveyTemplate } from './entities/survey-template.entity';
import { SurveyResponse } from './entities/survey-response.entity';
import { Respondent } from './entities/respondent.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    // Configuração de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),

    // Configuração TypeORM com PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'password'),
        database: configService.get('DB_NAME', 'voxer_studio'),
        entities: [SurveyTemplate, SurveyResponse, Respondent, User],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
        ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      }),
      inject: [ConfigService],
    }),

    // Configuração GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
    }),

    // Módulos
    EmailModule,
  ],
  controllers: [TestController],
  providers: [AppResolver],
})
export class AppModule { }

