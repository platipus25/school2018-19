whatsnext = {
  scheduleToday:null,
  scheduleTodayDate:null,
  getScheduleToday: function(now){
    if(!now) now = new Date()
    if(this.scheduleToday != null){
      return this.scheduleToday
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
    var todaysObject = schedule[day]// TODO: Fix object thing
    //console.log(todaysObject)
    this.scheduleToday = {}

    function timeToday(object, now){
      let otherNow = new Date(now.toString())
      console.log("Other Now for timeToday is"+otherNow)
      otherNow.setHours(object.hour, object.minute)
      return otherNow
    }

    for(period in todaysObject){
      let periodObject = todaysObject[period]
      //console.log(periodObject)
      periodObject.start = timeToday(periodObject.start, now)
      periodObject.end = timeToday(periodObject.end, now)
      periodObject.info = periodObject.info
    }
    console.log("Today's shcedule is ", todaysObject)
    this.scheduleToday = todaysObject
    this.scheduleTodayDate = now.toDateString()
    console.log(schedule[day])
    return this.scheduleToday
  }
}

console.log(new Date(2018, 9, 10))

/*function schedule2018_19(){
  let schedule = {
    monday:{
      "1":{
        period:"1",
        start:{hour:9, minute:28},
        end:{hour:10, minute:0},
        info:{}
      },
      "p1":{
        period:"p1",
        start:{hour:10, minute:0},
        end:{hour:10, minute:3},
        info:null
      },
      "2":{
        period:"2",
        start:{hour:10, minute:3},
        end:{hour:10, minute:35},
        info:{}
      },
      "p2":{
        period:"p2",
        start:{hour:10, minute:35},
        end:{hour:10, minute:38},
        info:null
      },
      "3":{
        period:"3",
        start:{hour:10, minute:38},
        end:{hour:11, minute:10},
        info:{}
      },
      "Break":{
        period:"Break",
        start:{hour:11, minute:10},
        end:{hour:11, minute:20},
        info:null
      },
      "p3":{
        period:"p3",
        start:{hour:11, minute:20},
        end:{hour:11, minute:23},
        info:null
      },
      "4":{
        period:"4",
        start:{hour:11, minute:23},
        end:{hour:11, minute:55},
        info:{}
      },
      "p4":{
        period:"p4",
        start:{hour:11, minute:55},
        end:{hour:11, minute:58},
        info:null
      },
      "5":{
        period:"5",
        start:{hour:11, minute:58},
        end:{hour:12, minute:30},
        info:{}
      },
      "Lunch":{
        period:"Lunch",
        start:{hour:12, minute:30},
        end:{hour:13, minute:10},
        info:null
      },
      "p5":{
        period:"p5",
        start:{hour:13, minute:10},
        end:{hour:13, minute:13},
        info:null
      },
      "6":{
        period:"6",
        start:{hour:13, minute:13},
        end:{hour:13, minute:45},
        info:{}
      },
      "p6":{
        period:"p6",
        start:{hour:13, minute:45},
        end:{hour:13, minute:48},
        info:null
      },
      "7":{
        period:"7",
        start:{hour:13, minute:48},
        end:{hour:14, minute:20},
        info:{}
      },
      "p6":{
        period:"p6",
        start:{hour:14, minute:20},
        end:{hour:14, minute:23},
        info:null
      },
      "8":{
        period:"8",
        start:{hour:14, minute:23},
        end:{hour:14, minute:55},
        info:{}
      }
    },
    tuesday:{
      "2":{
    		period:"2",
    		start:{hour:7, minute:55},
    		end:{hour:8, minute:59},
    		info:{}
    	},
      "p2":{
    		period:"p2",
    		start:{hour:8, minute:59},
    		end:{hour:9, minute:2},
    		info:{}
    	},
      "3":{
    		period:"3",
    		start:{hour:9, minute:2},
    		end:{hour:10, minute:0},
    		info:{}
    	},
      "Break":{
    		period:"Break",
    		start:{hour:10, minute:0},
    		end:{hour:10, minute:10},
    		info:{}
    	},
      "p3":{
    		period:"p3",
    		start:{hour:10, minute:10},
    		end:{hour:10, minute:13},
    		info:{}
    	},
      "4":{
    		period:"4",
    		start:{hour:10, minute:13},
    		end:{hour:11, minute:11},
    		info:{}
    	},
      "p4":{
    		period:"p4",
    		start:{hour:11, minute:11},
    		end:{hour:11, minute:14},
    		info:{}
    	},
      "6":{
    		period:"6",
    		start:{hour:11, minute:14},
    		end:{hour:12, minute:12},
    		info:{}
    	},
      "Lunch":{
    		period:"Lunch",
    		start:{hour:12, minute:12},
    		end:{hour:12, minute:52},
    		info:{}
    	},
      "p5":{
    		period:"p5",
    		start:{hour:12, minute:52},
    		end:{hour:12, minute:56},
    		info:{}
    	},
      "7":{
    		period:"7",
    		start:{hour:12, minute:56},
    		end:{hour:13, minute:54},
    		info:{}
    	},
      "p6":{
    		period:"p6",
    		start:{hour:13, minute:54},
    		end:{hour:13, minute:57},
    		info:{}
    	},
      "8":{
    		period:"8",
    		start:{hour:13, minute:57},
    		end:{hour:14, minute:55},
    		info:{}
    	}
    },
    wednesday:{
      "1":{
    		period:"1",
    		start:{hour:7, minute:55},
    		end:{hour:8, minute:59},
    		info:{}
    	},
      "p2":{
    		period:"p2",
    		start:{hour:8, minute:59},
    		end:{hour:9, minute:2},
    		info:{}
    	},
      "3":{
    		period:"3",
    		start:{hour:9, minute:2},
    		end:{hour:10, minute:0},
    		info:{}
    	},
      "Break":{
    		period:"Break",
    		start:{hour:10, minute:0},
    		end:{hour:10, minute:10},
    		info:{}
    	},
      "p3":{
    		period:"p3",
    		start:{hour:10, minute:10},
    		end:{hour:10, minute:13},
    		info:{}
    	},
      "4":{
    		period:"4",
    		start:{hour:10, minute:13},
    		end:{hour:11, minute:11},
    		info:{}
    	},
      "p4":{
    		period:"p4",
    		start:{hour:11, minute:11},
    		end:{hour:11, minute:14},
    		info:{}
    	},
      "5":{
    		period:"5",
    		start:{hour:11, minute:14},
    		end:{hour:12, minute:12},
    		info:{}
    	},
      "Lunch":{
    		period:"Lunch",
    		start:{hour:12, minute:12},
    		end:{hour:12, minute:52},
    		info:{}
    	},
      "p5":{
    		period:"p5",
    		start:{hour:12, minute:52},
    		end:{hour:12, minute:56},
    		info:{}
    	},
      "7":{
    		period:"7",
    		start:{hour:12, minute:56},
    		end:{hour:13, minute:54},
    		info:{}
    	},
      "p6":{
    		period:"p6",
    		start:{hour:13, minute:54},
    		end:{hour:13, minute:57},
    		info:{}
    	},
      "8":{
    		period:"8",
    		start:{hour:13, minute:57},
    		end:{hour:14, minute:55},
    		info:{}
    	}
    },
    thursday:{
      "1":{
    		period:"1",
    		start:{hour:7, minute:55},
    		end:{hour:8, minute:59},
    		info:{}
    	},
      "p2":{
    		period:"p2",
    		start:{hour:8, minute:59},
    		end:{hour:9, minute:2},
    		info:{}
    	},
      "2":{
    		period:"2",
    		start:{hour:9, minute:2},
    		end:{hour:10, minute:0},
    		info:{}
    	},
      "Break":{
    		period:"Break",
    		start:{hour:10, minute:0},
    		end:{hour:10, minute:10},
    		info:{}
    	},
      "p3":{
    		period:"p3",
    		start:{hour:10, minute:10},
    		end:{hour:10, minute:13},
    		info:{}
    	},
      "4":{
    		period:"4",
    		start:{hour:10, minute:13},
    		end:{hour:11, minute:11},
    		info:{}
    	},
      "p4":{
    		period:"p4",
    		start:{hour:11, minute:11},
    		end:{hour:11, minute:14},
    		info:{}
    	},
      "5":{
    		period:"5",
    		start:{hour:11, minute:14},
    		end:{hour:12, minute:12},
    		info:{}
    	},
      "Lunch":{
    		period:"Lunch",
    		start:{hour:12, minute:12},
    		end:{hour:12, minute:52},
    		info:{}
    	},
      "p5":{
    		period:"p5",
    		start:{hour:12, minute:52},
    		end:{hour:12, minute:56},
    		info:{}
    	},
      "6":{
    		period:"6",
    		start:{hour:12, minute:56},
    		end:{hour:13, minute:54},
    		info:{}
    	},
      "p6":{
    		period:"p6",
    		start:{hour:13, minute:54},
    		end:{hour:13, minute:57},
    		info:{}
    	},
      "8":{
    		period:"8",
    		start:{hour:13, minute:57},
    		end:{hour:14, minute:55},
    		info:{}
    	}
    },
    friday:{
      "1":{
    		period:"1",
    		start:{hour:7, minute:55},
    		end:{hour:8, minute:59},
    		info:{}
    	},
      "p2":{
    		period:"p2",
    		start:{hour:8, minute:59},
    		end:{hour:9, minute:2},
    		info:{}
    	},
      "2":{
    		period:"2",
    		start:{hour:9, minute:2},
    		end:{hour:10, minute:0},
    		info:{}
    	},
      "Break":{
    		period:"Break",
    		start:{hour:10, minute:0},
    		end:{hour:10, minute:10},
    		info:{}
    	},
      "p3":{
    		period:"p3",
    		start:{hour:10, minute:10},
    		end:{hour:10, minute:13},
    		info:{}
    	},
      "3":{
    		period:"3",
    		start:{hour:10, minute:13},
    		end:{hour:11, minute:11},
    		info:{}
    	},
      "p4":{
    		period:"p4",
    		start:{hour:11, minute:11},
    		end:{hour:11, minute:14},
    		info:{}
    	},
      "5":{
    		period:"5",
    		start:{hour:11, minute:14},
    		end:{hour:12, minute:12},
    		info:{}
    	},
      "Lunch":{
    		period:"Lunch",
    		start:{hour:12, minute:12},
    		end:{hour:12, minute:52},
    		info:{}
    	},
      "p5":{
    		period:"p5",
    		start:{hour:12, minute:52},
    		end:{hour:12, minute:56},
    		info:{}
    	},
      "6":{
    		period:"6",
    		start:{hour:12, minute:56},
    		end:{hour:13, minute:54},
    		info:{}
    	},
      "p6":{
    		period:"p6",
    		start:{hour:13, minute:54},
    		end:{hour:13, minute:57},
    		info:{}
    	},
      "7":{
    		period:"7",
    		start:{hour:13, minute:57},
    		end:{hour:14, minute:55},
    		info:{}
    	}
    },
    minimum:{
      "1":{
    		period:"1",
    		start:{hour:7, minute:55},
    		end:{hour:8, minute:26},
    		info:{}
    	},
      "p2":{
    		period:"p2",
    		start:{hour:8, minute:26},
    		end:{hour:8, minute:29},
    		info:{}
    	},
      "2":{
    		period:"2",
    		start:{hour:8, minute:29},
    		end:{hour:8, minute:58},
    		info:{}
    	},
      "p3":{
    		period:"p3",
    		start:{hour:8, minute:58},
    		end:{hour:9, minute:01},
    		info:{}
    	},
      "3":{
    		period:"3",
    		start:{hour:9, minute:01},
    		end:{hour:9, minute:30},
    		info:{}
    	},
      "p4":{
    		period:"p4",
    		start:{hour:9, minute:30},
    		end:{hour:9, minute:33},
    		info:{}
    	},
      "4":{
    		period:"4",
    		start:{hour:9, minute:33},
    		end:{hour:10, minute:02},
    		info:{}
    	},
      "Break":{
    		period:"Break",
    		start:{hour:10, minute:02},
    		end:{hour:10, minute:12},
    		info:{}
    	},
      "p5":{
    		period:"p5",
    		start:{hour:10, minute:12},
    		end:{hour:10, minute:15},
    		info:{}
    	},
      "5":{
    		period:"5",
    		start:{hour:10, minute:15},
    		end:{hour:10, minute:44},
    		info:{}
    	},
      "p6":{
    		period:"p6",
    		start:{hour:10, minute:44},
    		end:{hour:10, minute:47},
    		info:{}
    	},
      "6":{
    		period:"6",
    		start:{hour:10, minute:47},
    		end:{hour:11, minute:16},
    		info:{}
    	},
      "p7":{
    		period:"p7",
    		start:{hour:11, minute:16},
    		end:{hour:11, minute:19},
    		info:{}
    	},
      "7":{
    		period:"7",
    		start:{hour:11, minute:19},
    		end:{hour:11, minute:48},
    		info:{}
    	},
      "p8":{
    		period:"p8",
    		start:{hour:11, minute:48},
    		end:{hour:11, minute:51},
    		info:{}
    	},
      "8":{
    		period:"8",
    		start:{hour:11, minute:51},
    		end:{hour:12, minute:20},
    		info:{}
    	}
    },
    minimum_days:[
      {name:"First Day Of School", date:new Date(2018, 7, 20)},
      {name:"Back To School Night", date:new Date(2018, 7, 28)},
      {name:"School Conferences", date:new Date(2018, 9, 1)},
      {name:"School Conferences", date:new Date(2018, 9, 2)},
      {name:"School Conferences", date:new Date(2018, 9, 3)},
      {name:"School Conferences", date:new Date(2018, 9, 4)},
      {name:"School Conferences", date:new Date(2018, 9, 5)},
      {name:"End of First Trimester", date:new Date(2018, 10, 2)},
      {name:"End of Second Trimester", date:new Date(2019, 1, 15)},
      {name:"End of Third Trimester", date:new Date(2019, 4, 24)},
      {name:"Last Day of School", date:new Date(2019, 5, 7)}
    ],
    days_off:[
  		{name: "Labor Day", date:new Date(2018, 8, 3)},
  		{name: "Veterans Day", date:new Date(2018, 10, 12)},
  		{name: "Thanksgiving Break", date:new Date(2018, 10, 21)},
      {name: "Thanksgiving Break", date:new Date(2018, 10, 22)},
      {name: "Thanksgiving Break", date:new Date(2018, 10, 23)},
  		{name: "Winter/Holiday Break", date:new Date(2018, 11, 24)},
      {name: "Winter/Holiday Break", date:new Date(2018, 11, 25)},
      {name: "Winter/Holiday Break", date:new Date(2018, 11, 26)},
      {name: "Winter/Holiday Break", date:new Date(2018, 11, 27)},
      {name: "Winter/Holiday Break", date:new Date(2018, 11, 28)},
      {name: "Winter/Holiday Break", date:new Date(2018, 11, 31)},
      {name: "Winter/Holiday Break", date:new Date(2019, 0, 1)},
      {name: "Winter/Holiday Break", date:new Date(2019, 0, 2)},
      {name: "Winter/Holiday Break", date:new Date(2019, 0, 3)},
      {name: "Winter/Holiday Break", date:new Date(2019, 0, 4)},
      {name: "Staff Development Day", date:new Date(2019, 0, 07)},
  		{name: "Martin Luther King Jr Day", date:new Date(2019, 0, 21)},
  		{name: "Spring Break", date:new Date(2019, 1, 19)},
      {name: "Spring Break", date:new Date(2019, 1, 20)},
      {name: "Spring Break", date:new Date(2019, 1, 21)},
      {name: "Spring Break", date:new Date(2019, 1, 22)},
      {name: "St Patrick's day", date:new Date(2019, 2, 18)},
  		{name: "Staff Development Day", date:new Date(2019, 2, 19)},
  		{name: "Spring Break", date:new Date(2019, 3, 15)},
      {name: "Spring Break", date:new Date(2019, 3, 16)},
      {name: "Spring Break", date:new Date(2019, 3, 17)},
      {name: "Spring Break", date:new Date(2019, 3, 18)},
      {name: "Spring Break", date:new Date(2019, 3, 19)},
      {name: "Memorial Day", date:new Date(2019, 4, 27)}
  	],
    school_year:{start:new Date(2018, 7, 20), end:new Date(2019, 5, 7)}
  }
  console.log(schedule)
  return schedule
}
schedule2018_19()*/
  // (".+"):\[(\S+ \S+}),(\S+ \S+})] => $1:{\n\tperiod:$1,\n\tstart:$2,\n\tend:$3,\n\tinfo:null\n}
whatsnext.getScheduleToday(new Date())

/*
{
  period:null,
  start:null,

}*/
