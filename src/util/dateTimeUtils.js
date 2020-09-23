const ethiopic = require('ethiopic-calendar')

import { pad } from 'vuetify/lib/components/VDatePicker/util';

export class ETDate {


  constructor( year, month, date ) { 
    if ( year && month && date ) {
      this.year = year
      this.month = month
      this.date = date
    } else {
      const now = new Date()
      this.fromGregorian( now.getFullYear(), now.getMonth()+1, now.getDate() )
    }   
  }

  getMonthName(locale) {
    const ETmonths = {
      en: [
        "Mäskäräm", "Ṭəqəmt", "Ḫədar", "Taḫśaś", "Ṭərr", "Yäkatit",
        "Mägabit", "Miyazya", "Gənbo", "Säne", "Ḥamle", "Nähase", "Ṗagume"
      ],
      am: [
        "መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ", "ጥር", "የካቲት", "መጋቢት",
        "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜን"
      ]
    }
    if ( !ETmonths.hasOwnProperty(locale) ) {
      locale = 'en'
    }
    return ETmonths[locale][this.month-1]
  }

  getDayName(locale) {
    var ETdays = {
      en: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
      am: [ "እሑድ", "ሰኞ", "ማክሰ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ" ]
    }
    if ( !ETdays.hasOwnProperty(locale) ) {
      locale = 'en'
    }
    return ETdays[locale][this.dayOfWeek()]
  }

  getDayAbbrev(locale) {
    var ETdays_short = {
      en: [ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ],
      am: [ "እ", "ሰ", "ማ", "ረ", "ሐ", "ዓ", "ቅ" ]
    }
    if ( !ETdays_short.hasOwnProperty(locale) ) {
      locale = 'en'
    }
    return ETdays_short[locale][this.dayOfWeek()]
  }

  toString() {
    return pad(this.year, 4)+"-"+pad(this.month)+"-"+pad(this.date)
  }

  fromGregorian( year, month, date ) {
      let ge = ethiopic.ge( year, month, date )
      this.year = ge.year
      this.month = ge.month
      this.date = ge.day
  }

  toGregorian() {
    let eg = ethiopic.eg( this.year, this.month, this.date )
    return { year: eg.year, month: eg.month, date: eg.day }
  }

  toGregorianString() {
    let eg = ethiopic.eg( this.year, this.month, this.date )
    return pad(eg.year, 4) +"-"+ pad(eg.month) +"-"+ pad(eg.day)
  }

  dayOfWeek() {
    const gDate = new Date( this.toGregorianString() )
    return (gDate.getDay()+1) % 7
  }
  
  daysInMonth() {
    if ( this.month < 13 ) {
      return 30
    } else if ( this.year % 4 === 3 ) {
      return 6
    } else {
      return 5
    }
  }

  weekOfYear() {
    let firstDay = new ETDate( this.year, 1, 1 )
    let numDays = ((this.month-1)*30) + this.date + firstDay.dayOfWeek()
    let numWeek = Math.floor(numDays / 7) + 1
    return numWeek
  }

    format(type, locale) {
    if ( type === 'day' ) {
      return this.date
    } else if ( type === 'year' ) {
      return this.year
    } else if ( type === 'month' ) {
      return this.getMonthName(locale)
    } else if ( type === 'date' ) {
      return this.getDayName(locale) + " " + this.getMonthName(locale)
        + " " + this.date + "፣ " + this.year
    } else if ( type === "monthYear" ) {
      return this.getMonthName(locale) + " " + this.year
    } else if ( type === 'weekday' ) {
      return this.getDayAbbrev(locale)
    }
  }

}


export function createFormatter(type, locale) {
  return dateString => {
    const [year, month, date] = dateString.trim().split(' ')[0].split('-').map(Number);

    const et_date = new ETDate(year, month || 1, date || 1)

    return et_date.format(type, locale)
  }
}

export function daysInMonth(year, month){
  let etdate = new ETDate( year, month, 1 )
  return etdate.daysInMonth()
}

export function firstDayOfTheMonth(year, month) {
  let etdate = new ETDate( year, month, 1 )
  return etdate.dayOfWeek()
}

export function weekOfYear(year, month, date) {
  let etdate = new ETDate( year, month, date )
  return etdate.weekOfYear()
}

export function monthChange(value, sign) {
  const [year, month] = value.split('-').map(Number)

  if (month + sign === 0) {
    return `${year - 1}-13`
  } else if (month + sign === 14) {
    return `${year + 1}-01`
  } else {
    return `${year}-${pad(month + sign)}`
  }
}
