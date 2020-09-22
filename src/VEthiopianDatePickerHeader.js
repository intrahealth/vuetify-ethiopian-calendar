import { VDatePickerHeader } from "vuetify/lib";

import { createFormatter, monthChange } from './util';

export default {
    extends: VDatePickerHeader,
    computed: {
        formatter() {
            return this.format || createFormatter(String(this.value).split('-')[1] ? 'monthYear' : 'year', this.currentLocale);
        }
    },
    methods: {
        calculateChange (sign) {
            const [year, month] = String(this.value).split('-').map(Number)

            if (month == null) {
                return `${year + sign}`
            } else {
                return monthChange(String(this.value), sign)
            }   
        }   
    }   
}
