CREATE USER 'user'@'%' IDENTIFIED BY 'njBr6uAn';

CREATE DATABASE ant_media_orders;
GRANT ALL PRIVILEGES ON ant_media_orders.* TO 'user'@'%';
FLUSH PRIVILEGES;
