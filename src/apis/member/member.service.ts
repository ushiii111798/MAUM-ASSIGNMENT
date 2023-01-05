import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async createMember({ email, password }) {
    if (!email || !password) {
      throw new UnprocessableEntityException('Email and password are required');
    }
    const member = this.memberRepository.create({
      email,
      password: await bcrypt.hash(password, 10),
    });
    return await this.memberRepository.save(member);
  }

  async findMember({ email }) {
    const member = await this.memberRepository
      .createQueryBuilder('member')
      .where('member.email = :email', { email })
      .getOne();
    if (!member) {
      throw new NotFoundException('Member not found');
    }
    return member;
  }

  async updatePassword({ email, prev, next }) {
    const member = await this.findMember({ email });
    if (!(await bcrypt.compare(prev, member.password))) {
      throw new UnprocessableEntityException('Invalid Current Password');
    }
    const updateMember = await this.memberRepository.create({
      ...member,
      password: await bcrypt.hash(next, 10),
    });
    return await this.memberRepository.save(updateMember);
  }

  async updateEmail({ prev, next }) {
    if (prev === next) {
      throw new UnprocessableEntityException('Emails are the same');
    }
    const member = await this.findMember({ email: prev });
    const updateMember = await this.memberRepository.create({
      ...member,
      email: next,
    });
    return await this.memberRepository.save(updateMember);
  }

  async deleteMember({ email }) {
    const member = await this.findMember({ email });
    const result = await this.memberRepository.delete(member);
    return result.affected ? true : false;
  }
}
