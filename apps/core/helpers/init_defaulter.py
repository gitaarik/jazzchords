class InitDefaulter():

    _init_defaults = {}

    def __init__(self, *args, **kwargs):

        for name, value in self._init_defaults.items():
            if name not in kwargs:
                kwargs[name] = value

        super().__init__(*args, **kwargs)
