import { CalendarEvent } from '../api-client'

export type DateObject = {
  date: Date;
  parsedDate: string;
}

export type DailyEventsObject = {
  [key: string]: CalendarEvent[];
}

export type TableRowObject = {
  date: string;
  numberOfEvents: number;
  totalDuration: number;
  longestEvent: string;
}