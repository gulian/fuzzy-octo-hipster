fuzzy-octo-hipster (FOH) [![Stories in Ready](https://badge.waffle.io/gulian/fuzzy-octo-hipster.png)](http://waffle.io/gulian/fuzzy-octo-hipster) [![Build Status](https://drone.io/github.com/gulian/fuzzy-octo-hipster/status.png)](https://drone.io/github.com/gulian/fuzzy-octo-hipster/latest) :punch: 
==================

## What's FOH ?

**FOH** is a **shared bookmark** for your team. 

It provides a way to easily share your technology watch to your coworkers. Every link can be commented to get feedback from them. 

FOH runs on nodejs/expressjs/mongo database on server side, and angularjs/boostrap on client side. 

![capture decran 2013-07-23 a 09 34 00](https://f.cloud.github.com/assets/487387/840185/713c0880-f36a-11e2-9399-a6f505c7b02c.png)

## Why FOH ?

FOH was originaly developped to manage tech watch at @gismartware 

Concerning the name, it's one of the random name given by github

## How to run FOH ?

* Install deps

```bash
git clone https://github.com/gulian/fuzzy-octo-hipster
cd fuzzy-octo-hipster
npm install 
```

* Install _mongod_ 

* Run app locally

```bash
node app
```

* Run app remotely (on mongohq for example)

```bash
MONGOHQ_URL=mongodb://[user]:[passw0rd]@dharma.mongohq.com:[port]/[database_name] node app
```

### Contributing 

Please ! Feel free to send issues and pull request !

### License (The MIT License)

Copyright (c) 2013 Gulian Lorini <glorini@gismartware.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
