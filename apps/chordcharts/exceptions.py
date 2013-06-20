class SectionKeyDoesNotExist(Exception):

    def __str__(self):
        return '''The key for this section does not exist. This is
            probably because the section's key_distance_from_chart
            results in a key that has not yet been created.'''
