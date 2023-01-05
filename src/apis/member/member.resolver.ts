import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { Member } from './entities/member.entity';
import { IContext } from 'src/common/types';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { AuthService } from '../auth/auth.service';

@Resolver()
export class MemberResolver {
  constructor(
    private readonly memberService: MemberService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Member, { description: 'fetching login user detail' })
  async fetchMember(@Context() ctx: IContext) {
    return await this.memberService.findMember({ email: ctx.req.user.email });
  }

  @Mutation(() => Member, { description: 'create new member' })
  async createMember(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return await this.memberService.createMember({ email, password });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Member, {
    description:
      'update login user password / require previous password as prev and new password as next',
  })
  async updatePassword(
    @Context() ctx: IContext,
    @Args('prev', { description: 'previous password' }) prev: string,
    @Args('next', { description: 'new password' }) next: string,
  ) {
    return await this.memberService.updatePassword({
      email: ctx.req.user.email,
      prev,
      next,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Member)
  async updateEmail(
    @Context() ctx: IContext,
    @Args('prev', { description: 'previous email' }) prev: string,
    @Args('next', { description: 'new email' }) next: string,
  ) {
    return await this.memberService.updateEmail({
      prev,
      next,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean, {
    description: 'delete login user / automatic logout',
  })
  async deleteMember(@Context() ctx: IContext) {
    this.authService.logout({ req: ctx.req, res: ctx.res });
    return await this.memberService.deleteMember({ email: ctx.req.user.email });
  }
}
