import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReplyService } from './reply.service';
import { REPLY_TYPE, Reply } from './entities/reply.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { IContext } from 'src/common/types';

@Resolver()
export class ReplyResolver {
  constructor(private readonly replyService: ReplyService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Reply])
  async fetchMyReplies(@Context() ctx: IContext) {
    return await this.replyService.fetchRepliesByMemberId({
      memberId: ctx.req.user.id,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Reply)
  async createReply(
    @Context() ctx: IContext,
    @Args('content') content: string,
    @Args('boardId') boardId: string,
    @Args('type', {
      nullable: true,
      description:
        'if you are creating primary reply, type is not necessary(if entered =MASTER), but if you are creating secondary reply, type is necessary(=SLAVE)',
    })
    type: REPLY_TYPE,
    @Args('masterReplyId', {
      nullable: true,
      description: 'this is only needed when reply type is SLAVE',
    })
    masterReplyId: string,
  ) {
    if (!type && masterReplyId) {
      type = REPLY_TYPE.SLAVE;
    }
    return await this.replyService.createReply({
      content,
      boardId,
      memberId: ctx.req.user.id,
      type,
      masterReplyId,
    });
  }

  @Query(() => [Reply], { description: 'fetch master replies by board id' })
  async fetchRepliesByBoardId(@Args('boardId') boardId: string) {
    return await this.replyService.fetchMasterRepliesByBoardId({
      boardId,
    });
  }

  @Query(() => [Reply])
  async fetchSlaveReplies(@Args('masterReplyId') masterReplyId: string) {
    return await this.replyService.fetchSlaveReplies({
      masterReplyId,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Reply)
  async updateReply(
    @Context() ctx: IContext,
    @Args('replyId') replyId: string,
    @Args('content') content: string,
  ) {
    return await this.replyService.updateReply({
      replyId,
      memberId: ctx.req.user.id,
      content,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteReply(
    @Context() ctx: IContext,
    @Args('replyId') replyId: string,
  ) {
    return await this.replyService.deleteReply({
      replyId,
      memberId: ctx.req.user.id,
    });
  }
}
