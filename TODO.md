# optimize size of index.js
the entry point js file contains every library we depend on
to minimize the footprint, import bootstrap plugins individually
and only those that are used. 
[see here](https://getbootstrap.com/docs/4.0/getting-started/webpack/)

pro: small index.js file with fast load time
con: could be a maintenance nightmare if we're always adding bootstrap plugins (rare?)

# import vue deps with webpack
[see here](https://appdividend.com/2018/03/12/how-to-setup-vue-js-with-webpack-4-example/)
