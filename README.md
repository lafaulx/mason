Mason
=======

Mason is a wrapper to place elements with the same width and different height into a solid board with set gaps on X and Y axis.

## Package content and installation

* build - contains minified Mason script
* src - contains source for Mason
* test - just test page - run it and check the plugin out 

In case you want to change something in source files - you'll need to compile them afterwards. Source files can be compiled with cool [Gulp](http://gulpjs.com) tool - package.json for build tool included:
```
npm install                         // installs Gulp itself - node.js required
./node_modules/gulp/bin/gulp.js     // compiles source files
```

In case you don't want to install Gulp - act as you wish.

No additional dependecies to run Mason are required.

## Initialization 
Mason is initialized with parent node (it's width will be counted to check if child nodes replacement is required), childSelector (nodes with same width you want to fit the container) and some options:
```js
var g = new Mason(parent, childSelector, options);
```

Options object looks like this:
```js
{
    gap: {
        x: int,         // gap on X axis
        y: int          // gap on Y axis
    },
    throttled: int,    // will replace elements in specified number of ms - needed if you have too many elements and their immediate replacement results lags
}
```

## Test page
Test page is provided in the package and requires no preparations - just open html and enjoy. Throttled update is used there.

## Todo
* Provide another element as width source - needed if you want to center parent element