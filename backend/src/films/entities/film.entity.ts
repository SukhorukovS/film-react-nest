import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { FilmSchedule, FilmScheduleSchema } from './schedule.entity';

@Schema()
export class Film {
  @Prop({ required: true })
  id: string;

  @Prop()
  rating: number;

  @Prop()
  director: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  image: string;

  @Prop()
  cover: string;

  @Prop()
  title: string;

  @Prop()
  about: string;

  @Prop()
  description: string;

  @Prop({ type: () => [FilmScheduleSchema], default: [] })
  schedule: FilmSchedule[];
}

export const FilmSchema = SchemaFactory.createForClass(Film);
