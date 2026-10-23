import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { FilmsRepository } from '../repository/film.repository';
import {
  toFilmsResponse,
  toScheduleResponse,
} from '../repository/film.converter';
import { FilmsResponseDto, ScheduleResponseDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FilmsRepository) private readonly filmsRepository: FilmsRepository,
  ) {}

  async findAll(): Promise<FilmsResponseDto> {
    const films = await this.filmsRepository.findAll();
    return toFilmsResponse(films);
  }

  async getSchedule(filmId: string): Promise<ScheduleResponseDto> {
    const schedule = await this.filmsRepository.findScheduleByFilmId(filmId);
    if (!schedule) {
      throw new NotFoundException(`Фильм с id ${filmId} не найден`);
    }
    return toScheduleResponse(schedule);
  }
}
