import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Film, FilmSchema } from './entities/film.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  controllers: [FilmsController],
  providers: [FilmsService],
})
export class FilmsModule {}
