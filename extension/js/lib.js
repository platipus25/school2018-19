var DateTime = luxon.DateTime;
var Interval = luxon.Interval;
var todaysSchedule = null;

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
    },
    minimum:{
      periods:{
        "1":[{hour:7, minute:55},{hour:8, minute:26}],
        "p2":[{hour:8, minute:26},{hour:8, minute:29}],
        "2":[{hour:8, minute:29},{hour:8, minute:58}],
        "p3":[{hour:8, minute:58},{hour:9, minute:01}],
        "3":[{hour:9, minute:01},{hour:9, minute:30}],
        "p4":[{hour:9, minute:30},{hour:9, minute:33}],
        "4":[{hour:9, minute:33},{hour:10, minute:02}],
        "Break":[{hour:10, minute:02},{hour:10, minute:12}],
        "p5":[{hour:10, minute:12},{hour:10, minute:15}],
        "5":[{hour:10, minute:15},{hour:10, minute:44}],
        "p6":[{hour:10, minute:44},{hour:10, minute:47}],
        "6":[{hour:10, minute:47},{hour:11, minute:16}],
        "p7":[{hour:11, minute:16},{hour:11, minute:19}],
        "7":[{hour:11, minute:19},{hour:11, minute:48}],
        "p8":[{hour:11, minute:48},{hour:11, minute:51}],
        "8":[{hour:11, minute:51},{hour:12, minute:20}]
      }
    },
    //(\S+) (\d+):(\d+) - (\d+):(\d+)
    // "$1":[{hour:$2, minute:$3},{hour:$4, minute:$5}],
    assembly:{
      periods:{
        "1":[{hour:7, minute:55},{hour:8, minute:36}],
        "p2":[{hour:8, minute:36},{hour:8, minute:39}],
        "2":[{hour:8, minute:39},{hour:9, minute:17}],
        "p3":[{hour:9, minute:17},{hour:9, minute:20}],
        "3":[{hour:9, minute:20},{hour:9, minute:58}],
        "p4":[{hour:9, minute:58},{hour:10, minute:1}],
        "4":[{hour:10, minute:1},{hour:10, minute:39}],
        "Break":[{hour:10, minute:39},{hour:10, minute:49}],
        "p5":[{hour:10, minute:49},{hour:10, minute:52}],
        "5":[{hour:10, minute:52},{hour:11, minute:30}],
        "p5":[{hour:11, minute:30},{hour:11, minute:33}],
        "6":[{hour:11, minute:33},{hour:12, minute:11}],
        "Lunch":[{hour:12, minute:11},{hour:12, minute:51}],
        "p7":[{hour:12, minute:51},{hour:12, minute:55}],
        "7":[{hour:12, minute:55},{hour:13, minute:33}],
        "p8A":[{hour:13, minute:33},{hour:13, minute:36}],
        "8A":[{hour:13, minute:36},{hour:14, minute:14}],
        "p8B":[{hour:14, minute:14},{hour:14, minute:17}],
        "8B":[{hour:14, minute:17},{hour:14, minute:55}],
      }
    },
    full_early_start:{
      periods:{
        "1":[{hour:7, minute:55},{hour:8, minute:42}],
        "p2":[{hour:8, minute:42},{hour:8, minute:45}],
        "2":[{hour:8, minute:45},{hour:9, minute:28}],
        "p3":[{hour:9, minute:28},{hour:9, minute:31}],
        "3":[{hour:9, minute:31},{hour:10, minute:14}],
        "Break":[{hour:10, minute:14},{hour:10, minute:24}],
        "p4":[{hour:10, minute:24},{hour:10, minute:27}],
        "4":[{hour:10, minute:27},{hour:11, minute:10}],
        "p5":[{hour:11, minute:10},{hour:11, minute:13}],
        "5":[{hour:11, minute:13},{hour:11, minute:56}],
        "Lunch":[{hour:11, minute:56},{hour:12, minute:36}],
        "p6":[{hour:12, minute:36},{hour:12, minute:40}],
        "6":[{hour:12, minute:40},{hour:13, minute:23}],
        "p7":[{hour:13, minute:23},{hour:13, minute:26}],
        "7":[{hour:13, minute:26},{hour:14, minute:9}],
        "p8":[{hour:14, minute:9},{hour:14, minute:12}],
        "8":[{hour:14, minute:12},{hour:14, minute:55}],
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
	],
  minimum_days:[
    {name:"First Day Of School", date:DateTime.local(2018, 8, 20)},
    {name:"Back To School Night", date:DateTime.local(2018, 8, 28)},
    {name:"School Conferences", date:DateTime.local(2018, 10, 1)},
    {name:"School Conferences", date:DateTime.local(2018, 10, 2)},
    {name:"School Conferences", date:DateTime.local(2018, 10, 3)},
    {name:"School Conferences", date:DateTime.local(2018, 10, 4)},
    {name:"School Conferences", date:DateTime.local(2018, 10, 5)},
    {name:"End of First Trimester", date:DateTime.local(2018, 11, 2)},
    {name:"End of Second Trimester", date:DateTime.local(2019, 2, 15)},
    {name:"End of Third Trimester", date:DateTime.local(2019, 5, 24)},
    {name:"Last Day of School", date:DateTime.local(2019, 6, 7)}
  ],
  assemblyDays:[

  ]
}


