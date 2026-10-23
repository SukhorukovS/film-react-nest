import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { Film } from '../films/entities/film.entity';
import { FilmSchedule } from '../films/entities/schedule.entity';
import { FilmsRepository } from './film.repository';

@Injectable()
export class MongooseFilmsRepository extends FilmsRepository {
  constructor(@InjectModel(Film.name) private readonly filmModel: Model<Film>) {
    super();
  }

  async findAll(): Promise<Film[]> {
    return this.filmModel.find().lean<Film[]>().exec();
  }

  async findScheduleByFilmId(filmId: string): Promise<FilmSchedule[] | null> {
    const film = await this.filmModel
      .findOne({ id: filmId })
      .lean<Film>()
      .exec();
    return film?.schedule ?? null;
  }

  async occupySeats(
    filmId: string,
    sessionId: string,
    places: string[],
  ): Promise<FilmSchedule | null> {
    const film = await this.filmModel
      .findOneAndUpdate(
        {
          id: filmId,
          schedule: { $elemMatch: { id: sessionId, taken: { $nin: places } } },
        },
        { $push: { 'schedule.$.taken': { $each: places } } },
        { new: true },
      )
      .lean<Film>()
      .exec();

    if (!film) {
      return null;
    }
    return film.schedule?.find(({ id }) => id === sessionId) ?? null;
  }
}
