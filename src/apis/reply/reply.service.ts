import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { REPLY_TYPE, Reply } from './entities/reply.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
  ) {}

  async createReply({
    content,
    boardId,
    memberId,
    type = undefined,
    masterReplyId = undefined,
  }) {
    const reply = this.replyRepository.create({
      content,
      board: { id: boardId },
      member: { id: memberId },
      type: type ? type : REPLY_TYPE.MASTER,
      masterReply: masterReplyId ? { id: masterReplyId } : null,
    });
    return await this.replyRepository.save(reply);
  }

  async fetchMasterRepliesByBoardId({ boardId }) {
    const replies = await this.replyRepository
      .createQueryBuilder('reply')
      .leftJoinAndSelect('reply.member', 'member')
      .leftJoinAndSelect('reply.board', 'board')
      .where('board.id = :boardId', { boardId })
      .andWhere('reply.type = :type', { type: REPLY_TYPE.MASTER })
      .andWhere('reply.masterReply IS NULL')
      .getMany();
    return replies;
  }

  async fetchSlaveReplies({ masterReplyId }) {
    return await this.replyRepository
      .createQueryBuilder('reply')
      .leftJoinAndSelect('reply.member', 'member')
      .leftJoinAndSelect('reply.board', 'board')
      .leftJoinAndSelect('reply.masterReply', 'masterReply')
      .where('reply.masterReply IS NOT NULL')
      .andWhere('masterReply.id = :masterReplyId', { masterReplyId })
      .getMany();
  }

  async fetchRepliesByMemberId({ memberId }) {
    return await this.replyRepository
      .createQueryBuilder('reply')
      .leftJoinAndSelect('reply.member', 'member')
      .leftJoinAndSelect('reply.board', 'board')
      .where('member.id = :memberId', { memberId })
      .getMany();
  }

  async updateReply({ replyId, memberId, content }) {
    const reply = await this.replyRepository.findOne({
      where: { id: replyId },
      relations: {
        member: true,
      },
    });
    if (reply.member.id !== memberId) {
      throw new Error('You are not the owner of this reply');
    }
    const updateReply = this.replyRepository.create({
      ...reply,
      content,
    });

    return await this.replyRepository.save(updateReply);
  }

  async deleteReply({ replyId, memberId }) {
    const reply = await this.replyRepository.findOne({
      where: { id: replyId },
      relations: {
        member: true,
      },
    });
    if (reply.member.id !== memberId) {
      throw new Error('You are not the owner of this reply');
    }
    const result = await this.replyRepository.softDelete(reply);
    return result.affected > 0 ? true : false;
  }
}
