drop database if exists Resumes;

create database if not exists Resumes;

use Resumes;

create table if not exists Users(
   id integer primary key auto_increment,
   email varchar(100) unique,
   password varchar(100),
   name varchar(100),
   lastname varchar(100),
   active  tinyint(1) default 1,
   telephone varchar(100),
   webpage varchar(200),
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

create table if not exists CV_Education (
    id integer primary key auto_increment,
    cv_id integer,
    start_date timestamp,
    end_date timestamp,
    school varchar(100),
    degree varchar(100),
    CONSTRAINT cv_education_cv_id_fk FOREIGN KEY (cv_id) REFERENCES CVs (id)
)engine=innodb;

create table if not exists CV_WorkExperiences(
    id integer primary key auto_increment,
    cv_id integer,
    start_date timestamp,
    end_date timestamp,
    company varchar(200),
    address varchar(500),
    CONSTRAINT cv_workexperience_cv_id_fk FOREIGN KEY (cv_id) REFERENCES CVs (id)
) engine=innodb;

create table if not exists CV_WorkExperiences_BulletPoint(
    id integer primary key auto_increment,
    cv_workexperience_id integer,
    value text,
    CONSTRAINT cv_workexperiences_bullet_point_cv_workexperiences_id_fk FOREIGN KEY (cv_workexperience_id) REFERENCES CV_WorkExperiences (id)
) engine=innodb;


create table if not exists CV_Fields(
    id integer primary key auto_increment,
    cv_id integer,
    name varchar(100),
    value text,
    CONSTRAINT cv_field_id FOREIGN KEY (cv_id) REFERENCES CVs (id)
)engine=innodb;

CREATE INDEX cv_fields_id_idx ON CV_Fields (cv_id);

/*
INSERT INTO CVs (user_id, name) VALUES (1, "Test CV");
INSERT INTO CV_Fields(cv_id, name, value) VALUES (1, "name", "Name");
INSERT INTO CV_Fields(cv_id, name, value) VALUES (1, "last-name", "Lastname");
INSERT INTO CV_Fields(cv_id, name, value) VALUES (1, "email", "email@host.net");
INSERT INTO CV_Fields(cv_id, name, value) VALUES (1, "phone", "(456) 789-1234");
INSERT INTO CV_Fields(cv_id, name, value) VALUES (1, "website", "www.cv-online.do");
INSERT INTO CV_Fields(cv_id, name, value) VALUES (1, "objectives", "This is a test objective statemente\n new line objective statement");

INSERT INTO CV_WorkExperiences (cv_id, start_date, end_date, address) VALUES (1, '2014-4-20', '2015-4-20', 'Santiago, Republica Dominicana');
INSERT INTO CV_WorkExperiences_BulletPoint (cv_workexperience_id, value) VALUES (1, "Imeplent Technology X");
INSERT INTO CV_WorkExperiences_BulletPoint (cv_workexperience_id, value) VALUES (1, "Imeplenta Technology Y");
INSERT INTO CV_WorkExperiences_BulletPoint (cv_workexperience_id, value) VALUES (1, "Imeplemta Technology Z");
INSERT INTO CV_Education(cv_id, start_date, end_date, school, degree) VALUES (1, '2008-8-30', '2013-12-14', 'PUCMM', 'B.S. Computer Engineering');
INSERT INTO CV_Education(cv_id, start_date, end_date, school, degree) VALUES (1, '2014-1-30', '2015-12-14', 'PUCMM', 'M.S. Artificial Intelligence');
*/


ALTER TABLE `Resumes`.`CV_WorkExperiences` CHANGE COLUMN `address` `title` VARCHAR(500) NULL DEFAULT NULL ;
ALTER TABLE `Resumes`.`CV_WorkExperiences` ADD COLUMN `other_info` TEXT NULL AFTER `title`;
ALTER TABLE `Resumes`.`CV_Education` ADD COLUMN `other_info` TEXT NULL AFTER `degree`;