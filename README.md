# Butterlfy - devkit2

> ButterflyJS development kit

To update the replay parser in the devkit, you need to build butterfly using emscripten (e.g. generating the JS bindings).
Afterwards, simply replace the generated javascript with the files in `static/butterfly`.

## Building the project

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

## License

Apache 2.0
