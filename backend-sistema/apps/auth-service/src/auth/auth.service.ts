import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // 1. Registrar usuario (Encriptar contraseña)
  async register(userData: any): Promise<User> {
    const { email, password } = userData;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt); // Requisito: Encriptar

    const newUser = this.usersRepository.create({
      email,
      password: hashedPassword,
    });

    return this.usersRepository.save(newUser);
  }

  // 2. Login (Validar y generar Token de sesión)
  async login(credentials: any) {
    const { email, password } = credentials;
    const user = await this.usersRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Generar JWT (Manejo de sesión)
      const payload = { email: user.email, sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }
}