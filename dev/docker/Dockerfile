FROM ubuntu
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
RUN apt-get -y update
RUN apt-get install -y wget curl git python3 python3-pip postgresql postgresql-server-dev-all

# Add elasticsearch repository
RUN wget -qO - https://packages.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -

# Add Node.js repository
RUN echo "deb http://packages.elastic.co/elasticsearch/2.x/debian stable main" | sudo tee -a /etc/apt/sources.list.d/elasticsearch-2.x.list
RUN curl -sL https://deb.nodesource.com/setup | sudo bash -

# Now we can update the apt cache and install elasticsearch and Node.js
RUN apt-get -y update
RUN apt-get install -y elasticsearch nodejs

# Get the code and make it ready
RUN git clone https://github.com/gitaarik/jazzchords.git /home/jazzchords/
RUN echo "ENVIRONMENT = 'production'" > /home/jazzchords/settings/environment.py
RUN pip3 install -r /home/jazzchords/dev/pip_requirements.txt
RUN cd /home/jazzchords/dev/ && npm install
RUN cd /home/jazzchords/dev/ && node_modules/.bin/gulp parsestatic
RUN cd /home/jazzchords/ && ./manage.py migrate

# Add the jazzchords user and give him permissions to the code
RUN useradd jazzchords
