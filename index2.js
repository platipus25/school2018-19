var DateTime = luxon.DateTime;
var Interval = luxon.Interval;

var schedule = {
  schedule:{
    sessions:{
      1:[{hour:7, minute:55},{hour:8, minute:59}],
      2:[{hour:9, minute:2},{hour:10, minute:0}],
      Break:[{hour:10, minute:0},{hour:10, minute:10}],
      3:[{hour:10, minute:13},{hour:11, minute:11}],
      4:[{hour:11, minute:14},{hour:12, minute:12}],
      Lunch:[{hour:12, minute:12},{hour:12, minute:52}],
      5:[{hour:12, minute:56},{hour:13, minute:54}],
      6:[{hour:13, minute:57},{hour:14, minute:55}]
    },
    days:{
      Mon:{
        dropped:[],
        periods:{
          1:[{hour:9, minute:28},{hour:10, minute:0}],
          2:[{hour:10, minute:3},{hour:10, minute:35}],
          3:[{hour:10, minute:38},{hour:11, minute:10}],
          Break:[{hour:11, minute:10},{hour:11, minute:20}],
          4:[{hour:11, minute:23},{hour:11, minute:55}],
          5:[{hour:11, minute:58},{hour:12, minute:30}],
          Lunch:[{hour:12, minute:30},{hour:13, minute:10}],
          6:[{hour:13, minute:13},{hour:13, minute:45}],
          7:[{hour:13, minute:48},{hour:14, minute:20}],
          8:[{hour:14, minute:23},{hour:14, minute:55}]
        }
      },
      Tue:{
        dropped:[1,5]
      },
      Wed:{
        dropped:[2,6]
      },
      Thu:{
        dropped:[3,7]
      },
      Fri:{
        dropped:[4,8]
      }
    }
  },
	school_year:[DateTime.local(2018, 8, 20), DateTime.local(2019, 6, 7)],
	days_off:[
		{name: "Labor Day", dates:[DateTime.local(2018, 9, 3)]},
		{name: "Veterans Day", dates:[DateTime.local(2018, 11, 12)]},
		{name: "Thanksgiving Break", dates:[DateTime.local(2018, 11, 21), DateTime.local(2018, 11, 22), DateTime.local(2018, 11, 23)]},
		{name: "Winter/Holiday Break", dates:[DateTime.local(2018, 12, 24), DateTime.local(2018, 12, 25), DateTime.local(2018, 12, 26), DateTime.local(2018, 12, 27), DateTime.local(2018, 12, 28), DateTime.local(2018, 12, 31), DateTime.local(2019, 01, 01), DateTime.local(2019, 01, 02), DateTime.local(2019, 01, 03), DateTime.local(2019, 01, 04)]},
		{name: "Staff Development Day", dates:[DateTime.local(2019, 01, 07)]},
		{name: "Martin Luther King Jr Day", dates:[DateTime.local(2019, 01, 21)]},
		{name: "Spring Break", dates:[DateTime.local(2019, 02, 19), DateTime.local(2019, 02, 20), DateTime.local(2019, 02, 21), DateTime.local(2019, 02, 22)]},
		{name: "St Patrick's day", dates:[DateTime.local(2019, 03, 18)]},
		{name: "Staff Development Day", dates:[DateTime.local(2019, 03, 19)]},
		{name: "Spring Break", dates:[DateTime.local(2019, 04, 15), DateTime.local(2019, 04, 16), DateTime.local(2019, 04, 17), DateTime.local(2019, 04, 18), DateTime.local(2019, 04, 19)]},
		{name: "Memorial Day", dates:[DateTime.local(2019, 05, 27)]}
	]
}

function timeToday(object, now){
    return (now?now:DateTime.local()).set(object)
}

function getScheduleToday(now){
    if(!now) now = DateTime.local()
    var day = now.weekdayShort
    if(day == "Sat" || day == "Sun") return null
    var dayObject = schedule.schedule.days[day]
    var scheduleOutput = {}
    if(dayObject.dropped.length > 0 || day != "Mon"){
        var session = 1;
        var dropped = dayObject.dropped
        var sessions = schedule.schedule.sessions
        var push = function(session, period){
          scheduleOutput[session] = {
              start: timeToday(sessions[session][0], now),
              end: timeToday(sessions[session][1], now),
              interval:Interval.fromDateTimes(timeToday(sessions[session][0], now), timeToday(sessions[session][1], now)),
              period:{period:period}
          }
        }
        for(var period = 1;period <= 8; period++){
          if(!dropped.includes(parseInt(period))){
            push(session, period)
            session++
          }
        }
        push("Break", "Break")
        push("Lunch", "Lunch")
    }else if(day == "Mon"){
        for(period in dayObject.periods){
            // get period info
            scheduleOutput[period] = {
                start:timeToday(dayObject.periods[period][0], now),
                end:timeToday(dayObject.periods[period][1], now),
                interval:Interval.fromDateTimes(timeToday(dayObject.periods[period][0], now), timeToday(dayObject.periods[period][1], now)),
                period:{period:period}
            }
        }
    }
    return scheduleOutput
}

function getPeriod(now){
  if(!now) now = DateTime.local();
  var periods = getScheduleToday(now)
  var thisPeriod = null;
  for(period in periods){
      if(periods[period].interval.contains(now)){
        thisPeriod = periods[period]
      }
  }
  return thisPeriod
}
function getNextPeriod(now){
  var thisPeriod = getPeriod(now)
  var otherNow = thisPeriod.end.plus({minutes:4})
  return getPeriod(otherNow)
}

function isSchool(now){
  if(!now) now = DateTime.local();

  // Is it summer break
  if(now < schedule.school_year[0] || now > schedule.school_year[1]){
    return [false, "Summer!!"]
  }

  // is it weekend
  if(now.weekdayShort == "Sat" || now.weekdayShort == "Sun"){
    return [false, "Weekend"];
  }

  // is it a holiday or recess
  var nextDayOff = getNextDayOff(now)
  if(nextDayOff[2] == "today"){
    return [false, nextDayOff[1].name];
  }

  // is it before or after school
  var scheduleToday = getScheduleToday(now)
  var start = scheduleToday[1].start
  var end = now.set({hour:14, minute:55})
  if(now <= start) return [false, "Before School"];
  if(now >= end) return [false, "After School"];

  return [true, "Yup"];
}

function getNextDayOff(now){
  var min = 0;
  var max = schedule.days_off.length;
  var half;
  for(i in schedule.days_off){
    oldhalf = half;
    half = Math.round((max+min)/2)
    //console.log("min", min, "max", max, "half", half, "half pointing to", schedule.days_off[half].name)
    if(now > schedule.days_off[half].dates[0]){
      min = half+1;
    }else if(now < schedule.days_off[half].dates[0] || min == max){
      max = half-1;
    }else if(now.toLocaleString() == schedule.days_off[half].dates[0].toLocaleString()){
      return [half, schedule.days_off[half], "today"]
    }
  }
  return [half, schedule.days_off[half], "next"]
}
