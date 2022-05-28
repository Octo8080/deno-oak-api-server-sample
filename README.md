# deno-oak-api-server-sample

This Code is api server on 'Deno'. 
This api server use [oak](https://github.com/oakserver/oak) middleware framework.

# Usage

## Set env

```sh
BASIC_SECRET = [Basic auth secret]
SALT = [ Salt used when hashing]
DATA_BASE_FILE = [Database filename]
LOG_FILE = [Log filename]
```
## Execution

```sh
# Create SQLite File.
> deno task db-create

# Create migrate from nessie.
> deno task db-migrate

# Register client info.
> deno task add-client --id hogehoge --secret hogehogehoge

# Start server.
> deno task dev
```

## client request

```sh
# Request to token endpoint. 
> curl -s -H 'Authorization:Basic [Basic auth secret]' -XPOST  --data-urlencode 'client_id=[Client id]' -d 'client_secret=[Client Secret]' -d 'grant_type=client_credentials' http://0.0.0.0:8080/oauth2/token | jq .
{
  "access_token": "hogehogehogehogehogehogehogehoge",
  "token_type": "bearer",
  "expires_in": 3600
}

# Post data. 
> curl -s -H 'Authorization:Bearer hogehogehogehogehogehogehogehoge' -H "Content-Type: application/json"  -XPOST -d '{"text":"Sample Text"}' http://0.0.0.0:8080/resource/posts | jq .
{
  "status": true
}

# Get data.
> curl -s -H 'Authorization:Bearer hogehogehogehogehogehogehogehoge' http://0.0.0.0:8080/resource/posts | jq .
[
  {
    "id": 1,
    "clientId": "hogehoge",
    "text": "Sample Text",
    "createdAt": "2022-05-28 16:46:37",
    "updatedAt": "2022-05-28 16:46:37"
  }
]

# Delete data.
> curl -s -H 'Authorization:Bearer hogehogehogehogehogehogehogehoge' -H "Content-Type: application/json"  -XDELETE -d '{"id":"1"}' http://0.0.0.0:8080/resource/posts | jq .
```