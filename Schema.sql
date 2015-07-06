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
   active  tinyint(1) default 1,
   is_admin tinyint(1) default 0
)engine=innodb;

create table if not exists Templates(
    id integer primary key auto_increment,
    created_by integer NOT NULL,
    created_on timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_on timestamp,
    name varchar(100) unique,
    description text,
    html text,
    css text,
    CONSTRAINT template_created_by_user_fk FOREIGN KEY (created_by) REFERENCES Users (id)
)engine=innodb;

create table if not exists CVs(
    id integer primary key auto_increment,
    user_id integer,
    name varchar(100),
    template_id integer,
    created_on timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_updated timestamp,
    CONSTRAINT cv_template_id_fk FOREIGN KEY (template_id) REFERENCES Templates (id)
)engine=innodb;


create table if not exists CV_Fields(
    cv_id integer,
    name varchar(100),
    value text,
    PRIMARY KEY (cv_id, name),
    CONSTRAINT cv_field_id FOREIGN KEY (cv_id) REFERENCES CVs (id)
)engine=innodb;

CREATE INDEX cv_fields_id_idx ON CV_Fields (cv_id);

