import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateOrderDto, TicketDto } from './dto/order.dto';
import { OrderResponseDto } from './dto/order.dto';
import { FilmsRepository } from '../repository/film.repository';
import { toOrderResponse, toPlace } from '../repository/order.converter';

@Injectable()
export class OrderService {
  constructor(
    @Inject(FilmsRepository) private readonly filmsRepository: FilmsRepository,
  ) {}

  async create(dto: CreateOrderDto): Promise<OrderResponseDto> {
    const groups = new Map<string, TicketDto[]>();
    for (const ticket of dto.tickets) {
      const key = `${ticket.film}:${ticket.session}`;
      const group = groups.get(key) ?? [];
      group.push(ticket);
      groups.set(key, group);
    }

    for (const [key, tickets] of groups) {
      const separatorIndex = key.indexOf(':');
      const filmId = key.slice(0, separatorIndex);
      const sessionId = key.slice(separatorIndex + 1);

      const schedule = await this.filmsRepository.findScheduleByFilmId(filmId);
      const session = schedule?.find((s) => s.id === sessionId);
      if (!session) {
        throw new NotFoundException(
          `Сеанс ${sessionId} фильма ${filmId} не найден`,
        );
      }

      const places = tickets.map(toPlace);
      if (new Set(places).size !== places.length) {
        throw new BadRequestException(
          'В заказе указано одно и то же место дважды',
        );
      }

      const busy = places.filter((place) => session.taken.includes(place));
      if (busy.length) {
        throw new BadRequestException(
          `Места уже заняты: ${busy.join(', ')} в сеансе ${sessionId}`,
        );
      }

      const invalid = places.find((place) => {
        const [row, seat] = place.split(':').map(Number);
        return (
          row < 1 || row > session.rows || seat < 1 || seat > session.seats
        );
      });
      if (invalid) {
        throw new BadRequestException(
          `Место ${invalid} не существует в сеансе ${sessionId}`,
        );
      }

      const updated = await this.filmsRepository.occupySeats(
        filmId,
        sessionId,
        places,
      );
      if (!updated) {
        throw new BadRequestException(
          `Одно из мест уже занято в сеансе ${sessionId}`,
        );
      }
    }

    return toOrderResponse(dto.tickets);
  }
}
