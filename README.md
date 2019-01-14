# "Clue" Server

This node server is part of the larger "Clue" app, which is an event logger for WordPress. I believe that this server is partially incomplete, but should be functional in its current state.

As of writing this, I have not touched the code in this app in over a year so I am somewhat fuzzy on some of the details. However, I built this wholly aware that I wanted to "set and forget," so should be easy to reason about if given a little time to read through the code. 

The tools used for this app are:
- Node v9.10.1
- Express
- MongoDB with Mongoose
- Mocha/Chai for testing with NYC for coverage reporting
- eslint for quality


## Getting Started

Clone the repository and install dependencies:
```bash
yarn install
```

Install LocalTunnel in order to expose your local environment to the web:
```bash
yarn add localtunnel -G
```

Next, boot up mongodb and run the server:
```bash
mongod
yarn start
```

Lastly start localtunnel with a subdomain of "clue" (to make things easier) and port of `3000`:
```bash
lt -S "clue" -p 3000
```

Test everything works by sending a request for all events:
```bash
curl https://clue.localtunnel.me/api/v1/event
```

You should have received:
```json
{"status":401,"message":""}
```


## API Documentation

The documentation is generated using the `api-doc-generator` package. [The output](./docs/index.html) for this is put into the `docs` directory. 


## Testing

The test harness utilized for unit tests is `mocha` and `chai`. Code coverage is generated using `nyc`. 

You will need to have an instance of `mongo` running, prior to invoking the tests.

To run the tests:
```bash
sudo mongod
yarn test
```
 
