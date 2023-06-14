import { GanttView, GanttViewOptions, primaryDatePointTop, secondaryDatePointTop, GanttViewDate } from './view';
import { GanttDate, eachWeekOfInterval, eachDayOfInterval } from '../utils/date';
import { GanttDatePoint } from '../class/date-point';
import { GanttViewType } from '../class';
import { eachHourOfInterval } from 'date-fns';

const viewOptions: GanttViewOptions = {
    cellWidth: 35,
    start: new GanttDate().startOfDay(),
    end: new GanttDate().endOfDay(),
    addAmount: 1,
    addUnit: 'hour',
    fillDays: 1
};

export class GanttViewHour extends GanttView {
    override showWeekBackdrop = true;

    override showTimeline = true;

    override viewType = GanttViewType.day;

    constructor(start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions) {
        super(start, end, Object.assign({}, viewOptions, options));
    }

    startOf(date: GanttDate) {
        return date.startOfDay();
    }

    endOf(date: GanttDate) {
        return date.endOfDay();
    }

    getPrimaryWidth() {
        return this.getCellWidth() * 24;
    }

    getDayOccupancyWidth(date: GanttDate): number {
        if (!this.options.showWeekend && date.isWeekend()) {
            return 0;
        }

        console.log(date);
        return this.cellWidth * 20;
    }

    getPrimaryDatePoints(): GanttDatePoint[] {
        const days = eachHourOfInterval({ start: this.start.value, end: this.end.value });
        const points: GanttDatePoint[] = [];
        for (let i = 0; i < days.length; i++) {
            const start = new GanttDate(days[i]);
            const isWeekend = start.isWeekend();
            const point = new GanttDatePoint(
                start,
                `${start.format('dd.MM')}`,
                i * this.getCellWidth() + this.getCellWidth() / 2,
                primaryDatePointTop,
                {
                    isWeekend,
                    isToday: start.isToday()
                }
            );
            if (isWeekend) {
                point.style = { fill: '#ff9f73' };
            }
            if (start.isToday()) {
                point.style = { fill: '#ff9f73' };
            }
            points.push(point);
        }
        if (!this.options.showWeekend) {
            return points
                .filter((point) => !point.additions.isWeekend)
                .map((point, i) => {
                    return { ...point, x: i * this.getCellWidth() + this.getCellWidth() / 2 };
                });
        } else {
            return points;
        }
    }

    getSecondaryDatePoints(): GanttDatePoint[] {
        const days = eachHourOfInterval({ start: this.start.value, end: this.end.value });
        const points: GanttDatePoint[] = [];
        for (let i = 0; i < days.length; i++) {
            const start = new GanttDate(days[i]);
            const isWeekend = start.isWeekend();
            const point = new GanttDatePoint(
                start,
                `${start.getHours()}`,
                i * this.getCellWidth() + this.getCellWidth() / 2,
                secondaryDatePointTop,
                {
                    isWeekend,
                    isToday: start.isToday()
                }
            );
            if (isWeekend) {
                point.style = { fill: '#ff9f73' };
            }
            if (start.isToday()) {
                point.style = { fill: '#ff9f73' };
            }
            points.push(point);
        }

        if (!this.options.showWeekend) {
            return points
                .filter((point) => !point.additions.isWeekend)
                .map((point, i) => {
                    return { ...point, x: i * this.getCellWidth() + this.getCellWidth() / 2 };
                });
        } else {
            return points;
        }
    }
}
