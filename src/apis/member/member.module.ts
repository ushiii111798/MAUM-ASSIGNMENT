import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { MemberResolver } from './member.resolver';
import { MemberService } from './member.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  providers: [MemberResolver, MemberService, AuthService, JwtService],
})
export class MemberModule {}
