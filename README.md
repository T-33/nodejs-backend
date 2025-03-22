Backend для социальной сети Suslike.

## REST контроллеры (GET, POST, DELETE)
- /users
- /posts

## Authentication
- /register
- /login
- /logout

## Схема базы данных:
* Users
  * id
  * username
  * email
  * password
  * created_at
* Posts
  * id 
  * user_id(references users)
  * content(text)
  * created_at
* Tokens
  * token
  * user_id(references users)