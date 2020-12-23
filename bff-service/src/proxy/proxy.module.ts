import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';
import { ConfigModule } from '@nestjs/config';

const MINUTE = 60;

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    CacheModule.register({ ttl: 2 * MINUTE }),
  ],
  controllers: [ProxyController],
  providers: [ProxyService],
})
export class ProxyModule {}
