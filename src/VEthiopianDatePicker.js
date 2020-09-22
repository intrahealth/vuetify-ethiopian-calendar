import { VDatePicker } from "vuetify/lib";

import VEthiopianDatePickerHeader from './VEthiopianDatePickerHeader'

import VEthiopianDatePickerMonthTable from './VEthiopianDatePickerMonthTable'

import VEthiopianDatePickerDateTable from './VEthiopianDatePickerDateTable'

import { createFormatter, pad, daysInMonth, wrapInArray, ETDate } from './util';

function sanitizeDateString(dateString, type) {
    const [year, month = 1, date = 1] = dateString.split("-");
    return `${year}-${pad(month)}-${pad(date)}`.substr(
        0,
        {
            date: 10,
            month: 7,
            year: 4
        }[type]
    );
}

export default {
    extends: VDatePicker,
    name: "VEthiopianDatePicker",
    props: {
        max: {
            type: String,
            validator: dateString => {
                return Number(sanitizeDateString(dateString, 'year')) <= 3000
            }
        },
        min: {
            type: String,
            validator: dateString => {
                return Number(sanitizeDateString(dateString, 'year')) >= 1
            }
        },
    },
    data() {
      const now = new ETDate()
        return {
            activePicker: this.type.toUpperCase(),
            inputDay: null,
            inputMonth: null,
            inputYear: null,
            isReversing: false,
            now,
            tableDate: (() => {
                if (this.pickerDate) {
                    return this.pickerDate;
                }

                const multipleValue = wrapInArray(this.value)
                const date = multipleValue[multipleValue.length - 1] || (typeof this.showCurrent === 'string' ? this.showCurrent : `${now.year}-${now.month}`)
                return sanitizeDateString(date, this.type === 'date' ? 'month' : 'year');
            })(),
        };
    },
    computed: {
        current() {
            if (this.showCurrent === true) {
                return sanitizeDateString(`${this.now.year}-${this.now.month}-${this.now.date}`, this.type);
            }
            return this.showCurrent || null;
        },

        inputDate() {
            return this.type === 'date' ? `${this.inputYear}-${pad(this.inputMonth)}-${pad(this.inputDay)}` : `${this.inputYear}-${pad(this.inputMonth)}`;
        },

        tableMonth() {
            return Number((this.pickerDate || this.tableDate).split('-')[1]);
        },

        minMonth() {
            return this.min ? sanitizeDateString(this.min, 'month') : "1900-01"
        },
      
        maxMonth() {
            return this.max ? sanitizeDateString(this.max, 'month') : "2100-13"
        },
      
        minYear() {
            return this.min ? sanitizeDateString(this.min, 'year') : "1900"
        },
      
        maxYear() {
            return this.max ? sanitizeDateString(this.max, 'year') : "2100"
        },
      
        formatters() {
            return {
                year: createFormatter('year', this.currentLocale),
                titleDate: this.titleDateFormat || (this.isMultiple ? this.defaultTitleMultipleDateFormatter : this.defaultTitleDateFormatter)
            };
        },

        defaultTitleDateFormatter() {
            const titleDateFormatter = createFormatter(this.type, this.currentLocale)
    
            const landscapeFormatter = date => titleDateFormatter(date).replace(/([^\d\s])([\d])/g, (match, nonDigit, digit) => `${nonDigit} ${digit}`).replace(', ', ',<br>');
    
            return this.landscape ? landscapeFormatter : titleDateFormatter;
        }
    },
    methods: {
        yearClick(value) {
            this.inputYear = value;
    
            if (this.type === 'month') {
                this.tableDate = `${value}`;
            } else {
                this.tableDate = `${value}-${pad(this.tableMonth || 1)}`;
            }
    
            this.activePicker = 'MONTH';
    
            if (this.reactive && !this.readonly && !this.isMultiple && this.isDateAllowed(this.inputDate)) {
                this.$emit('input', this.inputDate);
            }
        },

        monthClick(value) {
            this.inputYear = parseInt(value.split('-')[0], 10);
            this.inputMonth = parseInt(value.split('-')[1], 10);
    
            if (this.type === 'date') {
                if (this.inputDay) {
                    this.inputDay = Math.min(this.inputDay, daysInMonth(this.inputYear, this.inputMonth));
                }
    
                this.tableDate = value;
                this.activePicker = 'DATE';
    
                if (this.reactive && !this.readonly && !this.isMultiple && this.isDateAllowed(this.inputDate)) {
                    this.$emit('input', this.inputDate);
                }
            } else {
                this.emitInput(this.inputDate);
            }
        },
      
        dateClick(value) {
            this.inputYear = parseInt(value.split('-')[0], 10);
            this.inputMonth = parseInt(value.split('-')[1], 10);
            this.inputDay = parseInt(value.split('-')[2], 10);
            this.emitInput(this.inputDate);
        },
        
        genTableHeader() {
            return this.$createElement(VEthiopianDatePickerHeader, {
                props: {
                    nextIcon: this.nextIcon,
                    color: this.color,
                    dark: this.dark,
                    disabled: this.disabled,
                    format: this.headerDateFormat,
                    light: this.light,
                    locale: this.locale,
                    min: this.activePicker === 'DATE' ? this.minMonth : this.minYear,
                    max: this.activePicker === 'DATE' ? this.maxMonth : this.maxYear,
                    nextAriaLabel: this.activePicker === 'DATE' ? this.nextMonthAriaLabel : this.nextYearAriaLabel,
                    prevAriaLabel: this.activePicker === 'DATE' ? this.prevMonthAriaLabel : this.prevYearAriaLabel,
                    prevIcon: this.prevIcon,
                    readonly: this.readonly,
                    value: this.activePicker === 'DATE' ? `${pad(this.tableYear, 4)}-${pad(this.tableMonth)}` : `${pad(this.tableYear, 4)}`
                },
                on: {
                    toggle: () => this.activePicker = this.activePicker === 'DATE' ? 'MONTH' : 'YEAR',
                    input: value => this.tableDate = value
                }
            });
        },

        genDateTable() {
            return this.$createElement(VEthiopianDatePickerDateTable, {
                props: {
                    allowedDates: this.allowedDates,
                    color: this.color,
                    current: this.current,
                    dark: this.dark,
                    disabled: this.disabled,
                    events: this.events,
                    eventColor: this.eventColor,
                    firstDayOfWeek: this.firstDayOfWeek,
                    format: this.dayFormat,
                    light: this.light,
                    locale: this.locale,
                    localeFirstDayOfYear: this.localeFirstDayOfYear,
                    min: this.min,
                    max: this.max,
                    range: this.range,
                    readonly: this.readonly,
                    scrollable: this.scrollable,
                    showWeek: this.showWeek,
                    tableDate: `${pad(this.tableYear, 4)}-${pad(this.tableMonth + 1)}`,
                    value: this.value,
                    weekdayFormat: this.weekdayFormat
                },
                ref: 'table',
                on: {
                    input: this.dateClick,
                    'update:table-date': value => this.tableDate = value,
                    'click:date': value => this.$emit('click:date', value),
                    'dblclick:date': value => this.$emit('dblclick:date', value),
                }
            });
        },
        
        genMonthTable() {
            return this.$createElement(VEthiopianDatePickerMonthTable, {
                props: {
                    allowedDates: this.type === 'month' ? this.allowedDates : null,
                    color: this.color,
                    current: this.current ? sanitizeDateString(this.current, 'month') : null,
                    dark: this.dark,
                    disabled: this.disabled,
                    events: this.type === 'month' ? this.events : null,
                    eventColor: this.type === 'month' ? this.eventColor : null,
                    format: this.monthFormat,
                    light: this.light,
                    locale: this.locale,
                    min: this.minMonth,
                    max: this.maxMonth,
                    range: this.range,
                    readonly: this.readonly && this.type === 'month',
                    scrollable: this.scrollable,
                    value: this.selectedMonths,
                    tableDate: `${pad(this.tableYear, 4)}`
                },
                ref: 'table',
                on: {
                    input: this.monthClick,
                    'update:table-date': value => this.tableDate = value,
                    'click:month': value => this.$emit('click:month', value),
                    'dblclick:month': value => this.$emit('dblclick:month', value),
                }
            });
        },

        setInputDate() {
            if (this.lastValue) {
                const array = this.lastValue.split('-');
                this.inputYear = parseInt(array[0], 10);
                this.inputMonth = parseInt(array[1], 10);
        
                if (this.type === 'date') {
                    this.inputDay = parseInt(array[2], 10);
                }
            } else {
                this.inputYear = this.inputYear || this.now.year;
                this.inputMonth = this.inputMonth == null ? this.inputMonth : this.now.month;
                this.inputDay = this.inputDay || this.now.date;
            }
        },
    }
}
