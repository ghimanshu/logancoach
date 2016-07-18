D:/xampp/mysql/bin/mysqldump -u b63d28b763f2d8 -pe742f8a3 -h us-cdbr-iron-east-01.cleardb.net heroku_baf1eb8d5a744b9 > db_backup.sql
D:/xampp/mysql/bin/mysql -u root -punicycle -h localhost heroku_baf1eb8d5a744b9 < db_backup.sql
rm db_backup.sql
