FROM ubuntu
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
RUN apt-get -y update
RUN apt-get install -y wget
RUN wget -qO - https://packages.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
RUN echo "deb http://packages.elastic.co/elasticsearch/2.x/debian stable main" | sudo tee -a /etc/apt/sources.list.d/elasticsearch-2.x.list
RUN apt-get -y update
RUN apt-get install -y git python3 python3-pip curl elasticsearch
RUN curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
RUN apt-get install -y nodejs
RUN useradd jazzchords
RUN git clone https://github.com/gitaarik/jazzchords.git /home/jazzchords/
RUN echo "ENVIRONMENT = 'production'" > /home/jazzchords/settings/environment.py
RUN pip3 install -r /home/jazzchords/dev/pip_requirements.txt
RUN cd /home/jazzchords/dev/ && npm install
RUN cd /home/jazzchords/dev/ && node_modules/.bin/gulp parsestatic
RUN cd /home/jazzchords/ && ./manage.py migrate
