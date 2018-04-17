# MX lookup service

### Install

First you need to install Redis on your server. Check Redis cocumentation https://redis.io/topics/quickstart

Install dependencies
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