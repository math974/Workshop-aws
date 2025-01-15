### Start lambda back-end with SAM 

``` bash
sam build
sam local start-api --port 3001
```

### Create mysql database with docker in localhost

``` bash
docker run --name mysql-local \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_USER=myuser \
  -e MYSQL_PASSWORD=mypassword \
  -v /path/to/init.sql:/docker-entrypoint-initdb.d/init.sql \
  -p 3306:3306 \
  -d mysql:latest

docker exec -it some_mysql_container mysql -uroot -ppassword
```