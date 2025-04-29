import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import typeorm from './configs/typeorm';
import { environment } from './configs/environment';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhatsappClientModule } from './infra/whatsapp-client/whatsapp-client.module';
import { GeminiClientModule } from './infra/gemini-client/gemini-client.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: environment.db.HOST,
      port: environment.db.PORT,
      password: environment.db.PASSWORD,
      username: environment.db.USER,
      autoLoadEntities: true,
      database: environment.db.NAME,
      synchronize: false,
      logging: ['error', 'warn', 'schema', 'info', 'log'],
    }),
    ConfigModule.forRoot({ isGlobal: true, load: [typeorm] }),
    WhatsappClientModule,
    GeminiClientModule,
  ],
  providers: [AppService],
})
export class AppModule {}
