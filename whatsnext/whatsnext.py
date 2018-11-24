import datetime
import json

class whatsnext():
    def __init__(self, datetimeIn = (None)):
        self.time = datetimeIn
        self.schedule_base = (json.loads(open("schedule2018_19.json").read()))
        self.periodInfo = {}
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
        state = {"day":"monday"} # TODO: this.state()
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
            first = scheduleToday[1] or scheduleToday[2] # TODO: fix this
            last = scheduleToday[8] or scheduleToday[7]
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
            state.thisPeriod = thisPeriod

            print(type(thisPeriod))

        return state


if __name__ == "__main__":
    inst = whatsnext()#datetime.datetime(2018, 11, 23, 8))
    print(inst.scheduleToday, inst.state)
