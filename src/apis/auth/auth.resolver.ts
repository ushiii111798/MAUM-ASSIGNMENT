import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { IContext } from 'src/common/types';
import { UseGuards } from '@nestjs/common';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/common/auth/gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() ctx: IContext,
  ) {
    return this.authService.login({ email, password, res: ctx.res });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async logout(@Context() ctx: IContext) {
    return this.authService.logout({ req: ctx.req, res: ctx.res });
  }

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String, { description: 'restore access token' })
  async restore(@Context() ctx: IContext) {
    return this.authService.getAccessToken({ user: ctx.req.user });
  }
}