function timeToday(object, now){
    return now.set(object)
}

function getDayType(now){
  if(!now) now = DateTime.local()
  // regular, minimum, assembly
  for(let {name, date} of schedule.minimum_days){
    if(date.toISODate() == now.toISODate()){
      return "minimum"//[{name:name, dates:dates}, "now"]
    }
  }
/*
  for(let {name, date} of schedule.asembly){
    if(date.toISODate() == now.toISODate()){
      return "asembly"//[{name:name, dates:dates}, "now"]
    }
  }
*/
  return now.weekdayShort
}

function getScheduleToday(now){
  if(!now) now = DateTime.local()
  if(todaysSchedule != null && todaysSchedule) return todaysSchedule
  var dayType = getDayType(now)
  var output = {}
  console.log(output)
  console.log(dayType)
  function push(timeInput, timePeriod, infoPeriod){
    if(!infoPeriod) infoPeriod = timePeriod
    var info = {period:timePeriod}
    if(timePeriod[0] == "p") info.period = "Passing Period"
    if(!isNaN(parseInt(infoPeriod))) info = getPeriodInfo(infoPeriod)
    output[infoPeriod] = {
        start: timeToday(timeInput[timePeriod][0], now),
        end: timeToday(timeInput[timePeriod][1], now),
        interval:Interval.fromDateTimes(timeToday(timeInput[timePeriod][0], now), timeToday(timeInput[timePeriod][1], now)),
        period:info
    }
  }

  if(dayType == "minimum"){
    let minimumPeriods = schedule.schedule.minimum.periods;
    for(period in minimumPeriods){
      push(minimumPeriods, period)
    }
  }else if(dayType == "assembly"){
    let assemblyPeriods = schedule.schedule.assembly.periods;
    for(period in assemblyPeriods){
      push(assemblyPeriods, period)
    }
  }else if(dayType == "Mon"){
    for(period in dayObject.periods){
      push(dayObject.periods, period)
    }
  }else if(dayType != "Sat" && dayType != "Sun"){
    let dropped = schedule.schedule.days[dayType].dropped
    let sessions = schedule.schedule.sessions
    let periodsToday = [null]

    for(period in periods){
      if(!dropped.includes(parseInt(period))){
        periodsToday.push(period)
      }
    }

    for(session in sessions){
      if(isNaN(parseInt(session))){
        push(sessions, session)
      }else{
        push(sessions, session, periodsToday[session])
      }
    }
  }else{
      return null;
      console.error("Not min, Mon, or weekday")
  }

  console.log(output)
  todaysSchedule = output
  return todaysSchedule
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
  if(nextDayOff[1] == "now"){
    return [false, nextDayOff[0].name];
  }

  // is it before or after school
  var scheduleToday = getScheduleToday(now)
  let first = (scheduleToday[1] || scheduleToday[2])
  let last = (scheduleToday[7] || scheduleToday[8])
  var start = first.start
  var end = last.end
  if(getDayType(now) == "minimum") end = end.set({hour:12, minute:20}); console.error(end) // TODO : FIX THIS HERE!!
  if(now <= start) return [false, "Before School"];
  if(now >= end) return [false, "After School"];

  return [true, "Yup"];
}

function getNextDayOff(now){
  if(!now) now = DateTime.local();
  for(let {name, dates} of schedule.days_off){
    if(dates[0].toISODate() >= now.toISODate()){
      for(date of dates){
        console.log(date.toISODate())
        if(date.toISODate() == now.toISODate()){
          return [{name:name, dates:dates}, "now"]
        }
      }
      return [{name:name, dates:dates}, "next"]
    }
  }
}
