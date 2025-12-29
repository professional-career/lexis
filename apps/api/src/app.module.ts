import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TestService } from './test/test.service';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.resolve(__dirname, '../../../.env'),
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, TestService],
})
export class AppModule {}
