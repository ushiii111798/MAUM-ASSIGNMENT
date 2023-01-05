import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reply } from './entities/reply.entity';
import { Member } from '../member/entities/member.entity';
import { Board } from '../board/entities/board.entity';
import { ReplyResolver } from './reply.resolver';
import { ReplyService } from './reply.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reply, Member, Board])],
  providers: [ReplyResolver, ReplyService],
})
export class ReplyModule {}
