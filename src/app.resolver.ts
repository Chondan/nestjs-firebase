import { Query, Field, ObjectType, Resolver } from '@nestjs/graphql';

@ObjectType()
export class App {
  @Field(() => String)
  name: string;

  @Field(() => String)
  msg: string;
}

@Resolver()
export class AppResolver {
  @Query(() => App, { name: 'app' })
  app(): App {
    return { name: 'app', msg: 'Hello World!' };
  }
}
