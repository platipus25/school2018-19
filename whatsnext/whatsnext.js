whatsnext = {
  schedule:function(){return schedule2018_19()},
  infoFunc:function(period){
    return {}
  },
  setInfoFunction:function(callback){
    if(typeof callback == "function"){
      this.infoFunc = callback
    }
  },
  scheduleToday:null,
  scheduleTodayDate:null,
  getScheduleToday: function(now){
    if(!now) now = new Date()
    if(this.scheduleToday != null){
      if(this.scheduleTodayDate == now.toDateString()){
        return this.scheduleToday
      }
    }

    var schedule = schedule2018_19()
    var days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    var day = days[now.getDay()]
    for(let {name, date} of schedule.minimum_days){
      if(date.toDateString() == now.toDateString()){
        day =  "minimum"//[{name:name, dates:dates}, "now"]
      }
    }
    console.log("Today is a "+day)
    var todaysObject = JSON.parse(JSON.stringify(schedule[day]))
    //console.log(todaysObject)
    this.scheduleToday = {}

    function timeToday(object, now){
      let otherNow = new Date(now.toString())
      //console.log("Other Now for timeToday is "+otherNow)
      otherNow.setHours(object.hour, object.minute, 0)
      return otherNow
    }

    for(period in todaysObject){
      let periodObject = todaysObject[period]
      //console.log(periodObject)
      periodObject.start = timeToday(periodObject.start, now)
      periodObject.end = timeToday(periodObject.end, now)
      if(!isNaN(parseInt(period))){
        periodObject.info = this.infoFunc(period)
      }else{
        periodObject.info = null
      }
      //periodObject.info = periodObject.info
    }
    //console.log("Today's shcedule is: \n", todaysObject)
    this.scheduleToday = todaysObject
    this.scheduleTodayDate = now.toDateString()
    return this.scheduleToday
  },
  getThisPeriod:function(now){
    if(!now) now = new Date()
    var scheduleToday = this.getScheduleToday(now)
    for(period in scheduleToday){
      let periodObj = scheduleToday[period]
      if(periodObj.end > now){
        if(periodObj.start <= now){
          return periodObj
        }
      }
    }
    return {period:"none", start:null, end:null, info:null}
  },
  getNextPeriod:function(now){
    if(!now) now = new Date()
    var endOfThisPeriod = this.getThisPeriod(now).end
    if(!endOfThisPeriod) return {period:"none", start:null, end:null, info:null}
    var fourMinutesFromEndOfThisPeriod = new Date(endOfThisPeriod.valueOf()+(4*60*1000))
    var thisPeriod = this.getThisPeriod(fourMinutesFromEndOfThisPeriod)
    return thisPeriod
  },
  isSchool: function(now){
    if(!now) now = new Date()
    var schedule = this.schedule()

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
    var nextDayOff = this.getNextDayOff(now)
    if(nextDayOff.rel == "now"){
      return [false, nextDayOff.name];
    }

    // is it before or after school
    var scheduleToday = this.getScheduleToday(now)
    let first = (scheduleToday[1] || scheduleToday[2])
    let last = (scheduleToday[8] || scheduleToday[7])
    var start = first.start
    var end = last.end
    if(now < start) return [false, "Before School"];
    if(now > end) return [false, "After School"];

    return [true, "Yup"];
  },
  getNextDayOff:function(now){
    if(!now) now = new Date();
    var schedule = this.schedule()
    for(let {name, date} of schedule.days_off){
      if(date > now){
        return {name:name, date:date, rel:"next"} 
      }
      if(date.toDateString() == now.toDateString()){
          return {name:name, date:date, rel:"now"}
      }
    }
    return "nope"
  },
  countdown:function(now, then){
    var diff = then.getTime() - now.getTime();

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -=  days * (1000 * 60 * 60 * 24);

    var hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    var mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);

    var seconds = Math.floor(diff / (1000));
    diff -= seconds * (1000);

    var final = ""
    if(days) final+=days+" days, "
    if(hours) final+=hours+" hours, "
    if(mins) final+=mins+" minutes, and "
    final+=seconds +" seconds"
    return final
  }
}
//whatsnext.getScheduleToday(new Date())
