import { randomUUID } from 'node:crypto';

import {
  OrderResponseDto,
  TicketDto,
  TicketWithIdDto,
} from '../order/dto/order.dto';

export function toPlace(ticket: TicketDto): string {
  return `${ticket.row}:${ticket.seat}`;
}

export function toOrderResponse(tickets: TicketDto[]): OrderResponseDto {
  const items: TicketWithIdDto[] = tickets.map((ticket) => ({
    ...ticket,
    id: randomUUID(),
  }));
  return { total: items.length, items };
}
