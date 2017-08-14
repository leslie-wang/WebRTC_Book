# CompleteNodeServerWithDataChannel

fork from https://github.com/spromano/WebRTC_Book.git. Add 3 pull request.

to generate server.key and server.pem, rub below commands:
 - openssl req -nodes -newkey rsa:2048 -keyout server.key -out server.out
 - openssl x509 -req -days 365 -in server.out -signkey server.key -out server.crt
