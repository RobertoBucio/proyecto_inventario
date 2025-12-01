import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';


@Module({
  imports: [
    // Conexión a Base de Datos MySQL
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'switchyard.proxy.rlwy.net',  // Copiado de tu imagen
      port: 48207,                        // Copiado de tu imagen
      username: 'root',                   // Copiado de tu imagen
      password: 'krJTYAegsJHoemOQMVPAsNJtemMpAccj', // <--- Dale a "Show" y pégala aquí
      database: 'railway',                // Copiado de tu imagen
      entities: [User],
      synchronize: true,    
    }),
    AuthModule,
  ],
})
export class AppModule {}