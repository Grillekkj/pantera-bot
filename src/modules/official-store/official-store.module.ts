import { Module } from '@nestjs/common';
import { OfficialStoreService } from './service/official-store.service';
import { WhatsappClientModule } from 'src/infra/whatsapp-client/whatsapp-client.module';

@Module({
  imports: [WhatsappClientModule],
  providers: [OfficialStoreService],
  exports: [OfficialStoreService],
})
export class OfficialStoreModule {}
