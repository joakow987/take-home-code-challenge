import { CalendarEvent, getCalendarEvents } from '../api-client';
import { DateObject, CalendarEventsPerDay, TableRowObject } from './helpers-types';

class Helpers {
  /**
  * Creates an array of DateObjects containing 7 dates starting from today
  * @returns Array of DateObjects
  */
  getEventsDatesArray(): DateObject[] {
    const datesArray = [];
    const today = new Date(Date.now());

    for (let i = 0; i < 7; i++) {
      let date = new Date();
      date.setDate(today.getDate() + i);
      let parsedDate = new Intl.DateTimeFormat().format(date)
      datesArray.push({ date, parsedDate })
    }
    return datesArray;
  }

  /**
  * Counts the number of events for a given day
  * @param dailyCalendarEventsArray Array of CalendarEvents objects for a given day
  * @returns Number of events for a given day
  */
  countDailyNumberOfEvents(dailyCalendarEventsArray: CalendarEvent[]): number {
    return dailyCalendarEventsArray.length;
  }

  /**
   * Counts the events total duration for a given day
   * @param dailyCalendarEventsArray Array of CalendarEvents objects for a given day
   * @returns Events total duration for a given day
   */
  countDailyTotalDuration(dailyCalendarEventsArray: CalendarEvent[]) {
    let dailyTotalDuration = 0;

    dailyCalendarEventsArray.forEach((event: CalendarEvent) => {
      dailyTotalDuration += event.durationInMinutes
    });

    return dailyTotalDuration;
  }

  /**
  * Finds the longest event for a given day
  * @param dailyCalendarEventsArray Array of CalendarEvents objects for a given day
  * @returns Title of the longest event for a given day
  */
  findLongestEvent(dailyCalendarEventsArray: CalendarEvent[]) {
    const longestEvent = dailyCalendarEventsArray.reduce(
      (max: CalendarEvent, event: CalendarEvent) => event.durationInMinutes > max.durationInMinutes ? event : max)
    return longestEvent.title;
  }

  /**
    * Gets events data for each day from the 7-days period
    * @returns Promise when resolved returns an array of DailyEventsObjects
    */
  async getEventsDataForEachDate(): Promise<CalendarEventsPerDay[]> {
    const eventDates = this.getEventsDatesArray();
    let dailyEventsObjectsArray: CalendarEventsPerDay[] = [];

    for (let i = 0; i < eventDates.length; i++) {
      const { date, parsedDate } = eventDates[i];
      const dailyCalendarEventsArray = await getCalendarEvents(date);
      let dailyCalendarEventsObject: CalendarEventsPerDay = {};
      dailyCalendarEventsObject[parsedDate] = dailyCalendarEventsArray;
      dailyEventsObjectsArray.push(dailyCalendarEventsObject);
    }
    return dailyEventsObjectsArray;
  }

  /**
    * Gets table rows data
    * @returns Promise when resolved returns an array of TableRowsObjects
    */
  async getTableRowsData(): Promise<TableRowObject[]> {
    const tableWithoutTotal: TableRowObject[] = [];
    const tableWithTotal: TableRowObject[] = [];
    const dailyEventsObjectsArray = await this.getEventsDataForEachDate();

    dailyEventsObjectsArray.forEach(dailyEventsObject => {
      for (let date in dailyEventsObject) {
        const numberOfEvents = this.countDailyNumberOfEvents(dailyEventsObject[date]);
        const totalDuration = this.countDailyTotalDuration(dailyEventsObject[date]);
        const longestEvent = this.findLongestEvent(dailyEventsObject[date]);
        tableWithoutTotal.push({ date, numberOfEvents, totalDuration, longestEvent })
      }
    })
    tableWithTotal.push(...tableWithoutTotal)
    tableWithTotal.push(this.getTotalsRow(tableWithoutTotal))
    return tableWithTotal;
  }

  getTotalsRow(tableData: TableRowObject[]) {
    let finalRow: TableRowObject = { date: 'Total', numberOfEvents: 0, totalDuration: 0, longestEvent: '' }

    tableData.forEach(row => {
      finalRow.numberOfEvents += row.numberOfEvents
      finalRow.totalDuration += row.totalDuration
    })

    finalRow.longestEvent = tableData.reduce(
      (max: TableRowObject, day: TableRowObject) => day.totalDuration > max.totalDuration ? day : max).longestEvent;

    return finalRow;
  }
}

const helpers = new Helpers();
export default helpers;