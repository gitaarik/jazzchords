FROM ubuntu
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
RUN apt-get -y update

# Install wget and curl
RUN apt-get -y update
RUN apt-get install -y wget curl

# Add elasticsearch apt repository
RUN wget -qO - https://packages.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
RUN echo "deb http://packages.elastic.co/elasticsearch/2.x/debian stable main" | sudo tee -a /etc/apt/sources.list.d/elasticsearch-2.x.list

# Add node.js apt repository
RUN curl -sL https://deb.nodesource.com/setup | sudo bash -

# Install required packages
RUN apt-get -y update
RUN apt-get install -y elasticsearch git nodejs postgresql postgresql-server-dev-all python3 python3-pip

# Set up postgres
USER postgres
RUN service postgresql start && createuser jazzchords && createdb -O jazzchords jazzchords

# Add jazzchords user
USER root
RUN useradd jazzchords
RUN mkdir /home/jazzchords
RUN chown jazzchords:jazzchords /home/jazzchords/

# Get the code and make it ready
USER jazzchords
RUN export REVISION=2
RUN git clone https://github.com/gitaarik/jazzchords.git /home/jazzchords/
RUN echo "ENVIRONMENT = 'production'" > /home/jazzchords/settings/environment.py

# Parse static files
RUN cd /home/jazzchords/dev/ && npm install
RUN cd /home/jazzchords/dev/ && node_modules/.bin/gulp parsestatic

# Install pip requirements
USER root
RUN pip3 install -r /home/jazzchords/dev/pip_requirements.txt
RUN pip3 install -r /home/jazzchords/dev/pip_requirements_production.txt

# Migrate
RUN service postgresql start && cd /home/jazzchords/ && su jazzchords -c "./manage.py migrate" && su jazzchords -c "./manage.py loaddata dev/data-dump.json"
