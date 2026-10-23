export class TicketDto {
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
}

export class TicketWithIdDto extends TicketDto {
  id: string;
}

export class OrderResponseDto {
  total: number;
  items: TicketWithIdDto[];
}

export class CreateOrderDto {
  email: string;
  phone: string;
  tickets: TicketDto[];
}
