import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String)
  hello(): string {
    return 'Hello from Voxer Studio API!';
  }

  @Query(() => String)
  status(): string {
    return 'API is running successfully';
  }
}

