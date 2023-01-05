import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../member/entities/member.entity';
import { JwtAccessStrategy } from 'src/common/auth/jwt-access.strategy';
import { JwtRefreshStrategy } from 'src/common/auth/jwt-refresh.strategy';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([Member])],
  providers: [JwtAccessStrategy, JwtRefreshStrategy, AuthResolver, AuthService],
})
export class AuthModule {}
