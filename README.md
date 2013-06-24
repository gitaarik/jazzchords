Chordcharts
===========

Create and share good looking chord charts.

Requirements
------------

- Python 2.7 (http://www.python.org/)
- pip (http://www.pip-installer.org/)
- virtualenv (http://www.virtualenv.org/)
- less (http://lesscss.org/)

Installation
------------

1. Create a directory for the project and cd there.

        mkdir chordcharts
        cd chordcharts

2. Create a virtual environment and activate it.

        virtualenv --distribute env
        . env/bin/activate

3. Clone the project in the src dir and cd there.

        git clone git@github.com:gitaarik/chordcharts.git src
        cd src

4. Install requirements in virtual environment, this could take some time.

        pip install -r dev/requirements.txt

5. Sync the database. It will ask you to create a superuser, do this, this will be your login for the admin panel later on.

        ./manage.py syncdb --migrate

5. Load the developer database.

        ./manage.py loaddata dev/db-dump.json

6. You're done! You can now run the development server.

        ./manage.py runserver

    You can access the admin panel from: [http://localhost:8000/admin/](http://localhost:8000/admin/). Log in with credentials created in step 5
