FROM node:5.6.0

WORKDIR /code

COPY package.json /code/package.json
RUN cd /code; npm install;
COPY . /code

CMD []
ENTRYPOINT ["npm", "start"]

