create table Hikings (
    id         int auto_increment
        primary key,
    `order`    int          not null,
    name       varchar(255) not null,
    city       varchar(255) not null,
    department varchar(255) null,
    region     varchar(255) null,
    image      varchar(255) not null,
    folder     varchar(255) not null
);

create table `Hikings-Data` (
    id                int          not null,
    difficulty        varchar(255) not null,
    duration          varchar(255) not null,
    distance          varchar(255) not null,
    elevation_gain    varchar(255) not null,
    negative_gradient varchar(255) not null,
    high_point        varchar(255) not null,
    low_point         varchar(255) not null,
    constraint `Hikings-Data_Hikings_id_fk`
        foreign key (id) references Hikings (id)
);

create table `Hikings-Description` (
    id          int      not null
        primary key,
    description longtext not null,
    constraint `Hikings-Description_Hikings_id_fk`
        foreign key (id) references Hikings (id)
);

