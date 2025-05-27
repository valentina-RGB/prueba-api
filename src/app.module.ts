import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppDataSource } from './config/data-source';
import { UsersModule } from './modules/users/users.module';
import { StoreModule } from './modules/stores/stores.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { ImagenModule } from './modules/images/images.module';
import { AlbumModule } from './modules/albums/album.module';
import { AuthModule } from './modules/auth/auth.module';
import { EventModule } from './modules/events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return {
          autoLoadEntities: true,
          ...AppDataSource.options,
        };
      },
    }),
    AuthModule,
    UsersModule,
    StoreModule,
    ImagenModule,
    MailerModule,
    AlbumModule,
    EventModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
