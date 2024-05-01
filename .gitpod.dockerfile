FROM gitpod/workspace-mongodb

RUN mkdir -p /workspace/mongodb-data
CMD mongod --dbpath /workspace/mongodb-data --bind_ip_all