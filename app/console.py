import os
import multiprocessing
import termcolor

# класс для логирования и вывода информации в консоль
# изначально он писался для игрового движка
class console_term():
    def __init__(self, log_bool=True, log_time_bool=True, path=''):
        super().__init__()

        self.log_bool = log_bool
        self.log_time_bool = log_time_bool

        self.path = path

        os.system('color')

        self.type_color = [
            'white',
            'green',
            'yellow',
            'red'
        ]

        self.type_color_RGBA = [
            (180, 180, 180, 255),
            (0, 180, 0, 255),
            (180, 180, 0, 255),
            (180, 0, 0, 255)
        ]

        self.promt = ""
        
        self.warning_list = []

    # Функция для создания нового лог файла
    def create_log(self):
        if self.log_bool:
            self.str_data = self.time.get_date_now()

            i = 0
            while (True):
                self.file_name = self.path + self.str_data + ('' if i == 0 else ' (%d)' % i) + '.txt'
                if not os.path.exists(self.file_name):
                    open(self.file_name, 'w').close()
                    break

                else:
                    i += 1

    # Функция для получения списка лог файлов
    def get_all_logs(self):
        return os.listdir(self.path)

    # Получение содержимого лог файла
    def read_current_log(self, name):
        try:
            return open(self.path + name).read()

        except:
            return False

    def print(self, text, type=0, no_time_bool=False, print_bool=True):

        if self.time.get_date_now() != self.str_data:
            self.create_log()

        time_str = (('[' + str(self.time.get_all_now()) + '] ') if self.log_time_bool else '') if not no_time_bool else ''
        
        if print_bool:
            termcolor.cprint(time_str + str(text), self.type_color[type])

        if (type == 3):
            self.warning_list.append(time_str + str(text))
        
        if (self.log_bool):
            log_file = open(self.file_name, 'a')
            log_file.write(time_str + str(text) + '\n')
            log_file.close()
