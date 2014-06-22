JazzChords.org
===========

Create and share good looking chord charts.

### Normal view:
![Normal view](https://raw.githubusercontent.com/gitaarik/jazzchords.org/master/screenshots/normal_view.png)

### Edit view:
![Edit view](https://raw.githubusercontent.com/gitaarik/jazzchords.org/master/screenshots/edit_view.png)

Requirements
------------

- Python 3.3 - http://www.python.org/
- pip - http://www.pip-installer.org/
- virtualenv - http://www.virtualenv.org/

Installation
------------

1. Create a directory for the project and cd there.

        mkdir jazzchords.org
        cd jazzchords.org

2. Create a virtual environment and activate it.

        virtualenv --python=python3 env
        . env/bin/activate

3. Clone the project in the src dir and cd there.

        git clone git@github.com:gitaarik/jazzchords.org.git src
        cd src

4. Install requirements in virtual environment. This could take some time.

        pip install -r dev/requirements.txt

5. Sync the database. It will ask you to create a superuser, do this, this will be your login for the admin panel later on.

        ./manage.py syncdb --migrate

5. Load the developer database.

        ./manage.py loaddata dev/db-dump.json

6. You're done! You can now run the development server.

        ./manage.py runserver


Development
-----------

You can see all the songs currently in the database here:
[http://localhost:8000/chart/index/](http://localhost:8000/chart/index/).

You can access the admin panel from:
[http://localhost:8000/admin/](http://localhost:8000/admin/).
Log in with credentials created in step 5.

The project uses Django 1.8 as it's framework. Information and
documentation about this:
[https://docs.djangoproject.com/en/dev/](https://docs.djangoproject.com/en/dev/).

If you have any questions, suggestions or comments, send me a
[mail](mailto:rik@jazzchords.org).
