import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { FilmSchedule } from '../films/entities/schedule.entity';
import { FilmsRepository } from '../repository/film.repository';
import { toOrderResponse, toPlace } from '../repository/order.converter';
import { CreateOrderDto, OrderResponseDto, TicketDto } from './dto/order.dto';

interface SessionTickets {
  filmId: string;
  sessionId: string;
  tickets: TicketDto[];
}

@Injectable()
export class OrderService {
  constructor(
    @Inject(FilmsRepository) private readonly filmsRepository: FilmsRepository,
  ) {}

  async create(dto: CreateOrderDto): Promise<OrderResponseDto> {
    const sessionTickets = this.groupTicketsBySession(dto.tickets);

    for (const { filmId, sessionId, tickets } of sessionTickets) {
      const session = await this.findSession(filmId, sessionId);

      this.assertSeatsNotDuplicated(tickets);
      this.assertSeatsExist(tickets, session);

      const places = tickets.map(toPlace);
      const isOccupied = await this.filmsRepository.occupySeats(
        filmId,
        sessionId,
        places,
      );
      if (!isOccupied) {
        throw new BadRequestException(`Места уже заняты в сеансе ${sessionId}`);
      }
    }

    return toOrderResponse(dto.tickets);
  }

  private groupTicketsBySession(tickets: TicketDto[]): SessionTickets[] {
    const groups = new Map<string, SessionTickets>();
    for (const ticket of tickets) {
      const key = `${ticket.film}:${ticket.session}`;
      const group = groups.get(key) ?? {
        filmId: ticket.film,
        sessionId: ticket.session,
        tickets: [],
      };
      group.tickets.push(ticket);
      groups.set(key, group);
    }
    return [...groups.values()];
  }

  private async findSession(
    filmId: string,
    sessionId: string,
  ): Promise<FilmSchedule> {
    const schedule = await this.filmsRepository.findScheduleByFilmId(filmId);
    const session = schedule?.find(({ id }) => id === sessionId);
    if (!session) {
      throw new NotFoundException(
        `Сеанс ${sessionId} фильма ${filmId} не найден`,
      );
    }
    return session;
  }

  private assertSeatsNotDuplicated(tickets: TicketDto[]): void {
    const places = tickets.map(toPlace);
    const hasDuplicates = new Set(places).size !== places.length;
    if (hasDuplicates) {
      throw new BadRequestException(
        'В заказе указано одно и то же место дважды',
      );
    }
  }

  private assertSeatsExist(tickets: TicketDto[], session: FilmSchedule): void {
    const invalid = tickets.find(
      (ticket) =>
        ticket.row < 1 ||
        ticket.row > session.rows ||
        ticket.seat < 1 ||
        ticket.seat > session.seats,
    );
    if (invalid) {
      throw new BadRequestException(
        `Место ${toPlace(invalid)} не существует в сеансе ${session.id}`,
      );
    }
  }
}
