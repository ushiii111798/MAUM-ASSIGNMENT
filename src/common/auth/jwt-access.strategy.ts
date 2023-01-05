import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  process.env.AUTH_ACCESS_GUARD,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_KEY,
      passReqToCallback: true,
    });
  }

  validate(req, payload) {
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
