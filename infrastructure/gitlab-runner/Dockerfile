FROM gitlab/gitlab-runner:latest

RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y openjdk-17-jdk
RUN apt-get install -y software-properties-common
RUN apt-get install -y maven

# Install nvm with node and npm
RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.40.1/install.sh | bash \
    && . /root/.nvm/nvm.sh \
    && nvm install 20.18.0 \
    && nvm alias default 20.18.0 \
    && nvm use default

ENV NODE_PATH=/bin/versions/node/v20.18.0/lib/node_modules
ENV PATH=/bin/versions/node/v20.18.0/bin:$PATH

# Print the versions
RUN node -v
RUN npm -v
RUN mvn -v
RUN java --version

# Clean up the package lists to reduce image size
RUN rm -rf /var/lib/apt/lists/* 
