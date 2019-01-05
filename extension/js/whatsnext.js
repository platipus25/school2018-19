// Ravago Jones whatsnext v2.2 1/4/19
class whatsnext{
  constructor(time){
    this.time = (time || new Date())
    this.schedule_base = (function(){
        var Httpreq = new XMLHttpRequest(); // a new request
        Httpreq.open("GET", "js/schedule2018_19.json", false);
        Httpreq.send(null);
        return JSON.parse(Httpreq.responseText);
      })()
    this.periodInfo = {}
    this.scheduleToday = this.schedule();
  }

  now(){
    if(this.time){
      return this.time
    }else{
      return new Date()
    }
  }

  objectToDate(obj){
    if(obj.hasOwnProperty("year")){
      return new Date(obj["year"], obj["month"], obj["day"])
    }else if(obj.hasOwnProperty("minute")){
      var now = this.now()
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), obj["hour"], obj["minute"])
    }
  }

  schedule(){
    var now = this.now()
    var schedule = this.schedule_base
    if(now.toDateString() == this.time.toDateString() && this.scheduleToday){
      return this.scheduleToday
    }else{
      this.scheduleToday = false
    }
    var state = this.getState()
    var day = state.day

    var today_base = schedule[day]
    var todaysObject = {}

    for(let period in today_base){
      let periodObject = today_base[period]
      todaysObject[period] = {}
      todaysObject[period].start = this.objectToDate(periodObject.start)
      todaysObject[period].end = this.objectToDate(periodObject.end)
      if(periodObject.info != null){
        // define values to be passed to the closure that is the getter
        let closureRefToSelf = this
        let closurePeriod = period
        Object.defineProperty(todaysObject[period], 'info', {
          enumerable: true,
          get: function(){
            var info = closureRefToSelf.periodInfo[closurePeriod]
            if(!info){
              info = {}
            }
            info.period = closurePeriod
            return info
          }
        })
      }
    }

    if(today_base == undefined){
      return null
    }
    //console.log("state, schedule:", state, todaysObject)
    return (this.scheduleToday = todaysObject);
  }

  getState(){
    var now = this.now()
    var schedule = this.schedule_base
    var state = {
      day:null,
      nextDayOff:null,
      thisPeriod:null,
      nextPeriod:null
    }

    // Is it summer break
    if(now < this.objectToDate(schedule.school_year.start) || now > this.objectToDate(schedule.school_year.end)){
      state.day = "summer"
    }
    // is it weekend
    var days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    var day = days[now.getDay()]
    if(day == "saturday" || day == "sunday"){
      if(state.day == null){state.day = "weekend"}
    }
    if(state.day == null){
      state.day = day
    }

    // is it a holiday or recess
    var nextDayOff = null
    for(let {name, date} of schedule.days_off){
      date = this.objectToDate(date)
      if(date > now){
        nextDayOff = {name:name, date:date, rel:"next"}
        break;
      }
      if(date.toDateString() == now.toDateString()){
          nextDayOff = {name:name, date:date, rel:"now"}
          break;
      }
      //console.log(name, date)
    }
    state.nextDayOff = nextDayOff;

    // is it before or after school
    if(this.scheduleToday){
      var scheduleToday = this.schedule()
      let first = (scheduleToday[1] || scheduleToday[2])
      let last = (scheduleToday[8] || scheduleToday[7])
      var start = first.start
      var end = last.end
      if(now < start) {
        state.thisPeriod = "before school"
        state.nextPeriod = "before school"
      }
      if(now > end) {
        state.thisPeriod = "after school"
        state.nextPeriod = "after school"
      }

      var thisPeriod = state.thisPeriod
      for(let period in scheduleToday){
        let periodObj = scheduleToday[period]
        if(periodObj.end > now){
          if(periodObj.start <= now){
            thisPeriod = periodObj
          }
        }
      }
      state.thisPeriod = thisPeriod;

      var nextPeriod = state.nextPeriod
      if(typeof thisPeriod == "object"){
        var fourMinutesFromEndOfThisPeriod = new Date(thisPeriod.end.valueOf()+(4*60*1000))
        for(let period in scheduleToday){
          let periodObj = scheduleToday[period]
          if(periodObj.end > fourMinutesFromEndOfThisPeriod){
            if(periodObj.start <= fourMinutesFromEndOfThisPeriod){
              nextPeriod = periodObj
            }
          }
        }
        state.nextPeriod = nextPeriod
      }
    }
    return state
  }

}
