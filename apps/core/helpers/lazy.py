class LazyObj():
    """
    A class that takes a function to lazily create itself when needed.

    Example:

        def make_my_obj():
            return late_string

        my_obj = LazyObj(make_my_obj)

        late_string = "I'm a bit late"

        print(my_obj)

    The method `make_my_obj` will only be called at the `print()`
    function, because only the `print()` function is accesing the
    object's properties.

    This is useful when the function `make_my_obj()` needs to wait for
    initialization of other components (`late_string`) and the object's
    properties are not accesed before this.

    Note that `make_my_obj()` will only be called once, after this, the
    initialized object will be reused.
    """

    def __init__(self, lazy_func):
        self.lazy_func = lazy_func

    def __getattribute__(self, name):

        try:
            lazy_obj = object.__getattribute__(self, 'lazy_obj')
        except AttributeError:
            object.__setattr__(
                self,
                'lazy_obj',
                object.__getattribute__(self, 'lazy_func')()
            )
            lazy_obj = object.__getattribute__(self, 'lazy_obj')

        return object.__getattribute__(lazy_obj, name)

    def __str__(self, *args, **kwargs):
        return self.__str__(*args, **kwargs)

    def __format__(self, *args, **kwargs):
        return self.__format__(*args, **kwargs)

    def __abs__(self, *args, **kwargs):
        return self.__abs__(*args, **kwargs)

    def __add__(self, *args, **kwargs):
        return self.__add__(*args, **kwargs)

    def __all__(self, *args, **kwargs):
        return self.__all__(*args, **kwargs)

    def __and__(self, *args, **kwargs):
        return self.__and__(*args, **kwargs)

    def __builtins__(self, *args, **kwargs):
        return self.__builtins__(*args, **kwargs)

    def __cached__(self, *args, **kwargs):
        return self.__cached__(*args, **kwargs)

    def __concat__(self, *args, **kwargs):
        return self.__concat__(*args, **kwargs)

    def __contains__(self, *args, **kwargs):
        return self.__contains__(*args, **kwargs)

    def __delitem__(self, *args, **kwargs):
        return self.__delitem__(*args, **kwargs)

    def __doc__(self, *args, **kwargs):
        return self.__doc__(*args, **kwargs)

    def __eq__(self, *args, **kwargs):
        return self.__eq__(*args, **kwargs)

    def __file__(self, *args, **kwargs):
        return self.__file__(*args, **kwargs)

    def __floordiv__(self, *args, **kwargs):
        return self.__floordiv__(*args, **kwargs)

    def __ge__(self, *args, **kwargs):
        return self.__ge__(*args, **kwargs)

    def __getitem__(self, *args, **kwargs):
        return self.__getitem__(*args, **kwargs)

    def __gt__(self, *args, **kwargs):
        return self.__gt__(*args, **kwargs)

    def __iadd__(self, *args, **kwargs):
        return self.__iadd__(*args, **kwargs)

    def __iand__(self, *args, **kwargs):
        return self.__iand__(*args, **kwargs)

    def __iconcat__(self, *args, **kwargs):
        return self.__iconcat__(*args, **kwargs)

    def __ifloordiv__(self, *args, **kwargs):
        return self.__ifloordiv__(*args, **kwargs)

    def __ilshift__(self, *args, **kwargs):
        return self.__ilshift__(*args, **kwargs)

    def __imod__(self, *args, **kwargs):
        return self.__imod__(*args, **kwargs)

    def __imul__(self, *args, **kwargs):
        return self.__imul__(*args, **kwargs)

    def __index__(self, *args, **kwargs):
        return self.__index__(*args, **kwargs)

    def __inv__(self, *args, **kwargs):
        return self.__inv__(*args, **kwargs)

    def __invert__(self, *args, **kwargs):
        return self.__invert__(*args, **kwargs)

    def __ior__(self, *args, **kwargs):
        return self.__ior__(*args, **kwargs)

    def __ipow__(self, *args, **kwargs):
        return self.__ipow__(*args, **kwargs)

    def __irshift__(self, *args, **kwargs):
        return self.__irshift__(*args, **kwargs)

    def __isub__(self, *args, **kwargs):
        return self.__isub__(*args, **kwargs)

    def __itruediv__(self, *args, **kwargs):
        return self.__itruediv__(*args, **kwargs)

    def __ixor__(self, *args, **kwargs):
        return self.__ixor__(*args, **kwargs)

    def __le__(self, *args, **kwargs):
        return self.__le__(*args, **kwargs)

    def __loader__(self, *args, **kwargs):
        return self.__loader__(*args, **kwargs)

    def __lshift__(self, *args, **kwargs):
        return self.__lshift__(*args, **kwargs)

    def __lt__(self, *args, **kwargs):
        return self.__lt__(*args, **kwargs)

    def __mod__(self, *args, **kwargs):
        return self.__mod__(*args, **kwargs)

    def __mul__(self, *args, **kwargs):
        return self.__mul__(*args, **kwargs)

    def __name__(self, *args, **kwargs):
        return self.__name__(*args, **kwargs)

    def __ne__(self, *args, **kwargs):
        return self.__ne__(*args, **kwargs)

    def __neg__(self, *args, **kwargs):
        return self.__neg__(*args, **kwargs)

    def __not__(self, *args, **kwargs):
        return self.__not__(*args, **kwargs)

    def __or__(self, *args, **kwargs):
        return self.__or__(*args, **kwargs)

    def __package__(self, *args, **kwargs):
        return self.__package__(*args, **kwargs)

    def __pos__(self, *args, **kwargs):
        return self.__pos__(*args, **kwargs)

    def __pow__(self, *args, **kwargs):
        return self.__pow__(*args, **kwargs)

    def __rshift__(self, *args, **kwargs):
        return self.__rshift__(*args, **kwargs)

    def __setitem__(self, *args, **kwargs):
        return self.__setitem__(*args, **kwargs)

    def __spec__(self, *args, **kwargs):
        return self.__spec__(*args, **kwargs)

    def __sub__(self, *args, **kwargs):
        return self.__sub__(*args, **kwargs)

    def __truediv__(self, *args, **kwargs):
        return self.__truediv__(*args, **kwargs)

    def __xor__(self, *args, **kwargs):
        return self.__xor__(*args, **kwargs)


class LazyStr(LazyObj):
    """
    Extends the `LazyObj` behavior with `str` specific behavior.
    """

    def __imod__(self, *args, **kwargs):
        """
        The `str` object doesn't have an `__imod__` implementation, but
        it is called by `LazyObj.__getattribute__()` when the format and
        assignment syntax is used:

            awesome = LazyStr(lambda: "Hello %s")
            awesome %= "World"

        So we return the default `__mod__` method here, because the
        functionality is the same.
        """
        return self.__mod__(*args, **kwargs)
