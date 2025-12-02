import { Controller, Post, Body, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body);
  }
  @Delete('delete') // Ruta: DELETE /auth/delete
  async deleteAccount(@Body('email') email: string) {
    return this.authService.borrarUsuario(email);
  }
}