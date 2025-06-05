import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_NAMED_OPTIONS, NamedOptions } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { GraphQLConfigService } from './config.service';

export function createApolloOptions(
  httpLink: HttpLink,
  apiUrl: string = 'http://localhost:3001',
  marketSurveyUrl: string = 'http://localhost:3002'
): NamedOptions {
  return {
    api: {
      link: httpLink.create({
        uri: `${apiUrl}/graphql`
      }),
      cache: new InMemoryCache({
        typePolicies: {
          SurveyTemplate: {
            fields: {
              responses: {
                merge: false
              }
            }
          },
          SurveyResponse: {
            fields: {
              answers: {
                merge: false
              }
            }
          }
        }
      }),
      defaultOptions: {
        watchQuery: {
          errorPolicy: 'all'
        },
        query: {
          errorPolicy: 'all'
        }
      }
    },
    marketSurvey: {
      link: httpLink.create({
        uri: `${marketSurveyUrl}/graphql`
      }),
      cache: new InMemoryCache({
        typePolicies: {
          SurveyTemplate: {
            fields: {
              responses: {
                merge: false
              }
            }
          }
        }
      }),
      defaultOptions: {
        watchQuery: {
          errorPolicy: 'all'
        },
        query: {
          errorPolicy: 'all'
        }
      }
    }
  };
}

@NgModule({
  imports: [ApolloModule],
  providers: [
    GraphQLConfigService,
    {
      provide: APOLLO_NAMED_OPTIONS,
      useFactory: createApolloOptions,
      deps: [HttpLink]
    }
  ],
  exports: [ApolloModule]
})
export class VoxerGraphQLModule {}

