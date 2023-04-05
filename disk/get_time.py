import time
import datetime

class Time_now():
    def __init__(self, timedelta):

        self.offset = datetime.timezone(datetime.timedelta(hours=timedelta))

        self.data_base_str = "%H:%M:%S|%d.%m.%Y"

    def get_date_now(self):
        return datetime.datetime.now(self.offset).strftime("%d.%m.%Y")

    def get_time_now(self):
        return datetime.datetime.now(self.offset).strftime("%H:%M:%S")

    def get_all_now(self, separator='|'):
        return self.get_time_now() + separator + self.get_date_now()

def add_time_date(date, count):
    date = datetime.datetime.strptime(date, "%d.%m")
    need_date = date + datetime.timedelta(days=count)
    return need_date.strftime('%d.%m')
