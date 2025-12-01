import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';


@Module({
  imports: [
    // Conexión a Base de Datos MySQL
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',      // Tu usuario de MySQL (generalmente root)
      password: 'root',          // Tu contraseña de MySQL (si usas XAMPP suele ser vacía)
      database: 'auth_db',   // ¡Asegúrate de crear esta DB en tu MySQL primero!
      entities: [User],
      synchronize: true,     // Crea las tablas automáticamente
    }),
    AuthModule,
  ],
})
export class AppModule {}