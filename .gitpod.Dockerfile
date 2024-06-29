FROM gitpod/workspace-full:latest

RUN curl -fsSL https://bun.sh/install | bash

ENV PATH="/home/gitpod/.bun/bin:$PATH"

RUN sudo apt-get update && sudo apt-get install -y mongodb-clients
