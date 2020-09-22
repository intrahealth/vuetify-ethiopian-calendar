import { VDatePickerDateTable } from "vuetify/lib";

import { createFormatter, pad, daysInMonth, firstDayOfTheMonth, weekOfYear } from './util';

export default {
    extends: VDatePickerDateTable,
    computed: {
        formatter() {
            return this.format || createFormatter('day', this.currentLocale);
        },
        weekdayFormatter() {
            return this.weekdayFormat || createFormatter('weekday', this.currentLocale);
        },
        weekDays() {
          const first = parseInt( this.firstDayOfWeek, 10 )
          return Array(7).fill().map( (x,i) => this.weekdayFormatter(`2013-01-${first + i + 10}`))
        }
    },
    methods: {
        weekDaysBeforeFirstDayOfTheMonth() {
            const weekDay = firstDayOfTheMonth(this.displayedYear, this.displayedMonth);
            return (weekDay - parseInt(this.firstDayOfWeek) + 7) % 7;
        },

        getWeekNumber(dayInMonth) {
            return weekOfYear(this.displayedYear, this.displayedMonth, dayInMonth)
        },

        genTBody() {
            const children = [];
            const daysInCurrentMonth = daysInMonth(this.displayedYear, this.displayedMonth);
            let rows = [];
            let day = this.weekDaysBeforeFirstDayOfTheMonth();
    
            if (this.showWeek) {
                rows.push(this.genWeekNumber(this.getWeekNumber(1)));
            }
    
            while (day--) rows.push(this.$createElement('td'));
    
            for (day = 1; day <= daysInCurrentMonth; day++) {
                const date = `${this.displayedYear}-${pad(this.displayedMonth)}-${pad(day)}`;
                rows.push(this.$createElement('td', [this.genButton(date, true, 'date', this.formatter)]));
    
                if (rows.length % (this.showWeek ? 8 : 7) === 0) {
                    children.push(this.genTR(rows));
                    rows = [];
        
                    if (this.showWeek && day < daysInCurrentMonth) {
                        rows.push(this.genWeekNumber(this.getWeekNumber((day + 7) > daysInCurrentMonth ? daysInCurrentMonth : (day + 7))));
                    }
                }
            }
    
            if (rows.length) {
                children.push(this.genTR(rows));
            }
    
            return this.$createElement('tbody', children);
        },
    }
}
