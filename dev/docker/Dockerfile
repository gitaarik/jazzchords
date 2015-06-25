FROM ubuntu
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
RUN apt-get -y update
RUN apt-get install -y git python3 python3-pip curl
RUN curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
RUN apt-get install -y nodejs
RUN useradd jazzchords
RUN git clone https://github.com/gitaarik/jazzchords.git /home/jazzchords/
RUN pip3 install -r /home/jazzchords/dev/pip_requirements.txt
RUN cd /home/jazzchords/dev/ && cat node_requirements.txt | xargs npm -g install
RUN cd /home/jazzchords/dev/ && gulp parsestatic
RUN cd /home/jazzchords/ && ./manage.py migrate
