from debian:jessie

RUN apt-get update
RUN apt-get install -y git maven openjdk-7-jdk
RUN echo "no cache" && git clone -b master "https://github.com/Erylis01/cvut-webrtc.git"
WORKDIR "cvut-webrtc/kurento-agent"
RUN echo "#!/bin/bash" > start.sh
RUN echo "git pull" >> start.sh
RUN echo "mvn clean package" >> start.sh
RUN echo "mvn exec:java" >> start.sh
RUN chmod +x start.sh
ENTRYPOINT ["./start.sh"]
EXPOSE 8080
