echo "dev simple data"
mysql -u b0617bae293920 -pab7df93a -h us-cdbr-east-05.cleardb.net heroku_3ec2a5de6342e8b < test_data/testdata_heroku.sql

echo "middle dev more complex data"
mysql -u bc791db1cbf7bb -p3777604f -h us-cdbr-iron-east-03.cleardb.net heroku_94d5b974b14e4cb < test_data/testdata_heroku_complex.sql
