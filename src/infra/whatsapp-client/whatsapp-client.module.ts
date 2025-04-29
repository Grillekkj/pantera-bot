import { Module } from '@nestjs/common';
import { WhatsappClientService } from './service/whatsapp-client.service';
import { UsersEntity } from './entity/whatsapp-client-users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  providers: [WhatsappClientService],
  exports: [WhatsappClientService],
})
export class WhatsappClientModule {}
