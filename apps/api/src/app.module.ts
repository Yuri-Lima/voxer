import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

// Resolver básico
import { AppResolver } from './app.resolver';

// Controllers
import { TestController } from './controllers/test.controller';

// Modules
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [
    // Configuração de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
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
export class AppModule {}

