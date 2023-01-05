import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '../member/entities/member.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async createBoard({ title, content, memberId }) {
    const member = await this.memberRepository
      .createQueryBuilder('member')
      .where('member.id = :memberId', { memberId })
      .getOne();

    const board = this.boardRepository.create({
      title,
      content,
      member,
    });

    return await this.boardRepository.save(board);
  }

  async findBoard({ boardId }) {
    return await this.boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.member', 'member')
      .where('board.id = :boardId', { boardId })
      .getOne();
  }

  async findBoards() {
    return await this.boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.member', 'member')
      .getMany();
  }

  async findMyBoards({ memberId }) {
    return await this.boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.member', 'member')
      .where('member.id = :memberId', { memberId })
      .getMany();
  }

  async searchBoards({ keyword }) {
    return await this.boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.member', 'member')
      .where('board.title like :keyword', { keyword: `%${keyword}%` })
      .orWhere('board.content like :keyword', { keyword: `%${keyword}%` })
      .getMany();
  }

  async updateBoard({
    boardId,
    memberId,
    title = undefined,
    content = undefined,
  }) {
    if (!title && !content) {
      throw new UnprocessableEntityException("You can't update nothing");
    }
    const board = await this.boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.member', 'member')
      .where('board.id = :boardId', { boardId })
      .getOne();
    console.log(board);

    if (!board) {
      throw new UnprocessableEntityException('Board not found');
    }
    if (board.member.id !== memberId) {
      throw new UnprocessableEntityException(
        'You are not the owner of this board',
      );
    }
    const boardToUpdate = this.boardRepository.create({
      id: boardId,
      title: title ? title : board.title,
      content: content ? content : board.content,
      member: board.member,
    });

    return await this.boardRepository.save(boardToUpdate);
  }

  async deleteBoard({ boardId, memberId }) {
    const board = await this.boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.member', 'member')
      .where('board.id = :boardId', { boardId })
      .getOne();

    if (!board) {
      throw new UnprocessableEntityException('Board not found');
    }
    if (board.member.id !== memberId) {
      throw new UnprocessableEntityException(
        'You are not the owner of this board',
      );
    }
    const result = await this.boardRepository.softDelete(boardId);
    return result.affected > 0 ? true : false;
  }
}
