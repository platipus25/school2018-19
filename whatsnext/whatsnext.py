import datetime
import json

class whatsnext():
    def __init__(self, datetimeIn = (None)):
        self.time = datetimeIn
        if(type(datetimeIn) != datetime.datetime):
            self.time = datetime.datetime.today()
        self.schedule_base = (json.loads(open("schedule2018_19.json").read()))
        self.periodInfo = {}
        self.scheduleToday = None
        self.scheduleToday = self.schedule()

    def now(self):
        if(self.time):
            return self.time
        else:
            return datetime.datetime.today()

    def dictToDate(self, dict):
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
        state = {"day":"monday"} # TODO: self.state
        day = state["day"]
        today_base = schedule[day]
        todaysObject = {}
        periodObj = None
        for period in today_base:
            periodObj_base = today_base[period]
            todaysObject[period] = {}
            periodObj = todaysObject[period]
            periodObj["start"] = self.dictToDate(periodObj_base["start"])
            periodObj["end"] = self.dictToDate(periodObj_base["end"])
            if periodObj_base["info"] != None:
                periodObj["info"] = {}
                if period in self.periodInfo:
                    periodObj["info"] = self.periodInfo[period]
                periodObj["info"]["period"] = period
        if todaysObject == {}:
            return None
        self.scheduleToday = todaysObject

        return self.scheduleToday

    @property
    def state(self):
        now = self.now()
        schedule = self.schedule_base
        state = {
            "day":None,
            "nextDayOff":None,
            "thisPeriod":None,
            "nextPeriod":None
        }

        if now.date() < self.dictToDate(schedule["school_year"]["start"]) or now.date() > self.dictToDate(schedule["school_year"]["end"]):
            state["day"] = "summer"

        days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
        day = days[now.weekday()]
        if day == "saturday" or day == "sunday":
            if state["day"] == None:
                state["day"] = "weekend"
        if state["day"] == None:
            state["day"] = day

        nextDayOff = None
        for obj in schedule["days_off"]:
            name = obj["name"]
            date = obj["date"]
            date = self.dictToDate(date)
            if(date > now.date()):
                nextDayOff = {"name":name, "date":date, "rel":"next"}
                break
            if(date == now.date()):
                nextDayOff = {"name":name, "date":date, "rel":"now"}
                break
        state["nextDayOff"] = nextDayOff

        if self.scheduleToday:
            scheduleToday = self.schedule()
            first = None
            last = None
            if "2" in scheduleToday:
                first = scheduleToday["2"]
            if "1" in scheduleToday:
                first = scheduleToday["1"]
            if "7" in scheduleToday:
                last = scheduleToday["7"]
            if "8" in scheduleToday:
                last = scheduleToday["8"]

            start = first["start"]
            end = last["end"]
            if now.time() < start:
                state["thisPeriod"] = "before school"
                state["nextPeriod"] = "before school"
            if now.time() > end:
                state["thisPeriod"] = "after school"
                state["nextPeriod"] = "after school"

            thisPeriod = state["thisPeriod"]
            for period in scheduleToday:
                periodObj = scheduleToday[period]
                if periodObj["end"] > now.time():
                    if periodObj["start"] <= now.time():
                        thisPeriod = periodObj
            state["thisPeriod"] = thisPeriod

            if(type(thisPeriod) == type({"imADictionary":True})):
                nextPeriod = state["nextPeriod"]
                fourMinutesFromEndOfThisPeriod = (now+datetime.timedelta(minutes=4)).time()
                for period in scheduleToday:
                    periodObj = scheduleToday[period]
                    if periodObj["end"] > fourMinutesFromEndOfThisPeriod:
                        if periodObj["start"] <= fourMinutesFromEndOfThisPeriod:
                            thisPeriod = periodObj
                state["nextPeriod"] = thisPeriod

        return state


if __name__ == "__main__":
    inst = whatsnext(datetime.datetime(2018, 11, 23, 10))
    print(inst.state)
