import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  process.env.AUTH_REFRESH_GUARD,
) {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        const cookie = req.headers.cookie;
        const splitCookie = cookie.split(' ');
        let target = 0;
        for (let i = 0; i < splitCookie.length; i++) {
          if (splitCookie[i].includes('refreshToken=')) target = i;
        }
        const refreshToken = splitCookie[target].replace('refreshToken=', '');
        return refreshToken;
      },
      secretOrKey: process.env.REFRESH_TOKEN_KEY,
      ignoreExpiration: false,
    });
  }

  validate(payload) {
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
