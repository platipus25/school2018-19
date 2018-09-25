class whatsnext{
  constructor(time){
    if(time){
      this.time = time
      Object.defineProperty(this, 'now', {get:function(){return this.time}});
      this.day = this.time.toLocaleDateString()
    }else{
      this.time = new Date()
      this.day = null
    }
    this.theScheduleToday = null
    this.periodInfo = {}
  }
  info(period){
    if(!this.periodInfo.hasOwnProperty(period)) return {}
    var thisPeriod = this.periodInfo[period]
    let info = class{
      constructor(period, thisRef){
        this.period = period
        this.parentRef = thisRef
      }
      get value(){
        return this.parentRef.periodInfo[period]
      }
      get infoAsText(){
        var formatted = ""
        for(info in this.value){
          var titleCase = info[0].toUpperCase()+info.slice(1, info.length)
          formatted+=titleCase+": "+this.value[info]+"\n"
        }
        return formatted
      }
      infoAsHTML(tag){
        if(!tag) tag = "span"
        var formatted = "<div id='"+this.period+"' class='info'>"
        for(info in this.value){
          var titleCase = info[0].toUpperCase()+info.slice(1, info.length)
          formatted+=("<"+tag+" class='field'>")+titleCase+("</"+tag+">")+": "+("<"+tag+" class='value'>")+this.value[info]+("</"+tag+">")+"<br>"
        }
        formatted = formatted.slice(0, formatted.length-4)
        formatted+="</div>"
        return formatted
      }
    }
    return new info(period, this)
  }
  get now(){
    return new Date()
  }
  get schedule_base(){
    return schedule2018_19()
  }
  get schedule(){
    var now = this.now
    if(this.theScheduleToday != null){
      return this.theScheduleToday
    }

    var schedule = this.schedule_base
    var days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    var day = days[now.getDay()]
    for(let {name, date} of schedule.minimum_days){
      if(date.toDateString() == now.toDateString()){
        day =  "minimum"//[{name:name, dates:dates}, "now"]
      }
    }
    console.log("Today is a "+day)
    if(day == "sunday" || day == "saturday"){
      return day
    }
    var todaysObject = JSON.parse(JSON.stringify(schedule[day]))
    //console.log(todaysObject)
    this.theScheduleToday = {}

    function timeToday(object, now){
      let otherNow = new Date(now.toString())
      //console.log("Other Now for timeToday is "+otherNow)
      otherNow.setHours(object.hour, object.minute, 0)
      return otherNow
    }

    for(let period in todaysObject){
      let periodObject = todaysObject[period]
      periodObject.start = timeToday(periodObject.start, now)
      periodObject.end = timeToday(periodObject.end, now)
      if(periodObject.info != null){
        var thisRef = this
        periodObject.info = this.info(period)
      }
    }
    //console.log("Today's shcedule is: \n", todaysObject)
    this.theScheduleToday = todaysObject
    return this.theScheduleToday
  }
  get thisPeriod(){
    var now = this.now
    var scheduleToday = this.schedule
    for(let period in scheduleToday){
      let periodObj = scheduleToday[period]
      if(periodObj.end > now){
        if(periodObj.start <= now){
          return periodObj
        }
      }
    }
    return {period:"none", start:null, end:null, info:null}
  }
  get nextPeriod(){
    var now = this.now
    var endOfThisPeriod = this.thisPeriod.end
    if(!endOfThisPeriod) return {period:"none", start:null, end:null, info:null}
    var fourMinutesFromEndOfThisPeriod = new Date(endOfThisPeriod.valueOf()+(4*60*1000))
    var period = (function(now, schedule){
      var scheduleToday = schedule
      for(let period in scheduleToday){
        let periodObj = scheduleToday[period]
        if(periodObj.end > now){
          if(periodObj.start <= now){
            return periodObj
          }
        }
      }
      return {period:"none", start:null, end:null, info:null}
    })(fourMinutesFromEndOfThisPeriod, this.schedule)
    return period
  }
  get isSchool(){
    var now = this.now
    var schedule = this.schedule_base

    // Is it summer break
    if(now < schedule.school_year.start || now > schedule.school_year.end){
      return [false, "Summer!!"]
    }

    // is it weekend
    var days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    var day = days[now.getDay()]
    if(day == "saturday" || day == "sunday"){
      return [false, "Weekend"];
    }

    // is it a holiday or recess
    var nextDayOff = this.nextDayOff
    if(nextDayOff.rel == "now"){
      return [false, nextDayOff.name];
    }

    // is it before or after school
    var scheduleToday = this.schedule
    let first = (scheduleToday[1] || scheduleToday[2])
    let last = (scheduleToday[8] || scheduleToday[7])
    var start = first.start
    var end = last.end
    if(now < start) return [false, "Before School"];
    if(now > end) return [false, "After School"];

    return [true, "Yup"];
  }

  get nextDayOff(){
    var now = this.now
    var schedule = this.schedule_base
    for(let {name, date} of schedule.days_off){
      if(date > now){
        return {name:name, date:date, rel:"next"}
      }
      if(date.toDateString() == now.toDateString()){
          return {name:name, date:date, rel:"now"}
      }
      //console.log(name, date)
    }
    return "nope"
  }
}
