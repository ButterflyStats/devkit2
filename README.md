# Butterlfy - devkit2

> ButterflyJS development kit

This project is very unfinished and lacks like 90% of the features `devkit1` has.
The codebase here is much cleaner however.

Using the butterflyJS bindings (as opposed to having to write C++ code alongside the Javascript) should make it easy
for anyone to add to this or re-purpose it for their own website.

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
```

## License

Apache 2.0
