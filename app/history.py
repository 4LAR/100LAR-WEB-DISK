
#
class History():
    def __init__(self, length=100, use_bool=True):

        self.history = []

        self.length = length
        self.use_bool = use_bool

        self.time = None

    # добавление элементов в историю
    def add(self, text, type=0):
        # types:
        # 0 - Авторизация
        # 1 - Выход
        # 2 - Загрузка (скачивание)
        # 3 - Выгрузка ()
        # 4 - копирование / перемещение
        # 5 - создание
        # 6 - Удаление
        # 7 - изменение
        # 8 - создание приложения
        # 9 - удаление приложения
        # 10 - изменение логинга
        # 11 - изменение пароля

        if self.use_bool:
            self.history.append([type, text, self.time.get_all_now(' | ')])
            if len(self.history) > self.length:
                self.history.pop(0)

    # очение истории
    def clear(self):
        self.history = []

    # получить историю
    def get(self):
        return self.history
