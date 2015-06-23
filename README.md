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
- Node.js - http://www.nodejs.org/

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

4. Install requirements in virtual environment. This could take some
   time.

        pip install -r dev/pip_requirements.txt
        pip install -r dev/pip_requirements_dev.txt

5. Install nodeenv in this virtualenv.

        nodeenv -p

6. Install the required global and local node modules in
   `dev/node_requirements.txt`. Make sure to do this from the `dev/`
   directory, because the `node_modules` directory for the local node
   requirements should be located in there.

7. Parse the static files.

        gulp parsestatic

    In development you can use `gulp watchit`, it will watch the `js/`
    and `css/` directory for changes and parses them on the fly.

7. Migrate the database. It will ask you to create a superuser, do this,
   this will be your login for the admin panel later on.

        ./manage.py migrate

8. Load the developer database.

        ./manage.py loaddata dev/db-dump.json

9. You're done! You can now run the development server.

        ./manage.py runserver


If you have any questions, suggestions or comments, send me a
[mail](mailto:rik@jazzchords.org).
