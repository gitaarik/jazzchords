def number_to_ordinal(number):
    """
    Converts the given `number` to an ordinal like "1st", "2nd", "3rd"
    etc.
    """
    return '{}{}'.format(
        number,
        'tsnrhtdd'[
            (
                (number / 10 % 10 != 1)
                * (number % 10 < 4)
                * number % 10
            )::4
        ]
    )
