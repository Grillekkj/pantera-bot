import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import typeorm from './configs/typeorm';
import { environment } from './configs/environment';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhatsappClientModule } from './infra/whatsapp-client/whatsapp-client.module';
import { GeminiClientModule } from './infra/gemini-client/gemini-client.module';
import { FuriaAiChatModule } from './modules/furia-ai-chat/furia-ai-chat.module';
import { Draft5ScrapperModule } from './modules/draft5-scrapper/draft5-scrapper.module';
import { LatestNewsModule } from './modules/latest-news/latest-news.module';

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
    FuriaAiChatModule,
    Draft5ScrapperModule,
    LatestNewsModule,
  ],
  providers: [AppService],
})
export class AppModule {}
