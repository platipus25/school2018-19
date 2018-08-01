var DateTime = luxon.DateTime;
var Interval = luxon.Interval;

var schedule = {
  schedule:{
    sessions:{
      "1":[{hour:7, minute:55},{hour:8, minute:59}],
      "p2":[{hour:8, minute:59}, {hour:9, minute:2}],
      "2":[{hour:9, minute:2},{hour:10, minute:0}],
      "Break":[{hour:10, minute:0},{hour:10, minute:10}],
      "p3":[{hour:10, minute:10}, {hour:10, minute:13}],
      "3":[{hour:10, minute:13},{hour:11, minute:11}],
      "p4":[{hour:11, minute:11}, {hour:11, minute:14}],
      "4":[{hour:11, minute:14},{hour:12, minute:12}],
      "Lunch":[{hour:12, minute:12},{hour:12, minute:52}],
      "p5":[{hour:12, minute:52}, {hour:12, minute:56}],
      "5":[{hour:12, minute:56},{hour:13, minute:54}],
      "p6":[{hour:13, minute:54}, {hour:13, minute:57}],
      "6":[{hour:13, minute:57},{hour:14, minute:55}]
    },
    days:{
      Mon:{
        dropped:[],
        periods:{
          "1":[{hour:9, minute:28},{hour:10, minute:0}],
          "p1":[{hour:10, minute:0},{hour:10, minute:3}],
          "2":[{hour:10, minute:3},{hour:10, minute:35}],
          "p2":[{hour:10, minute:35},{hour:10, minute:38}],
          "3":[{hour:10, minute:38},{hour:11, minute:10}],
          "Break":[{hour:11, minute:10},{hour:11, minute:20}],
          "p3":[{hour:11, minute:20},{hour:11, minute:23}],
          "4":[{hour:11, minute:23},{hour:11, minute:55}],
          "p4":[{hour:11, minute:55},{hour:11, minute:58}],
          "5":[{hour:11, minute:58},{hour:12, minute:30}],
          "Lunch":[{hour:12, minute:30},{hour:13, minute:10}],
          "p5":[{hour:13, minute:10},{hour:13, minute:13}],
          "6":[{hour:13, minute:13},{hour:13, minute:45}],
          "p6":[{hour:13, minute:45},{hour:13, minute:48}],
          "7":[{hour:13, minute:48},{hour:14, minute:20}],
          "p6":[{hour:14, minute:20},{hour:14, minute:23}],
          "8":[{hour:14, minute:23},{hour:14, minute:55}]
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
              period:getPeriodInfo(period)
          }
        }
        for(period in periods){
          if (!periods.hasOwnProperty(period)) continue;
          if(!dropped.includes(parseInt(period))){
            push(session, period)
            session++
          }
        }
        for(sess in schedule.schedule.sessions){
          if(parseInt(schedule.schedule.sessions[sess]) == NaN){
            console.log(sess)
            // is it the period before a dropped period
            for(i in dropped){
              if(parseFloat(sess) == dropped[i]) break;
            }
            push(sess, sess=="Break"||sess=="Lunch"?sess:"Passing Period")
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
                period:getPeriodInfo(period)
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
  if(!now) now = DateTime.local();
  var thisPeriod = getPeriod(now)
  if(thisPeriod){
    var otherNow = thisPeriod.end.plus({minutes:4})
  }else{
    var otherNow = now.plus({minutes:4})
  }
  console.log(otherNow)

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
  if(!now) now = DateTime.local();
  var min = 0;
  var max = schedule.days_off.length-1;
  var half;
  for(i in schedule.days_off){
    half = Math.floor((max+min)/2)
    console.log("min", min, "max", max, "half", half, "half pointing to", schedule.days_off[half].name)
    if(now > schedule.days_off[half].dates[0]){
      if(min == half) break
      min = half;
    }else if(now < schedule.days_off[half].dates[0]){
      if(max == half) break
      max = half;
    }else if(now.toLocaleString() == schedule.days_off[half].dates[0].toLocaleString()){
      return [half, schedule.days_off[half], "today"]
    }
  }
  return [half, schedule.days_off[half], "next"]
}
