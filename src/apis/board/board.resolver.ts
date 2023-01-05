import { Args, Resolver, Query, Context, Mutation } from '@nestjs/graphql';
import { BoardService } from './board.service';
import { Board } from './entities/board.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { IContext } from 'src/common/types';

@Resolver()
export class BoardResolver {
  constructor(private readonly boardService: BoardService) {}

  @Query(() => Board)
  async fetchBoardDetail(@Args('boardId') boardId: string) {
    return await this.boardService.findBoard({ boardId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Board])
  async fetchMyBoardList(@Context() ctx: IContext) {
    return await this.boardService.findMyBoards({ memberId: ctx.req.user.id });
  }

  @Query(() => [Board])
  async fetchBoardList() {
    return await this.boardService.findBoards();
  }

  @Query(() => [Board])
  async searchBoardList(@Args('keyword') keyword: string) {
    return await this.boardService.searchBoards({ keyword });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board)
  async createBoard(
    @Args('title') title: string,
    @Args('content') content: string,
    @Context() ctx: IContext,
  ) {
    return await this.boardService.createBoard({
      title,
      content,
      memberId: ctx.req.user.id,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board)
  async updateBoard(
    @Args('boardId') boardId: string,
    @Args('title', { nullable: true }) title: string,
    @Args('content', { nullable: true }) content: string,
    @Context() ctx: IContext,
  ) {
    return await this.boardService.updateBoard({
      boardId,
      title,
      content,
      memberId: ctx.req.user.id,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteBoard(
    @Args('boardId') boardId: string,
    @Context() ctx: IContext,
  ) {
    return await this.boardService.deleteBoard({
      boardId,
      memberId: ctx.req.user.id,
    });
  }
}
