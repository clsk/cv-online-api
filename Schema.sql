drop database if exists Resumes;

create database if not exists Resumes;

use Resumes;

drop table if exists tblUsers;

create table if not exists tblUsers(
   userId integer primary key auto_increment,
   Nombre varchar (50),
   Apellido varchar (50),
   Email varchar(100) unique,
   Password varchar(100),
   Active  tinyint(1) default 1
)engine=innodb;