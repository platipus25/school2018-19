var jsonData;
var DateTime = luxon.DateTime;
var Interval = luxon.Interval;
//var jsonGet = $.getJSON("school2018-2019.json", function(data){alert()});
var jqxhr = $.getJSON( "school2018-2019.json", function(data) {
  console.log( "success" );
  jsonData = convert(data);
})
  .done(function() {
    console.log( "second success" );
  })
  .fail(function() {
    console.log( "error" );
  })
  .always(function() {
    console.log( "complete" );
  });
console.log(jsonData)

function convert(schedule){
  var offDates = schedule.days_off
  for(recess in offDates){
    var thisRecess = offDates[recess]
    for(date in thisRecess.dates){
      thisDate = thisRecess.dates[date]
      schedule.days_off[recess].dates[date] = DateTime.local(thisDate)
      console.log()
    }
  }

  for(item in schedule.school_year){
    schedule.school_year[item] = DateTime.local(schedule.school_year[item])
  }

  function convertTime(array){
    // ex. [1,0]
    return DateTime.fromObject({hour:array[0], minute:array[1]})
  }

  var sessions = schedule.schedule.sessions
  for(periods in sessions){
    for(time in sessions[periods]){
      var thisPeriod = sessions[periods][time]
      schedule.schedule.sessions[periods][time] = convertTime(thisPeriod)
    }
    schedule.schedule.sessions[periods] = Interval.fromDateTimes(sessions[periods][0], sessions[periods][1])
  }

  var monPeriods = schedule.schedule.days.mon.periods
  for(periods in monPeriods){
    for(time in monPeriods[periods]){
      var thisPeriod = monPeriods[periods][time]
      schedule.schedule.days.mon.periods[periods][time] = convertTime(thisPeriod)
    }
    schedule.schedule.days.mon.periods[periods] = Interval.fromDateTimes(monPeriods[periods][0], monPeriods[periods][1])
  }

  return schedule
}


function thisPeriod(schedule, now){
   if(!now) now = DateTime.local();
   console.log(now. toISO())
   var localScheduleToday = scheduleToday(schedule, now)
   console.log(localScheduleToday)
   for(period in localScheduleToday.periods){
     console.log(localScheduleToday.periods[period].toISO())//contains(now))
     console.log(localScheduleToday.periods[period].contains(now))
   }
}

function scheduleToday(schedule, now){
  if(!now) now = DateTime.local();
  console.log(now.weekdayShort)

  var DOW = (now.weekdayShort).toLowerCase();

  if(DOW == "sat" || DOW == "sun") return null;

  console.log(DOW)

  var DOWObj = schedule.schedule.days[DOW]

  if(DOW == "mon"){
    return DOWObj
  }

  DOWObj.periods = {
    Lunch:schedule.schedule.sessions.Lunch,
    Break:schedule.schedule.sessions.Break
  }

  var session = 1;
  for(var period = 1; period <= 8; period++){
    if(period != DOWObj.dropped[0] && period != DOWObj.dropped[1]){
      DOWObj.periods[session] = schedule.schedule.sessions[session]
      DOWObj.periods[session].period = period;
      session++;
    }
  }

  return DOWObj
}

function isSchool(schedule, now){
  if(!now) now = DateTime.local();
  console.log(now.toISO())

  // Is it summer break
  if(now < schedule.school_year[0] || now > schedule.school_year[1]){
    return [false, "Summer!!"]
  }

  // is it weekend
  if(now.weekdayShort == "Sat" || now.weekdayShort == "Sun"){
    return [false, "Weekend"];
  }

  //Is it a scheduled holiday or recess
  var offDates = schedule.days_off
  for(recess in offDates){
    thisRecess = offDates[recess]
    for(date in thisRecess.dates){
      thisDate = thisRecess.dates[date]
      if(thisDate.toLocaleString() == now.toLocaleString()){
        console.log(thisDate.toLocaleString())
        return [false, thisRecess.name]
      }
    }
  }

  // is it during the school day
  var localScheduleToday = scheduleToday(schedule, now)
  var othernow = localScheduleToday.periods[1].start
  othernow = now.set({hour:othernow.hour, minute:othernow.minute})
  if(now <= othernow) return [false, "Before School"]
  othernow = now.set({hour:14, minute:55})
  if(now > othernow) return [false, "After School"]

  return [true, "Yup"];
}


function binarySearch(array, key, value){
  if(!array || !key || !value) return null;
  var notfound = true;
  var half;
  var min = 0;
  var max = array.length;
  while(notfound){
    oldhalf = half
    half = Math.round((max+min)/2)
    if(value > array[half][key][0]){
      min = half+1;
    }else if(value < array[half][key][0]){
      max = half-1;
    }else if(value == array[half][key][0]){
      return [half, array[half]]
    }else if(half == oldhalf){
       return [half, array[half]]
    }
    console.log(array[half])
    console.log(array[half][key][0].toISO())
    console.log(half)
    console.log(oldhalf)
    if(half == oldhalf) notfound = false
  }
}
