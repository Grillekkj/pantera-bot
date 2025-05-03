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
import { GamesHistoryModule } from './modules/games-history/games-history.module';
import { OfficialStoreModule } from './modules/official-store/official-store.module';
import { MatchAlertsScheduleModule } from './modules/match-alerts-schedule/match-alerts-schedule.module';
import { TWURPLE_AUTH_PROVIDER, TwurpleAuthModule } from '@nestjs-twurple/auth';
import { TwurpleChatModule } from '@nestjs-twurple/chat';
import { RefreshingAuthProvider } from '@twurple/auth';
import { TwitchClientModule } from './infra/twitch-client/twitch-client.module';
import { TwitchAiChatModule } from './modules/twitch-ai-chat/twitch-ai-chat.module';

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
    TwurpleAuthModule.registerAsync({
      isGlobal: true,
      useFactory: () => {
        return {
          type: 'refreshing',
          clientId: String(environment.twitch.CLIENT_ID),
          clientSecret: String(environment.twitch.CLIENT_SECRET),
        };
      },
    }),
    TwurpleChatModule.registerAsync({
      isGlobal: true,
      inject: [TWURPLE_AUTH_PROVIDER],
      useFactory: (authProvider: RefreshingAuthProvider) => {
        const tokenBot = {
          accessToken: String(environment.twitch.ACCESS_TOKEN),
          refreshToken: String(environment.twitch.REFRESH_TOKEN),
          expiresIn: 3600,
          obtainmentTimestamp: Date.now(),
          scope: ['chat:read', 'chat:edit'],
        };
        authProvider.addUser(String(environment.twitch.USER_ID), tokenBot, [
          'chat',
        ]);
        return {
          authProvider,
          isAlwaysMod: true,
          requestMembershipEvents: true,
        };
      },
    }),
    TwitchClientModule,
    WhatsappClientModule,
    GeminiClientModule,
    FuriaAiChatModule,
    Draft5ScrapperModule,
    LatestNewsModule,
    GamesHistoryModule,
    OfficialStoreModule,
    MatchAlertsScheduleModule,
    TwitchAiChatModule,
  ],
  providers: [AppService],
})
export class AppModule {}
