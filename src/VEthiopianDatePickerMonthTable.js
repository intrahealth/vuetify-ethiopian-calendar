import { VDatePickerMonthTable } from "vuetify/lib";

import { createFormatter, pad, isDateAllowed } from './util';

export default {
    extends: VDatePickerMonthTable,
    computed: {
        formatter() {
            return this.format || createFormatter('month', this.currentLocale);
        }
    },
    methods: {
        genTBody() {
            const children = [];
            const cols = Array(4).fill(null);
            const rows = 13 / cols.length;
    
            for (let row = 0; row < rows; row++) {
                const tds = cols.map((_, col) => {
                    const month = row * cols.length + col;
                    if ( month > 12 ) return
                    const date = `${this.displayedYear}-${pad(month + 1)}`;
                    return this.$createElement('td', { key: month }, [this.genButton(date, false, 'month', this.formatter)]);
                });
                children.push(this.$createElement('tr', { key: row }, tds));
            }
    
            return this.$createElement('tbody', children);
        },
        genButton(value, isFloating, mouseEventType, formatter) {
            const isAllowed = isDateAllowed(value, this.min, this.max, this.allowedDates);
            const isSelected = this.isSelected(value) && isAllowed;
            const isCurrent = value === this.current;
            const setColor = isSelected ? this.setBackgroundColor : this.setTextColor;
            const color = (isSelected || isCurrent) && (this.color || 'accent');
            return this.$createElement('button', setColor(color, {
                staticClass: 'v-btn',
                class: this.genButtonClasses(isAllowed, isFloating, isSelected, isCurrent),
                attrs: {
                    type: 'button'
                },
                domProps: {
                    disabled: this.disabled || !isAllowed
                },
                on: this.genButtonEvents(value, isAllowed, mouseEventType)
            }), [this.$createElement('div', {
                staticClass: 'v-btn__content'
            }, [formatter(value)]), this.genEvents(value)]);
        },
    }
}
