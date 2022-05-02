import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload.interface';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  /* hash with salt the user password input and store it in the database*/
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    /* if a database constrain is not meet like username being unic it will throw an error, you can catch it and handle it with a nest error response */
    try {
      return await this.usersRepository.createUser(authCredentialsDto);
    } catch (error) {
      const isDuplicateUsername = error.code === '23505';
      if (isDuplicateUsername) {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  /* find the user account by username, and compare the db hash password and user password string with bcrypt compare method */
  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    // find the user by username
    const user = await this.usersRepository.findOne({ username });

    /* compare the user inputed password with the database password and see if bcrypt compare can matche it*/
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('please check your credentials');
    }
  }
}
