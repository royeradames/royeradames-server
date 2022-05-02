import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    /* needed so that the configService can be user in the authService */
    ConfigModule,
    /* needed imports for setting up jws in nestjs */
    PassportModule.register({ defaultStrategy: 'jwt' }),

    /* without using .env varibles */
    // JwtModule.register({
    //   /* should be store in the enviroment variable */
    //   secret: 'topSecret51',
    //   signOptions: {
    //     /* expires in 1 hour or 3600 seconds */
    //     expiresIn: 3600,
    //   },
    // }),
    /* using .env variables
      The registerAsync uses 3 parameters:
      - imports 
      - inject 
      - useFactory
     */
    JwtModule.registerAsync({
      /* init ConfigModule so that ConfigService is available */
      imports: [ConfigModule],

      /* acts like importing services to be use for injection */
      inject: [ConfigService],

      /* acts like a constructor were you can inject other services */
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          /* expires in 1 hour or 3600 seconds */
          expiresIn: 3600,
        },
      }),
    }),
    TypeOrmModule.forFeature([UsersRepository]),
  ],
  providers: [AuthService, JwStrategy],
  controllers: [AuthController],
  // allow other modules to use the auth logic
  exports: [JwStrategy, PassportModule],
})
export class AuthModule {}
