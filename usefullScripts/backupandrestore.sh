# backup dev
# mysqldump -u b0617bae293920 -pab7df93a -h us-cdbr-east-05.cleardb.net heroku_3ec2a5de6342e8b > db_backup_dev.sql

# backup production
/opt/lampp/bin/mysqldump -u b63d28b763f2d8 -pe742f8a3 -h us-cdbr-iron-east-01.cleardb.net heroku_baf1eb8d5a744b9 > db_backup.sql

# restore from production into dev
# mysql -u b0617bae293920 -pab7df93a -h us-cdbr-east-05.cleardb.net heroku_3ec2a5de6342e8b < db_backup.sql

# -----initial setup-----
# SET PASSWORD FOR 'root'@'localhost' = PASSWORD('unicycle');
# CREATE DATABASE heroku_baf1eb8d5a744b9;

# pull from production to dev
/opt/lampp/bin/mysql -u root -punicycle -h localhost heroku_baf1eb8d5a744b9 < db_backup.sql

rm db_backup.sql
