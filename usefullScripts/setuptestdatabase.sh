export MYSQL_USER="${MYSQL_USER:=root}"
export MYSQL_PASSWORD="${MYSQL_PASSWORD:=unicycle}"

mysql -u $MYSQL_USER -p$MYSQL_PASSWORD -h 127.0.0.1 < test_data/testdata.sql
