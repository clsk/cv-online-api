drop database if exists Resumes;

create database if not exists Resumes;

use Resumes;

drop table if exists Users;

create table if not exists Users(
   id integer primary key auto_increment,
   email varchar(100) unique,
   password varchar(100),
   name varchar(100),
   lastname varchar(100),
   active  tinyint(1) default 1
)engine=innodb;
