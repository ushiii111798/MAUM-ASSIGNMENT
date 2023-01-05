import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Member } from '../member/entities/member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async login({ email, password, res }) {
    //LOGGING
    console.log(new Date(), ' | AuthService.login()');
    const member = await this.memberRepository
      .createQueryBuilder('member')
      .where('member.email = :email', { email })
      .getOne();

    if (!member) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    this.setRefreshToken({ user: member, res });
    return this.getAccessToken({ user: member });
  }

  setRefreshToken({ user, res }) {
    //LOGGING
    console.log(new Date(), ' | AuthService.setRefreshToken()');

    const refreshToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { secret: process.env.REFRESH_TOKEN_KEY, expiresIn: '2w' },
    );

    this.setCookie({ res, refreshToken });
  }

  setCookie({ res, refreshToken }) {
    //LOGGING
    console.log(new Date(), ' | AuthService.setCookie()');

    const cookie = `refreshToken=${refreshToken}; path=/;`;
    res.setHeader('Set-Cookie', cookie);

    //LOGGING
    console.log(new Date(), ' | setRefreshToken', refreshToken);
  }

  getAccessToken({ user }) {
    //LOGGING
    console.log(new Date(), ' | AuthService.getAccessToken()');

    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.ACCESS_TOKEN_KEY, expiresIn: '1h' },
    );
  }

  verifyToken({ access, refresh }) {
    //LOGGING
    console.log(new Date(), ' | AuthService.verifyToken()');

    let decodedAccToken = null;
    let decodedRefreshToken = null;
    try {
      decodedAccToken = jwt.verify(access, process.env.ACCESS_TOKEN_KEY);
      decodedRefreshToken = jwt.verify(refresh, process.env.REFRESH_TOKEN_KEY);
    } catch (err) {
      throw new UnauthorizedException(`
          errName: ${err.name}
          message: ${err.message}
          expiredAt: ${err.expiredAt}
        `);
    }
    return { decodedAccToken, decodedRefreshToken };
  }

  async logout({ req, res }) {
    //LOGGING
    console.log(new Date(), ' | AuthService.logout()');

    const access = req.headers['authorization'].replace('Bearer ', '');
    const refresh = req.headers['cookie'].replace('refreshToken=', '');
    if (!access || !refresh) {
      throw new UnauthorizedException('로그아웃 실패');
    }

    res.setHeader('Set-Cookie', `refreshToken=; path=/;`);

    return '로그아웃에 성공했습니다.';
  }
}
