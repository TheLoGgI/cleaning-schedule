
insert into "Role" (id, role)
values
(1, 'user'),
(2, 'moderator'),
(3, 'admin'),
(4, 'superadmin');

-- Imporves query for rooms, User join 
CREATE index rooms_userid ON "Room" ("userId");