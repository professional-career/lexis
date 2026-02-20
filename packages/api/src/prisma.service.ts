import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { db } from '@lexis/database';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public client = db;

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
