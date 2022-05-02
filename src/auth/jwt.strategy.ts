/* is an enjectable class */

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./dto/jwt-payload.interface";
import { User } from "./User.entity";
import { UsersRepository } from "./users.repository";

/* needs to be provided and exported in the module file */
@Injectable()
export class JwStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    /* get access to the current .env file */
    private configService: ConfigService
  ) {
    super({
      /* needs to match the same one from the module file */
      secretOrKey: configService.get<string>("JWT_SECRET"),
      /* beares token is the most common away to handle jwt */
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  /* handle the validation of users, and puts the user information (row from the user table) in req.user */
  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    const user: User = await this.usersRepository.findOne({ username });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
