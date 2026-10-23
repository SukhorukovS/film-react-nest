import { Film } from '../films/entities/film.entity';
import { FilmSchedule } from '../films/entities/schedule.entity';
import {
  FilmDto,
  FilmsResponseDto,
  ScheduleDto,
  ScheduleResponseDto,
} from '../films/dto/films.dto';

export function toFilmDto(film: Film): FilmDto {
  return {
    id: film.id,
    rating: film.rating,
    director: film.director,
    tags: film.tags ?? [],
    image: film.image,
    cover: film.cover,
    title: film.title,
    about: film.about,
    description: film.description,
  };
}

export function toFilmsResponse(films: Film[]): FilmsResponseDto {
  const items = films.map(toFilmDto);
  return { total: items.length, items };
}

export function toScheduleDto(schedule: FilmSchedule): ScheduleDto {
  return {
    id: schedule.id,
    daytime: schedule.daytime,
    hall: schedule.hall,
    rows: schedule.rows,
    seats: schedule.seats,
    price: schedule.price,
    taken: schedule.taken ?? [],
  };
}

export function toScheduleResponse(
  schedule: FilmSchedule[],
): ScheduleResponseDto {
  const items = schedule.map(toScheduleDto);
  return { total: items.length, items };
}
