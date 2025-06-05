# GraphQL Codegen Implementation Guide

## Overview

This document provides a comprehensive guide for the GraphQL Codegen implementation in the Voxer monorepo. The setup includes type-safe GraphQL operations, Angular service generation, and multi-service support.

## Implementation Summary

### ✅ Completed Features

1. **GraphQL Codegen Dependencies Installed**
   - `@graphql-codegen/cli` - Main CLI tool
   - `@graphql-codegen/typescript` - TypeScript types generation
   - `@graphql-codegen/typescript-operations` - Operation types
   - `@graphql-codegen/typescript-apollo-angular` - Angular services
   - `@graphql-codegen/introspection` - Schema introspection
   - `@graphql-codegen/fragment-matcher` - Fragment matching

2. **Shared Library Structure**
   - Created `libs/graphql/src/generated/` directory structure
   - Organized by service: `api/` and `market-survey/`
   - Centralized exports through `libs/graphql/src/index.ts`

3. **Configuration Files**
   - `codegen.yml` - Main API service configuration
   - `codegen-market-survey.yml` - Market Survey service configuration
   - Separate configs for different GraphQL endpoints

4. **Angular Integration**
   - Updated `apollo-angular` to version 6.0.0 for Angular 17 compatibility
   - Created `VoxerGraphQLModule` for easy integration
   - Added `GraphQLConfigService` for Apollo client configuration
   - Type-safe GraphQL services generated

5. **Package.json Scripts**
   ```json
   {
     "codegen": "graphql-codegen --config codegen.yml && graphql-codegen --config codegen-market-survey.yml",
     "codegen:api": "graphql-codegen --config codegen.yml",
     "codegen:market-survey": "graphql-codegen --config codegen-market-survey.yml",
     "codegen:watch": "graphql-codegen --config codegen.yml --watch && graphql-codegen --config codegen-market-survey.yml --watch"
   }
   ```

## File Structure

```
voxer/
├── codegen.yml                           # API service codegen config
├── codegen-market-survey.yml             # Market Survey service config
├── libs/
│   └── graphql/
│       ├── package.json                  # Updated with Angular dependencies
│       ├── tsconfig.json                 # TypeScript configuration
│       └── src/
│           ├── index.ts                  # Main exports
│           ├── config.service.ts         # Apollo configuration service
│           ├── graphql.module.ts         # Angular module
│           └── generated/
│               ├── api/
│               │   ├── types.ts          # Generated TypeScript types
│               │   ├── services.ts       # Generated Angular services
│               │   ├── introspection.json
│               │   └── fragment-matcher.ts
│               └── market-survey/
│                   ├── types.ts
│                   ├── services.ts
│                   ├── introspection.json
│                   └── fragment-matcher.ts
├── apps/
│   ├── survey-app/
│   │   └── src/app/graphql/
│   │       ├── queries.ts                # API service queries
│   │       ├── market-survey-queries.ts  # Market Survey queries
│   │       └── test-graphql.component.ts # Test component
│   └── survey-admin/
│       └── src/app/graphql/
│           └── admin-queries.ts          # Admin-specific queries
```

## Usage Examples

### 1. Basic Setup in Angular App

```typescript
// app.module.ts
import { VoxerGraphQLModule } from '@voxer/graphql';

@NgModule({
  imports: [
    VoxerGraphQLModule,
    // other imports
  ],
  // ...
})
export class AppModule {}
```

### 2. Using Generated Services

```typescript
// component.ts
import { Component, OnInit } from '@angular/core';
import { 
  GetStatusGQL, 
  GetHelloGQL,
  GetPublicMarketSurveysGQL 
} from '@voxer/graphql';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-example',
  template: `
    <div>
      <p>API Status: {{ status$ | async }}</p>
      <p>Market Surveys: {{ surveys$ | async | json }}</p>
    </div>
  `
})
export class ExampleComponent implements OnInit {
  status$!: Observable<string>;
  surveys$!: Observable<any[]>;

  constructor(
    private getStatusGQL: GetStatusGQL,
    private getPublicMarketSurveysGQL: GetPublicMarketSurveysGQL
  ) {}

  ngOnInit() {
    // Type-safe API calls
    this.status$ = this.getStatusGQL.watch().valueChanges.pipe(
      map(result => result.data.status)
    );

    this.surveys$ = this.getPublicMarketSurveysGQL.watch().valueChanges.pipe(
      map(result => result.data.publicMarketSurveys)
    );
  }
}
```

### 3. Type-Safe Query Variables

```typescript
import { GetMarketSurveyStatsGQL, GetMarketSurveyStatsQueryVariables } from '@voxer/graphql';

// TypeScript will enforce the correct variable types
const variables: GetMarketSurveyStatsQueryVariables = {
  templateId: 'survey-123'
};

this.statsService.watch(variables).valueChanges.subscribe(result => {
  // result.data is fully typed
  console.log(result.data.marketSurveyStats.totalResponses);
});
```

## Development Workflow

### 1. Adding New Queries

1. Create GraphQL queries in the appropriate files:
   - API queries: `apps/survey-app/src/app/graphql/queries.ts`
   - Market Survey queries: `apps/survey-app/src/app/graphql/market-survey-queries.ts`
   - Admin queries: `apps/survey-admin/src/app/graphql/admin-queries.ts`

2. Run codegen to generate types and services:
   ```bash
   pnpm codegen
   ```

3. Import and use the generated services in your components

