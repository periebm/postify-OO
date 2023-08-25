import { Module } from '@nestjs/common';
import { MediasService } from './medias.service';
import { MediasController } from './medias.controller';
import { MediasRepository } from './medias.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { PublicationsRepository } from '../publications/publications.repository';

@Module({
  controllers: [MediasController],
  providers: [MediasService, MediasRepository, PublicationsRepository],
  exports: [MediasService],
  imports: [PrismaModule],
})
export class MediasModule {}
