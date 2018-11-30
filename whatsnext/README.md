
class whatsnext {
  const time // can be null
  const schedule_base // need to init
  var periodInfo // starts null
  var scheduleToday // need to init
  
  init(time){
    self.time = time
    
  }
  
  now(){
    returns self.time or newdate()
  }
  
  schedule(){
    returns schedule if it already exists (in scheduletoday) or if it is a new day
    
    gets what day it is
    finds the schedule for the day
    converts all the dates
    injects info if the period "deserves" it (passing period, lunch, break)
    
    sets scheduletoday to result
    returns result
  }
  
  state(){
    gets what day it is
    gets schedule and:
      finds this period
      finds next period
    gets next day off
  }
}
