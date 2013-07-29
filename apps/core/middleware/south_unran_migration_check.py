from south import migration
from south.models import MigrationHistory


class SouthUnranMigrationCheck(object):

    def process_request(self, request):
        '''
        Checks if you ran all South migrations. If not, it will throw an
        exception (DidNotApplyAllMigrations).
        '''

        unapplied_migrations = self.unapplied_migrations()

        if len(unapplied_migrations) > 0:

            message = u'You haven\'t run the following migrations: {}'.format(
                u''.join(
                    [u'\n  "{}" in app "{}".'.format(name, app)
                    for name, app in unapplied_migrations]
                )
            )

            raise DidNotApplyAllMigrations(message)

    def unapplied_migrations(self):
        '''
        Returns a list of tuples of unapplied migrations. The tuples consist of
        a migration name and an app label.
        '''

        applied_migrations = self.applied_migrations()
        unapplied_migrations = []

        for app_migration_files in migration.all_migrations():

            for migration_file in app_migration_files:

                app_label = migration_file.app_label()
                migration_name = migration_file.name()

                if migration_name not in applied_migrations[app_label]:
                    unapplied_migrations.append((migration_name, app_label))

        return unapplied_migrations

    def applied_migrations(self):
        '''
        Returns a dictionary with the app name in the key, and a list of
        migrations in the value.
        '''

        applied_migrations = {}

        for applied_migration in MigrationHistory.objects.all():

            if applied_migration.app_name not in applied_migrations:
                applied_migrations[applied_migration.app_name] = []

            applied_migrations[applied_migration.app_name].append(
                applied_migration.migration)

        return applied_migrations


class DidNotApplyAllMigrations(Exception):
    '''
    Exception that indicates that you havent run all migrations.
    '''
    pass
