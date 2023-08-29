FROM golang:1.16

RUN useradd -u 10001 myuser
USER myuser

WORKDIR /app

COPY --chown=myuser:myuser go.mod go.sum ./
RUN chmod 500 go.mod go.sum

RUN go mod download

COPY --chown=myuser:myuser main.go .
RUN chmod 500 main.go

RUN go build -o main .


