# a vuetify date picker for Ethiopian calendar

this component is based on [umalqura calendar component](https://github.com/tala424/vuetify-umalqura)

this component extends [vuetify's v-date-picker](https://vuetifyjs.com/en/components/date-pickers/) 

all of vuetify's v-date-picker props, slots, etc applies to this component

this component depends on [ethiopic-calendar](https://github.com/moe-szyslak/Ethiopic-Calendar#readme) and [vuetify](https://vuetifyjs.com/) you must install them before using it

## Installation


```bash
npm install vuetify-ethiopian-calendar

# if you dont have ethiopic-calendar installed
npm install vuetify-ethiopian-calendar ethiopic-calendar
```

## Usage:

globally register the component

```js
// src/main.js
import Vue from 'vue'

import VEthiopianDatePicker from 'vuetify-ethiopian-calendar'

Vue.component(VEthiopianDatePicker.name, VEthiopianDatePicker)

```

or import directly in your .vue files

```vue
<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6">
        <v-ethiopian-date-picker v-model="date" locale="ar" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VEthiopianDatePicker from 'vuetify-ethiopian-calendar'

export default {
  name: 'MyComponent',
  data: () => ({
    date: '2013-01-01'
  })
  components: {
    VEthiopianDatePicker
  }
}
</script>
```
