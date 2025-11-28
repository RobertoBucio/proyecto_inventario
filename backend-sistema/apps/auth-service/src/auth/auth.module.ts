import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'CLAVE_SECRETA_SUPER_SEGURA', // En producción usa variables de entorno
      signOptions: { expiresIn: '1h' }, // La sesión dura 1 hora
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}