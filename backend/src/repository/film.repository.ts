import { Film } from '../films/entities/film.entity';
import { FilmSchedule } from '../films/entities/schedule.entity';

export abstract class FilmsRepository {
  abstract findAll(): Promise<Film[]>;

  abstract findScheduleByFilmId(filmId: string): Promise<FilmSchedule[] | null>;
}