### 2. Schema Updates

When GraphQL schemas change:

1. Update the schema files (automatically generated by NestJS)
2. Run codegen to regenerate types:
   ```bash
   pnpm codegen
   ```

3. Update any affected queries or components

### 3. Watch Mode for Development

For continuous development, use watch mode:
```bash
pnpm codegen:watch
```

This will automatically regenerate types when queries or schemas change.

## Configuration Details

### API Service Configuration (codegen.yml)

```yaml
schema: 
  - 'apps/api/src/schema.gql'
documents: 
  - 'apps/survey-app/src/app/graphql/queries.ts'
  - 'apps/survey-admin/src/app/graphql/admin-queries.ts'
generates:
  libs/graphql/src/generated/api/types.ts:
    plugins:
      - typescript
      - typescript-operations
    config:
      scalars:
        DateTime: string
      enumsAsTypes: true
      constEnums: true
      futureProofEnums: true
      
  libs/graphql/src/generated/api/services.ts:
    plugins:
      - typescript
      - typescript-operations
      - typescript-apollo-angular
    config:
      scalars:
        DateTime: string
      enumsAsTypes: true
      constEnums: true
      futureProofEnums: true
      serviceName: 'ApiService'
      serviceProvidedIn: 'root'
      namedClient: 'api'
```

### Market Survey Configuration (codegen-market-survey.yml)

```yaml
schema: 
  - 'apps/market-survey/apps/market-survey/src/schema.gql'
documents: 
  - 'apps/survey-app/src/app/graphql/market-survey-queries.ts'
generates:
  libs/graphql/src/generated/market-survey/types.ts:
    plugins:
      - typescript
      - typescript-operations
    config:
      scalars:
        DateTime: string
      enumsAsTypes: true
      constEnums: true
      futureProofEnums: true
      
  libs/graphql/src/generated/market-survey/services.ts:
    plugins:
      - typescript
      - typescript-operations
      - typescript-apollo-angular
    config:
      scalars:
        DateTime: string
      enumsAsTypes: true
      constEnums: true
      futureProofEnums: true
      serviceName: 'MarketSurveyService'
      serviceProvidedIn: 'root'
      namedClient: 'marketSurvey'
```

## Apollo Client Configuration

The `VoxerGraphQLModule` automatically configures Apollo clients for both services:

- **API Client**: Connected to `http://localhost:3001/graphql`
- **Market Survey Client**: Connected to `http://localhost:3002/graphql`

Both clients include:
- Error handling policies
- Optimized caching strategies
- Type policies for complex types

## Best Practices

### 1. Query Naming

Use descriptive, unique names for queries to avoid conflicts:

```typescript
// Good
export const GET_SURVEY_TEMPLATES_PUBLIC = gql`
  query GetSurveyTemplatesPublic {
    surveyTemplates { ... }
  }
`;

// Avoid
export const GET_SURVEYS = gql`
  query GetSurveys {
    surveyTemplates { ... }
  }
`;
```

### 2. Type Safety

Always use the generated types for variables and responses:

```typescript
import { 
  GetSurveyTemplatePublicQuery,
  GetSurveyTemplatePublicQueryVariables 
} from '@voxer/graphql';

// Type-safe variables
const variables: GetSurveyTemplatePublicQueryVariables = {
  id: 'template-123'
};

// Type-safe response handling
this.service.watch(variables).valueChanges.subscribe(
  (result: ApolloQueryResult<GetSurveyTemplatePublicQuery>) => {
    // result.data is fully typed
    console.log(result.data.surveyTemplate?.title);
  }
);
```

### 3. Error Handling

Use Apollo's error handling capabilities:

```typescript
this.service.watch(variables).valueChanges.subscribe({
  next: (result) => {
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
    }
    // Handle data
  },
  error: (error) => {
    console.error('Network error:', error);
  }
});
```

## Troubleshooting

### Common Issues

1. **Schema Validation Errors**
   - Ensure queries match the actual GraphQL schema
   - Check that all required fields are included
   - Verify scalar types are correctly mapped

2. **Import Errors**
   - Make sure to run `pnpm codegen` after adding new queries
   - Check that the generated files exist in `libs/graphql/src/generated/`
   - Verify the shared library is properly built

3. **Apollo Client Issues**
   - Ensure `VoxerGraphQLModule` is imported in your app module
   - Check that the GraphQL endpoints are accessible
   - Verify named client configuration matches the generated services

### Debugging Commands

```bash
# Regenerate all types and services
pnpm codegen

# Check generated files
ls -la libs/graphql/src/generated/

# Validate GraphQL queries
pnpm codegen --validate

# Build the shared library
pnpm --filter @voxer/graphql build
```

## Next Steps

1. **Expand Query Coverage**: Add more comprehensive queries for all business operations
2. **Add Mutations**: Implement create, update, and delete operations
3. **Subscription Support**: Add real-time subscriptions for live data updates
4. **Error Handling**: Implement comprehensive error handling strategies
5. **Testing**: Add unit tests for generated services and components
6. **Documentation**: Create API documentation from generated schemas

## Conclusion

The GraphQL Codegen implementation provides a robust foundation for type-safe GraphQL operations in the Voxer monorepo. The setup supports multiple GraphQL services, generates Angular-compatible services, and maintains type safety throughout the application stack.

The implementation follows best practices for monorepo organization, dependency management, and Angular integration, providing a scalable solution for the project's GraphQL needs.

