# MX lookup service

This is a very light and small service, made in just 4 hours, to fetch a domain MX record from a web server.
You can access the API via web at http://your-ip-addr:30400/<domain.com>

Port, IP, DNS timeout and storage TTL are configurable thru config.js

### Install

First you need to install Redis on your server. Check Redis cocumentation https://redis.io/topics/quickstart

### Install dependencies
```bash
$ yarn install
```

### Development server

#### Build
```bash
$ npm run build
```

#### Start the server in develpment mode
```bash
$ npm run serve
```

#### Start the server in background
```bash
$ npm run start
```

#### Manage forever process
You can install forever globally, and control serve processess from anypath.

```bash
$ yarn global add forever
```
```bash
$ forever list #list background proccess
```
```bash
$ forever stop <PID> #stops a process
```