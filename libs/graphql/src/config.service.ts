import { Injectable } from '@angular/core';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { Apollo, APOLLO_NAMED_OPTIONS, NamedOptions } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

@Injectable({
  providedIn: 'root'
})
export class GraphQLConfigService {
  constructor(
    private apollo: Apollo,
    private httpLink: HttpLink
  ) {}

  configureApollo(apiUrl: string, marketSurveyUrl: string) {
    // Main API Client
    const apiHttpLink = this.httpLink.create({
      uri: `${apiUrl}/graphql`
    });

    // Market Survey Client
    const marketSurveyHttpLink = this.httpLink.create({
      uri: `${marketSurveyUrl}/graphql`
    });

    // Configure named clients
    const namedOptions: NamedOptions = {
      api: {
        link: apiHttpLink,
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
        link: marketSurveyHttpLink,
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

    // Create named clients
    this.apollo.createNamed(namedOptions);
  }
}

