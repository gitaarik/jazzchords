# Deploys JazzChords for a production environment
#
# - Creates the virtualenv in /dev/virtual-env/
# - Installs Pip and Node.js requirements inside virtual env
# - Compiles JS/CSS
# - Collects the static files from Django
# - Loads the base data into the database

set -e

# Go to the directory this file is in
cd $(dirname $0)

echo 
echo Creating the virutalenv
echo ==========================================
virtualenv --python=python3 virtual-env
source virtual-env/bin/activate


echo 
echo Installing pip requirements
echo ==========================================
pip install -r pip_requirements.txt


echo 
echo Installing Node.js inside the virtualenv
echo ==========================================
nodeenv -p


echo 
echo Installing Node.js requirements
echo ==========================================
cat node_requirements.txt | while read req; do npm install $req; done


echo 
echo Compiling JS/CSS
echo ==========================================
$(npm bin)/gulp parsestatic


# Changing to root dir where Django's manage.py is
cd ..

echo 
echo Collect static files from Django
echo ==========================================
./manage.py collectstatic --noinput


echo 
echo Importing the base data into the database
echo ==========================================
./manage.py loaddata dev/base-data-dump.json
