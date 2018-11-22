import datetime
import json

class whatsnext():
    def __init__(self, datetimeIn = (None)):
        self.time = datetimeIn
        self.schedule_base = (json.loads(open("schedule2018_19.json").read()))
        self.periodInfo = {}
        self.scheduleToday = None # self.schedule()

    def now(self):
        if(self.time):
            return self.time
        else:
            return datetime.datetime.today()

    def dictToDate(dict):
        if "year" in dict:
            return datetime.date(dict["year"], dict["month"], dict["day"])
        elif "minute" in dict:
            return datetime.time(dict["hour"], dict["minute"])

    def schedule(self):
        now = self.now()
        schedule = self.schedule_base
        if self.time and now.date() == self.time.date() and self.scheduleToday:
            return self.scheduleToday
        self.scheduleToday = False
        state = {"day":"monday"} # this.state()
        day = state["day"]
        today_base = schedule[day]
        todaysObject = {}
        for period in today_base:
            periodObj = today_base[period]
            todaysObject[period] = {}
            todaysObject[period]["start"] = self.dictToDate((periodObj["start"])
            todaysObject[period]["end"] = self.dictToDate((periodObj["end"]))
            if periodObject[info] != None:
                todaysObject[period]["info"] = {}
                if period in self.periodInfo:
                    todaysObject[period]["info"] = self.periodInfo[period]
                todaysObject[period]["info"]["period"] = period
        if today_base == None:
            return None # TODO: FIx
        self.scheduleToday = todaysObject

        return self.scheduleToday

if __name__ == "__main__":
    inst = whatsnext()
    print(inst.schedule())
