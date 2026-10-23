import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Film, FilmSchema } from './entities/film.entity';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmsRepository } from '../repository/film.repository';
import { MongooseFilmsRepository } from '../repository/mongoose-films.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  controllers: [FilmsController],
  providers: [
    FilmsService,
    {
      provide: FilmsRepository,
      useClass: MongooseFilmsRepository,
    },
  ],
  exports: [FilmsRepository],
})
export class FilmsModule {}
