this["wp"] = this["wp"] || {}; this["wp"]["jsonlint"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 67);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ 3:
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ 36:
/***/ (function(module, exports) {



/***/ }),

/***/ 37:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 38:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {var path = __webpack_require__(37);
var fs = __webpack_require__(36);
var assert = __webpack_require__(9);

// file.mkdirs
//
// Given a path to a directory, create it, and all the intermediate directories
// as well
// 
// @path: the path to create
// @mode: the file mode to create the directory with:
//    ex: file.mkdirs("/tmp/dir", 755, function () {})
// @callback: called when finished.
exports.mkdirs = function (_path, mode, callback) {
  _path = exports.path.abspath(_path);

  var dirs = _path.split(path.sep);
  var walker = [dirs.shift()];

  // walk
  // @ds:  A list of directory names
  // @acc: An accumulator of walked dirs
  // @m:   The mode
  // @cb:  The callback
  var walk = function (ds, acc, m, cb) {
    if (ds.length > 0) {
      var d = ds.shift();

      acc.push(d);
      var dir = acc.join(path.sep);

      // look for dir on the fs, if it doesn't exist then create it, and 
      // continue our walk, otherwise if it's a file, we have a name
      // collision, so exit.
      fs.stat(dir, function (err, stat) {
        // if the directory doesn't exist then create it
        if (err) {
          // 2 means it's wasn't there
          if (err.errno == 2 || err.errno == 34) {
            fs.mkdir(dir, m, function (erro) {
              if (erro && erro.errno != 17 && erro.errno != 34) {
                return cb(erro);
              } else {
                return walk(ds, acc, m, cb);
              }
            });
          } else {
            return cb(err);
          }
        } else {
          if (stat.isDirectory()) {
            return walk(ds, acc, m, cb);
          } else {
            return cb(new Error("Failed to mkdir " + dir + ": File exists\n"));
          }
        }
      });
    } else {
      return cb();
    }
  };
  return walk(dirs, walker, mode, callback);
};

// file.mkdirsSync
//
// Synchronus version of file.mkdirs
//
// Given a path to a directory, create it, and all the intermediate directories
// as well
// 
// @path: the path to create
// @mode: the file mode to create the directory with:
//    ex: file.mkdirs("/tmp/dir", 755, function () {})
exports.mkdirsSync = function (_path, mode) {
  if (_path[0] !== path.sep) {
    _path = path.join(process.cwd(), _path)
  }

  var dirs = _path.split(path.sep);
  var walker = [dirs.shift()];

  dirs.reduce(function (acc, d) {
    acc.push(d);
    var dir = acc.join(path.sep);
    
    try {
      var stat = fs.statSync(dir);
      if (!stat.isDirectory()) {
        throw "Failed to mkdir " + dir + ": File exists";
      }
    } catch (err) {
      fs.mkdirSync(dir, mode);
    }
    return acc;
  }, walker);
};

// file.walk
//
// Given a path to a directory, walk the fs below that directory
// 
// @start: the path to startat
// @callback: called for each new directory we enter
//    ex: file.walk("/tmp", function(error, path, dirs, name) {})
//
//    path is the current directory we're in
//    dirs is the list of directories below it
//    names is the list of files in it
//
exports.walk = function (start, callback) {
  fs.lstat(start, function (err, stat) {
    if (err) { return callback(err) }
    if (stat.isDirectory()) {

      fs.readdir(start, function (err, files) {
        var coll = files.reduce(function (acc, i) {
          var abspath = path.join(start, i);

          if (fs.statSync(abspath).isDirectory()) {
            exports.walk(abspath, callback);
            acc.dirs.push(abspath);
          } else {
            acc.names.push(abspath);
          }

          return acc;
        }, {"names": [], "dirs": []});

        return callback(null, start, coll.dirs, coll.names);
      });
    } else {
      return callback(new Error("path: " + start + " is not a directory"));
    }
  });
};

// file.walkSync
//
// Synchronus version of file.walk
//
// Given a path to a directory, walk the fs below that directory
// 
// @start: the path to startat
// @callback: called for each new directory we enter
//    ex: file.walk("/tmp", function(error, path, dirs, name) {})
//
//    path is the current directory we're in
//    dirs is the list of directories below it
//    names is the list of files in it
//
exports.walkSync = function (start, callback) {
  var stat = fs.statSync(start);

  if (stat.isDirectory()) {
    var filenames = fs.readdirSync(start);

    var coll = filenames.reduce(function (acc, name) {
      var abspath = path.join(start, name);

      if (fs.statSync(abspath).isDirectory()) {
        acc.dirs.push(name);
      } else {
        acc.names.push(name);
      }

      return acc;
    }, {"names": [], "dirs": []});

    callback(start, coll.dirs, coll.names);

    coll.dirs.forEach(function (d) {
      var abspath = path.join(start, d);
      exports.walkSync(abspath, callback);
    });

  } else {
    throw new Error("path: " + start + " is not a directory");
  }
};

exports.path = {};

exports.path.abspath = function (to) {
  var from;
  switch (to.charAt(0)) {
    case "~": from = process.env.HOME; to = to.substr(1); break
    case path.sep: from = ""; break
    default : from = process.cwd(); break
  }
  return path.join(from, to);
}

exports.path.relativePath = function (base, compare) {
  base = base.split(path.sep);
  compare = compare.split(path.sep);

  if (base[0] == "") {
    base.shift();
  }

  if (compare[0] == "") {
    compare.shift();
  }

  var l = compare.length;

  for (var i = 0; i < l; i++) {
    if (!base[i] || (base[i] != compare[i])) {
      return compare.slice(i).join(path.sep);
    }
  }

  return ""
};

exports.path.join = function (head, tail) {
  if (head == "") {
    return tail;
  } else {
    return path.join(head, tail);
  }
};


/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(7);

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(8);

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(3)))

/***/ }),

/***/ 6:
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ 67:
/***/ (function(module, exports, __webpack_require__) {

/* global require */

var jsonlint = __webpack_require__( 68 );


/***/ }),

/***/ 68:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, module) {/* Jison generated parser */
var jsonlint = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"JSONString":3,"STRING":4,"JSONNumber":5,"NUMBER":6,"JSONNullLiteral":7,"NULL":8,"JSONBooleanLiteral":9,"TRUE":10,"FALSE":11,"JSONText":12,"JSONValue":13,"EOF":14,"JSONObject":15,"JSONArray":16,"{":17,"}":18,"JSONMemberList":19,"JSONMember":20,":":21,",":22,"[":23,"]":24,"JSONElementList":25,"$accept":0,"$end":1},
terminals_: {2:"error",4:"STRING",6:"NUMBER",8:"NULL",10:"TRUE",11:"FALSE",14:"EOF",17:"{",18:"}",21:":",22:",",23:"[",24:"]"},
productions_: [0,[3,1],[5,1],[7,1],[9,1],[9,1],[12,2],[13,1],[13,1],[13,1],[13,1],[13,1],[13,1],[15,2],[15,3],[20,3],[19,1],[19,3],[16,2],[16,3],[25,1],[25,3]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: // replace escaped characters with actual character
          this.$ = yytext.replace(/\\(\\|")/g, "$"+"1")
                     .replace(/\\n/g,'\n')
                     .replace(/\\r/g,'\r')
                     .replace(/\\t/g,'\t')
                     .replace(/\\v/g,'\v')
                     .replace(/\\f/g,'\f')
                     .replace(/\\b/g,'\b');
        
break;
case 2:this.$ = Number(yytext);
break;
case 3:this.$ = null;
break;
case 4:this.$ = true;
break;
case 5:this.$ = false;
break;
case 6:return this.$ = $$[$0-1];
break;
case 13:this.$ = {};
break;
case 14:this.$ = $$[$0-1];
break;
case 15:this.$ = [$$[$0-2], $$[$0]];
break;
case 16:this.$ = {}; this.$[$$[$0][0]] = $$[$0][1];
break;
case 17:this.$ = $$[$0-2]; $$[$0-2][$$[$0][0]] = $$[$0][1];
break;
case 18:this.$ = [];
break;
case 19:this.$ = $$[$0-1];
break;
case 20:this.$ = [$$[$0]];
break;
case 21:this.$ = $$[$0-2]; $$[$0-2].push($$[$0]);
break;
}
},
table: [{3:5,4:[1,12],5:6,6:[1,13],7:3,8:[1,9],9:4,10:[1,10],11:[1,11],12:1,13:2,15:7,16:8,17:[1,14],23:[1,15]},{1:[3]},{14:[1,16]},{14:[2,7],18:[2,7],22:[2,7],24:[2,7]},{14:[2,8],18:[2,8],22:[2,8],24:[2,8]},{14:[2,9],18:[2,9],22:[2,9],24:[2,9]},{14:[2,10],18:[2,10],22:[2,10],24:[2,10]},{14:[2,11],18:[2,11],22:[2,11],24:[2,11]},{14:[2,12],18:[2,12],22:[2,12],24:[2,12]},{14:[2,3],18:[2,3],22:[2,3],24:[2,3]},{14:[2,4],18:[2,4],22:[2,4],24:[2,4]},{14:[2,5],18:[2,5],22:[2,5],24:[2,5]},{14:[2,1],18:[2,1],21:[2,1],22:[2,1],24:[2,1]},{14:[2,2],18:[2,2],22:[2,2],24:[2,2]},{3:20,4:[1,12],18:[1,17],19:18,20:19},{3:5,4:[1,12],5:6,6:[1,13],7:3,8:[1,9],9:4,10:[1,10],11:[1,11],13:23,15:7,16:8,17:[1,14],23:[1,15],24:[1,21],25:22},{1:[2,6]},{14:[2,13],18:[2,13],22:[2,13],24:[2,13]},{18:[1,24],22:[1,25]},{18:[2,16],22:[2,16]},{21:[1,26]},{14:[2,18],18:[2,18],22:[2,18],24:[2,18]},{22:[1,28],24:[1,27]},{22:[2,20],24:[2,20]},{14:[2,14],18:[2,14],22:[2,14],24:[2,14]},{3:20,4:[1,12],20:29},{3:5,4:[1,12],5:6,6:[1,13],7:3,8:[1,9],9:4,10:[1,10],11:[1,11],13:30,15:7,16:8,17:[1,14],23:[1,15]},{14:[2,19],18:[2,19],22:[2,19],24:[2,19]},{3:5,4:[1,12],5:6,6:[1,13],7:3,8:[1,9],9:4,10:[1,10],11:[1,11],13:31,15:7,16:8,17:[1,14],23:[1,15]},{18:[2,17],22:[2,17]},{18:[2,15],22:[2,15]},{22:[2,21],24:[2,21]}],
defaultActions: {16:[2,6]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this,
        stack = [0],
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    //this.reductionCount = this.shiftCount = 0;

    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if (typeof this.lexer.yylloc == 'undefined')
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);

    if (typeof this.yy.parseError === 'function')
        this.parseError = this.yy.parseError;

    function popStack (n) {
        stack.length = stack.length - 2*n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

    function lex() {
        var token;
        token = self.lexer.lex() || 1; // $end = 1
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }

    var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length-1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

        // handle parse error
        _handle_error:
        if (typeof action === 'undefined' || !action.length || !action[0]) {

            if (!recovering) {
                // Report error
                expected = [];
                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                    expected.push("'"+this.terminals_[p]+"'");
                }
                var errStr = '';
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+expected.join(', ') + ", got '" + this.terminals_[symbol]+ "'";
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == 1 /*EOF*/ ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr,
                    {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol == EOF) {
                    throw new Error(errStr || 'Parsing halted.');
                }

                // discard current lookahead and grab another
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            while (1) {
                // check for error recovery rule in this state
                if ((TERROR.toString()) in table[state]) {
                    break;
                }
                if (state == 0) {
                    throw new Error(errStr || 'Parsing halted.');
                }
                popStack(1);
                state = stack[stack.length-1];
            }

            preErrorSymbol = symbol; // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {

            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(this.lexer.yytext);
                lstack.push(this.lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = this.lexer.yyleng;
                    yytext = this.lexer.yytext;
                    yylineno = this.lexer.yylineno;
                    yyloc = this.lexer.yylloc;
                    if (recovering > 0)
                        recovering--;
                } else { // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2: // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3: // accept
                return true;
        }

    }

    return true;
}};
/* Jison generated lexer */
var lexer = (function(){
var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parseError) {
            this.yy.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext+=ch;
        this.yyleng++;
        this.match+=ch;
        this.matched+=ch;
        var lines = ch.match(/\n/);
        if (lines) this.yylineno++;
        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        this._input = ch + this._input;
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
less:function (n) {
        this._input = this.match.slice(n) + this._input;
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            tempMatch,
            index,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (!this.options.flex) break;
            }
        }
        if (match) {
            lines = match[0].match(/\n.*/g);
            if (lines) this.yylineno += lines.length;
            this.yylloc = {first_line: this.yylloc.last_line,
                           last_line: this.yylineno+1,
                           first_column: this.yylloc.last_column,
                           last_column: lines ? lines[lines.length-1].length-1 : this.yylloc.last_column + match[0].length}
            this.yytext += match[0];
            this.match += match[0];
            this.yyleng = this.yytext.length;
            this._more = false;
            this._input = this._input.slice(match[0].length);
            this.matched += match[0];
            token = this.performAction.call(this, this.yy, this, rules[index],this.conditionStack[this.conditionStack.length-1]);
            if (this.done && this._input) this.done = false;
            if (token) return token;
            else return;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(), 
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.options = {};
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:return 6
break;
case 2:yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2); return 4
break;
case 3:return 17
break;
case 4:return 18
break;
case 5:return 23
break;
case 6:return 24
break;
case 7:return 22
break;
case 8:return 21
break;
case 9:return 10
break;
case 10:return 11
break;
case 11:return 8
break;
case 12:return 14
break;
case 13:return 'INVALID'
break;
}
};
lexer.rules = [/^(?:\s+)/,/^(?:(-?([0-9]|[1-9][0-9]+))(\.[0-9]+)?([eE][-+]?[0-9]+)?\b)/,/^(?:"(?:\\[\\"bfnrt/]|\\u[a-fA-F0-9]{4}|[^\\\0-\x09\x0a-\x1f"])*")/,/^(?:\{)/,/^(?:\})/,/^(?:\[)/,/^(?:\])/,/^(?:,)/,/^(?::)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:null\b)/,/^(?:$)/,/^(?:.)/];
lexer.conditions = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13],"inclusive":true}};


;
return lexer;})()
parser.lexer = lexer;
return parser;
})();
if (true) {
exports.parser = jsonlint;
exports.parse = function () { return jsonlint.parse.apply(jsonlint, arguments); }
exports.main = function commonjsMain(args) {
    if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
    if (typeof process !== 'undefined') {
        var source = __webpack_require__(36).readFileSync(__webpack_require__(37).join(process.cwd(), args[1]), "utf8");
    } else {
        var cwd = __webpack_require__(38).path(__webpack_require__(38).cwd());
        var source = cwd.join(args[1]).read({charset: "utf-8"});
    }
    return exports.parser.parse(source);
}
if (typeof module !== 'undefined' && __webpack_require__.c[__webpack_require__.s] === module) {
  exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : __webpack_require__(69).args);
}
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(6)(module)))

/***/ }),

/***/ 69:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*eslint-env browser*/


var CommonSystem = __webpack_require__(70);

module.exports = BrowserSystem;

function BrowserSystem(location, description, options) {
    var self = this;
    CommonSystem.call(self, location, description, options);
}

BrowserSystem.prototype = Object.create(CommonSystem.prototype);
BrowserSystem.prototype.constructor = BrowserSystem;

BrowserSystem.load = CommonSystem.load;

BrowserSystem.prototype.read = function read(location, charset, contentType) {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();

        function onload() {
            if (xhrSuccess(request)) {
                resolve(request.responseText);
            } else {
                onerror();
            }
        }

        function onerror() {
            var error = new Error("Can't XHR " + JSON.stringify(location));
            if (request.status === 404 || request.status === 0) {
                error.code = "ENOENT";
                error.notFound = true;
            }
            reject(error);
        }

        try {
            request.open("GET", location, true);
            if (contentType && request.overrideMimeType) {
                request.overrideMimeType(contentType);
            }
            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    onload();
                }
            };
            request.onload = request.load = onload;
            request.onerror = request.error = onerror;
            request.send();
        } catch (exception) {
            reject(exception);
        }

    });
};

// Determine if an XMLHttpRequest was successful
// Some versions of WebKit return 0 for successful file:// URLs
function xhrSuccess(req) {
    return (req.status === 200 || (req.status === 0 && req.responseText));
}


/***/ }),

/***/ 7:
/***/ (function(module, exports) {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}

/***/ }),

/***/ 70:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*eslint no-console:[0]*/
/*global console*/


var URL = __webpack_require__(71);
var Identifier = __webpack_require__(72);
var Module = __webpack_require__(73);
var Resource = __webpack_require__(74);
var parseDependencies = __webpack_require__(75);
var compile = __webpack_require__(76);
var has = Object.prototype.hasOwnProperty;

module.exports = System;

function System(location, description, options) {
    var self = this;
    options = options || {};
    description = description || {};
    self.name = options.name || description.name || "";
    self.location = location;
    self.description = description;
    self.dependencies = {};
    self.main = null;
    self.resources = options.resources || {}; // by system.name / module.id
    self.modules = options.modules || {}; // by system.name/module.id
    self.systemLocations = options.systemLocations || {}; // by system.name;
    self.systems = options.systems || {}; // by system.name
    self.systemLoadedPromises = options.systemLoadedPromises || {}; // by system.name
    self.buildSystem = options.buildSystem; // or self if undefined
    self.strategy = options.strategy || "nested";
    self.analyzers = {js: self.analyzeJavaScript};
    self.translators = {json: self.translateJson};
    self.internalRedirects = {};
    self.externalRedirects = {};
    self.node = !!options.node;
    self.browser = !!options.browser;
    self.parent = options.parent;
    self.root = options.root || self;
    // TODO options.optimize
    // TODO options.instrument
    self.systems[self.name] = self;
    self.systemLocations[self.name] = self.location;
    self.systemLoadedPromises[self.name] = Promise.resolve(self);

    if (options.name != null && description.name == null) {
        console.warn(
            "Package loaded by name " + JSON.stringify(options.name) +
            " has no name"
        );
    } else if (options.name != null && options.name !== description.name) {
        console.warn(
            "Package loaded by name " + JSON.stringify(options.name) +
            " has mismatched name " + JSON.stringify(description.name)
        );
    }

    // The main property of the description can only create an internal
    // redirect, as such it normalizes absolute identifiers to relative.
    // All other redirects, whether from internal or external identifiers, can
    // redirect to either internal or external identifiers.
    self.main = description.main || "index.js";
    self.internalRedirects[".js"] = "./" + Identifier.resolve(self.main, "");

    // Overlays:
    if (options.browser) { self.overlayBrowser(description); }
    if (options.node) { self.overlayNode(description); }

    // Dependencies:
    if (description.dependencies) {
        self.addDependencies(description.dependencies);
    }
    if (self.root === self && description.devDependencies) {
        self.addDependencies(description.devDependencies);
    }

    // Local per-extension overrides:
    if (description.extensions) { self.addExtensions(description.extensions); }
    if (description.redirects) { self.addRedirects(description.redirects); }
}

System.load = function loadSystem(location, options) {
    var self = this;
    return self.prototype.loadSystemDescription(location, "<anonymous>")
    .then(function (description) {
        return new self(location, description, options);
    });
};

System.prototype.import = function importModule(rel, abs) {
    var self = this;
    return self.load(rel, abs)
    .then(function onModuleLoaded() {
        self.root.main = self.lookup(rel, abs);
        return self.require(rel, abs);
    });
};

// system.require(rel, abs) must be called only after the module and its
// transitive dependencies have been loaded, as guaranteed by system.load(rel,
// abs)
System.prototype.require = function require(rel, abs) {
    var self = this;

    // Apart from resolving relative identifiers, this also normalizes absolute
    // identifiers.
    var res = Identifier.resolve(rel, abs);
    if (Identifier.isAbsolute(rel)) {
        if (self.externalRedirects[res] === false) {
            return {};
        }
        if (self.externalRedirects[res]) {
            return self.require(self.externalRedirects[res], res);
        }
        var head = Identifier.head(rel);
        var tail = Identifier.tail(rel);
        if (self.dependencies[head]) {
            return self.getSystem(head, abs).requireInternalModule(tail, abs);
        } else if (self.modules[head]) {
            return self.requireInternalModule(rel, abs, self.modules[rel]);
        } else {
            var via = abs ? " via " + JSON.stringify(abs) : "";
            throw new Error("Can't require " + JSON.stringify(rel) + via + " in " + JSON.stringify(self.name));
        }
    } else {
        return self.requireInternalModule(rel, abs);
    }
};

System.prototype.requireInternalModule = function requireInternalModule(rel, abs, module) {
    var self = this;

    var res = Identifier.resolve(rel, abs);
    var id = self.normalizeIdentifier(res);
    if (self.internalRedirects[id]) {
        return self.require(self.internalRedirects[id], id);
    }

    module = module || self.lookupInternalModule(id);

    // check for load error
    if (module.error) {
        var error = module.error;
        var via = abs ? " via " + JSON.stringify(abs) : "";
        error.message = (
            "Can't require module " + JSON.stringify(module.id) +
            via +
            " in " + JSON.stringify(self.name || self.location) +
            " because " + error.message
        );
        throw error;
    }

    // do not reinitialize modules
    if (module.exports != null) {
        return module.exports;
    }

    // do not initialize modules that do not define a factory function
    if (typeof module.factory !== "function") {
        throw new Error(
            "Can't require module " + JSON.stringify(module.filename) +
            ". No exports. No exports factory."
        );
    }

    module.require = self.makeRequire(module.id, self.root.main);
    module.exports = {};

    // Execute the factory function:
    module.factory.call(
        // in the context of the module:
        null, // this (defaults to global, except in strict mode)
        module.require,
        module.exports,
        module,
        module.filename,
        module.dirname
    );

    return module.exports;
};

System.prototype.makeRequire = function makeRequire(abs, main) {
    var self = this;
    function require(rel) {
        return self.require(rel, abs);
    }
    require.main = main;
    return require;
};

// System:

// Should only be called if the system is known to have already been loaded by
// system.loadSystem.
System.prototype.getSystem = function getSystem(rel, abs) {
    var via;
    var hasDependency = this.dependencies[rel];
    if (!hasDependency) {
        via = abs ? " via " + JSON.stringify(abs) : "";
        throw new Error(
            "Can't get dependency " + JSON.stringify(rel) +
            " in package named " + JSON.stringify(this.name) + via
        );
    }
    var dependency = this.systems[rel];
    if (!dependency) {
        via = abs ? " via " + JSON.stringify(abs) : "";
        throw new Error(
            "Can't get dependency " + JSON.stringify(rel) +
            " in package named " + JSON.stringify(this.name) + via
        );
    }
    return dependency;
};

System.prototype.loadSystem = function (name, abs) {
    var self = this;
    //var hasDependency = self.dependencies[name];
    //if (!hasDependency) {
    //    var error = new Error("Can't load module " + JSON.stringify(name));
    //    error.module = true;
    //    throw error;
    //}
    var loadingSystem = self.systemLoadedPromises[name];
    if (!loadingSystem) {
        loadingSystem = self.actuallyLoadSystem(name, abs);
        self.systemLoadedPromises[name] = loadingSystem;
    }
    return loadingSystem;
};

System.prototype.loadSystemDescription = function loadSystemDescription(location, name) {
    var self = this;
    var descriptionLocation = URL.resolve(location, "package.json");
    return self.read(descriptionLocation, "utf-8", "application/json")
    .then(function (json) {
        try {
            return JSON.parse(json);
        } catch (error) {
            error.message = error.message + " in " +
                JSON.stringify(descriptionLocation);
            throw error;
        }
    }, function (error) {
        error.message = "Can't load package " + JSON.stringify(name) + " at " +
            JSON.stringify(location) + " because " + error.message;
        throw error;
    });
};

System.prototype.actuallyLoadSystem = function (name, abs) {
    var self = this;
    var System = self.constructor;
    var location = self.systemLocations[name];
    if (!location) {
        var via = abs ? " via " + JSON.stringify(abs) : "";
        throw new Error(
            "Can't load package " + JSON.stringify(name) + via +
            " because it is not a declared dependency"
        );
    }
    var buildSystem;
    if (self.buildSystem) {
        buildSystem = self.buildSystem.actuallyLoadSystem(name, abs);
    }
    return Promise.all([
        self.loadSystemDescription(location, name),
        buildSystem
    ]).then(function onDescriptionAndBuildSystem(args) {
        var description = args[0];
        var buildSystem = args[1];
        var system = new System(location, description, {
            parent: self,
            root: self.root,
            name: name,
            resources: self.resources,
            modules: self.modules,
            systems: self.systems,
            systemLocations: self.systemLocations,
            systemLoadedPromises: self.systemLoadedPromises,
            buildSystem: buildSystem,
            browser: self.browser,
            node: self.node,
            strategy: inferStrategy(description)
        });
        self.systems[system.name] = system;
        return system;
    });
};

System.prototype.getBuildSystem = function getBuildSystem() {
    var self = this;
    return self.buildSystem || self;
};

// Module:

System.prototype.normalizeIdentifier = function (id) {
    var self = this;
    var extension = Identifier.extension(id);
    if (
        !has.call(self.translators, extension) &&
        !has.call(self.analyzers, extension) &&
        extension !== "js" &&
        extension !== "json"
    ) {
        id += ".js";
    }
    return id;
};

System.prototype.load = function load(rel, abs) {
    var self = this;
    return self.deepLoad(rel, abs)
    .then(function () {
        return self.deepCompile(rel, abs, {});
    });
};

System.prototype.deepCompile = function deepCompile(rel, abs, memo) {
    var self = this;

    var res = Identifier.resolve(rel, abs);
    if (Identifier.isAbsolute(rel)) {
        if (self.externalRedirects[res]) {
            return self.deepCompile(self.externalRedirects[res], res, memo);
        }
        var head = Identifier.head(rel);
        var tail = Identifier.tail(rel);
        if (self.dependencies[head]) {
            var system = self.getSystem(head, abs);
            return system.compileInternalModule(tail, "", memo);
        } else {
            // XXX no clear idea what to do in this load case.
            // Should never reject, but should cause require to produce an
            // error.
            return Promise.resolve();
        }
    } else {
        return self.compileInternalModule(rel, abs, memo);
    }
};

System.prototype.compileInternalModule = function compileInternalModule(rel, abs, memo) {
    var self = this;

    var res = Identifier.resolve(rel, abs);
    var id = self.normalizeIdentifier(res);
    if (self.internalRedirects[id]) {
        return self.deepCompile(self.internalRedirects[id], "", memo);
    }
    var module = self.lookupInternalModule(id, abs);

    // Break the cycle of violence
    if (memo[module.key]) {
        return Promise.resolve();
    }
    memo[module.key] = true;

    if (module.compiled) {
        return Promise.resolve();
    }
    module.compiled = true;
    return Promise.resolve().then(function () {
        return Promise.all(module.dependencies.map(function (dependency) {
            return self.deepCompile(dependency, module.id, memo);
        }));
    }).then(function () {
        return self.translate(module);
    }).then(function () {
        return self.compile(module);
    }).catch(function (error) {
        module.error = error;
    });
};

// Loads a module and its transitive dependencies.
System.prototype.deepLoad = function deepLoad(rel, abs, memo) {
    var self = this;
    var res = Identifier.resolve(rel, abs);
    if (Identifier.isAbsolute(rel)) {
        if (self.externalRedirects[res]) {
            return self.deepLoad(self.externalRedirects[res], res, memo);
        }
        var head = Identifier.head(rel);
        var tail = Identifier.tail(rel);
        if (self.dependencies[head]) {
            return self.loadSystem(head, abs)
            .then(function (system) {
                return system.loadInternalModule(tail, "", memo);
            });
        } else {
            // XXX no clear idea what to do in this load case.
            // Should never reject, but should cause require to produce an
            // error.
            return Promise.resolve();
        }
    } else {
        return self.loadInternalModule(rel, abs, memo);
    }
};

System.prototype.loadInternalModule = function loadInternalModule(rel, abs, memo) {
    var self = this;

    var res = Identifier.resolve(rel, abs);
    var id = self.normalizeIdentifier(res);
    if (self.internalRedirects[id]) {
        return self.deepLoad(self.internalRedirects[id], "", memo);
    }

    // Extension must be captured before normalization since it is used to
    // determine whether to attempt to fallback to index.js for identifiers
    // that might refer to directories.
    var extension = Identifier.extension(res);

    var module = self.lookupInternalModule(id, abs);

    // Break the cycle of violence
    memo = memo || {};
    if (memo[module.key]) {
        return Promise.resolve();
    }
    memo[module.key] = true;

    // Return a memoized load
    if (module.loadedPromise) {
        return module.loadedPromise;
    }
    module.loadedPromise = Promise.resolve()
    .then(function () {
        if (module.factory == null && module.exports == null) {
            return self.read(module.location, "utf-8")
            .then(function (text) {
                module.text = text;
                return self.finishLoadingModule(module, memo);
            }, fallback);
        }
    });

    function fallback(error) {
        var redirect = Identifier.resolve("./index.js", res);
        module.redirect = redirect;
        if (!error || error.notFound && extension === "") {
            return self.loadInternalModule(redirect, abs, memo)
            .catch(function (fallbackError) {
                module.redirect = null;
                // Prefer the original error
                module.error = error || fallbackError;
            });
        } else {
            module.error = error;
        }
    }

    return module.loadedPromise;
};

System.prototype.finishLoadingModule = function finishLoadingModule(module, memo) {
    var self = this;
    return Promise.resolve().then(function () {
        return self.analyze(module);
    }).then(function () {
        return Promise.all(module.dependencies.map(function onDependency(dependency) {
            return self.deepLoad(dependency, module.id, memo);
        }));
    });
};

System.prototype.lookup = function lookup(rel, abs) {
    var self = this;
    var res = Identifier.resolve(rel, abs);
    if (Identifier.isAbsolute(rel)) {
        if (self.externalRedirects[res]) {
            return self.lookup(self.externalRedirects[res], res);
        }
        var head = Identifier.head(res);
        var tail = Identifier.tail(res);
        if (self.dependencies[head]) {
            return self.getSystem(head, abs).lookupInternalModule(tail, "");
        } else if (self.modules[head] && !tail) {
            return self.modules[head];
        } else {
            var via = abs ? " via " + JSON.stringify(abs) : "";
            throw new Error(
                "Can't look up " + JSON.stringify(rel) + via +
                " in " + JSON.stringify(self.location) +
                " because there is no external module or dependency by that name"
            );
        }
    } else {
        return self.lookupInternalModule(rel, abs);
    }
};

System.prototype.lookupInternalModule = function lookupInternalModule(rel, abs) {
    var self = this;

    var res = Identifier.resolve(rel, abs);
    var id = self.normalizeIdentifier(res);

    if (self.internalRedirects[id]) {
        return self.lookup(self.internalRedirects[id], res);
    }

    var filename = self.name + "/" + id;
    // This module system is case-insensitive, but mandates that a module must
    // be consistently identified by the same case convention to avoid problems
    // when migrating to case-sensitive file systems.
    var key = filename.toLowerCase();
    var module = self.modules[key];

    if (module && module.redirect && module.redirect !== module.id) {
        return self.lookupInternalModule(module.redirect);
    }

    if (!module) {
        module = new Module();
        module.id = id;
        module.extension = Identifier.extension(id);
        module.location = URL.resolve(self.location, id);
        module.filename = filename;
        module.dirname = Identifier.dirname(filename);
        module.key = key;
        module.system = self;
        module.modules = self.modules;
        self.modules[key] = module;
    }

    if (module.filename !== filename) {
        module.error = new Error(
            "Can't refer to single module with multiple case conventions: " +
            JSON.stringify(filename) + " and " +
            JSON.stringify(module.filename)
        );
    }

    return module;
};

System.prototype.addExtensions = function (map) {
    var extensions = Object.keys(map);
    for (var index = 0; index < extensions.length; index++) {
        var extension = extensions[index];
        var id = map[extension];
        this.analyzers[extension] = this.makeLoadStep(id, "analyze");
        this.translators[extension] = this.makeLoadStep(id, "translate");
    }
};

System.prototype.makeLoadStep = function makeLoadStep(id, name) {
    var self = this;
    return function moduleLoaderStep(module) {
        return self.getBuildSystem()
        .import(id)
        .then(function (exports) {
            if (exports[name]) {
                return exports[name](module);
            }
        });
    };
};

// Translate:

System.prototype.translate = function translate(module) {
    var self = this;
    if (
        module.text != null &&
        module.extension != null &&
        self.translators[module.extension]
    ) {
        return self.translators[module.extension](module);
    }
};

System.prototype.translateJson = function translateJson(module) {
    module.text = "module.exports = " + module.text.trim() + ";\n";
};

// Analyze:

System.prototype.analyze = function analyze(module) {
    if (
        module.text != null &&
        module.extension != null &&
        this.analyzers[module.extension]
    ) {
        return this.analyzers[module.extension](module);
    }
};

System.prototype.analyzeJavaScript = function analyzeJavaScript(module) {
    module.dependencies.push.apply(module.dependencies, parseDependencies(module.text));
};

// Compile:

System.prototype.compile = function (module) {
    if (
        module.factory == null &&
        module.redirect == null &&
        module.exports == null
    ) {
        compile(module);
    }
};

// Resource:

System.prototype.getResource = function getResource(rel, abs) {
    var self = this;
    if (Identifier.isAbsolute(rel)) {
        var head = Identifier.head(rel);
        var tail = Identifier.tail(rel);
        return self.getSystem(head, abs).getInternalResource(tail);
    } else {
        return self.getInternalResource(Identifier.resolve(rel, abs));
    }
};

System.prototype.locateResource = function locateResource(rel, abs) {
    var self = this;
    if (Identifier.isAbsolute(rel)) {
        var head = Identifier.head(rel);
        var tail = Identifier.tail(rel);
        return self.loadSystem(head, abs)
        .then(function onSystemLoaded(subsystem) {
            return subsystem.getInternalResource(tail);
        });
    } else {
        return Promise.resolve(self.getInternalResource(Identifier.resolve(rel, abs)));
    }
};

System.prototype.getInternalResource = function getInternalResource(id) {
    var self = this;
    // TODO redirects
    var filename = self.name + "/" + id;
    var key = filename.toLowerCase();
    var resource = self.resources[key];
    if (!resource) {
        resource = new Resource();
        resource.id = id;
        resource.filename = filename;
        resource.dirname = Identifier.dirname(filename);
        resource.key = key;
        resource.location = URL.resolve(self.location, id);
        resource.system = self;
        self.resources[key] = resource;
    }
    return resource;
};

// Dependencies:

System.prototype.addDependencies = function addDependencies(dependencies) {
    var self = this;
    var names = Object.keys(dependencies);
    for (var index = 0; index < names.length; index++) {
        var name = names[index];
        self.dependencies[name] = true;
        if (!self.systemLocations[name]) {
            var location;
            if (this.strategy === "flat") {
                location = URL.resolve(self.root.location, "node_modules/" + name + "/");
            } else {
                location = URL.resolve(self.location, "node_modules/" + name + "/");
            }
            self.systemLocations[name] = location;
        }
    }
};

// introduce allows an analyzer module to introduce a package to a dependency
// of the analyzer's package.
System.prototype.introduce = function introduce(system, name) {
    if (!this.dependencies[name]) {
        throw new Error("Extension package cannot introduce a module to a package that the analyzer does not directly depend upon.");
    }
    system.dependencies[name] = true;
    if (!system.systemLocations[name]) {
        system.systemLocations[name] = this.systemLocations[name];
    }
};

// Redirects:

System.prototype.addRedirects = function addRedirects(redirects) {
    var self = this;
    var sources = Object.keys(redirects);
    for (var index = 0; index < sources.length; index++) {
        var source = sources[index];
        var target = redirects[source];
        self.addRedirect(source, target);
    }
};

System.prototype.addRedirect = function addRedirect(source, target) {
    var self = this;
    if (Identifier.isAbsolute(source)) {
        self.externalRedirects[source] = target;
    } else {
        source = self.normalizeIdentifier(Identifier.resolve(source));
        self.internalRedirects[source] = target;
    }
};

// Etc:

System.prototype.overlayBrowser = function overlayBrowser(description) {
    var self = this;
    if (typeof description.browser === "string") {
        self.addRedirect("", description.browser);
    } else if (description.browser && typeof description.browser === "object") {
        self.addRedirects(description.browser);
    }
};

System.prototype.inspect = function () {
    var self = this;
    return {type: "system", location: self.location};
};

function inferStrategy(description) {
    // The existence of an _args property in package.json distinguishes
    // packages that were installed with npm version 3 or higher.
    if (description._args) {
        return "flat";
    }
    return "nested";
}


/***/ }),

/***/ 71:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*eslint-env browser*/


exports.resolve = function resolve(base, relative) {
    return new URL(relative, base).toString();
};


/***/ }),

/***/ 72:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.isAbsolute = isAbsolute;
function isAbsolute(path) {
    return (
        path !== "" &&
        path.lastIndexOf("./", 0) < 0 &&
        path.lastIndexOf("../", 0) < 0
    );
}

exports.isBare = isBare;
function isBare(id) {
    var lastSlash = id.lastIndexOf("/");
    return id.indexOf(".", lastSlash) < 0;
}

// TODO @user/name package names

exports.head = head;
function head(id) {
    var firstSlash = id.indexOf("/");
    if (firstSlash < 0) { return id; }
    return id.slice(0, firstSlash);
}

exports.tail = tail;
function tail(id) {
    var firstSlash = id.indexOf("/");
    if (firstSlash < 0) { return ""; }
    return id.slice(firstSlash + 1);
}

exports.extension = extension;
function extension(id) {
    var lastSlash = id.lastIndexOf("/");
    var lastDot = id.lastIndexOf(".");
    if (lastDot <= lastSlash) { return ""; }
    return id.slice(lastDot + 1);
}

exports.dirname = dirname;
function dirname(id) {
    var lastSlash = id.lastIndexOf("/");
    if (lastSlash < 0) {
        return id;
    }
    return id.slice(0, lastSlash);
}

exports.basename = basename;
function basename(id) {
    var lastSlash = id.lastIndexOf("/");
    if (lastSlash < 0) {
        return id;
    }
    return id.slice(lastSlash + 1);
}

exports.resolve = resolve;
function resolve(rel, abs) {
    abs = abs || "";
    var source = rel.split("/");
    var target = [];
    var parts;
    if (source.length && source[0] === "." || source[0] === "..") {
        parts = abs.split("/");
        parts.pop();
        source.unshift.apply(source, parts);
    }
    for (var index = 0; index < source.length; index++) {
        if (source[index] === "..") {
            if (target.length) {
                target.pop();
            }
        } else if (source[index] !== "" && source[index] !== ".") {
            target.push(source[index]);
        }
    }
    return target.join("/");
}


/***/ }),

/***/ 73:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = Module;

function Module() {
    this.id = null;
    this.extension = null;
    this.system = null;
    this.key = null;
    this.filename = null;
    this.dirname = null;
    this.exports = null;
    this.redirect = null;
    this.text = null;
    this.factory = null;
    this.dependencies = [];
    this.loadedPromise = null;
    // for bundles
    this.index = null;
    this.bundled = false;
}


/***/ }),

/***/ 74:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = Resource;

function Resource() {
    this.id = null;
    this.filename = null;
    this.dirname = null;
    this.key = null;
    this.location = null;
    this.system = null;
}


/***/ }),

/***/ 75:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = parseDependencies;
function parseDependencies(text) {
    var dependsUpon = {};
    String(text).replace(/(?:^|[^\w\$_.])require\s*\(\s*["']([^"']*)["']\s*\)/g, function(_, id) {
        dependsUpon[id] = true;
    });
    return Object.keys(dependsUpon);
}


/***/ }),

/***/ 76:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

module.exports = compile;

// By using a named "eval" most browsers will execute in the global scope.
// http://www.davidflanagan.com/2010/12/global-eval-in.html
// Unfortunately execScript doesn't always return the value of the evaluated expression (at least in Chrome)
var globalEval = /*this.execScript ||*/eval;
// For Firebug evaled code isn't debuggable otherwise
// http://code.google.com/p/fbug/issues/detail?id=2198
if (global.navigator && global.navigator.userAgent.indexOf("Firefox") >= 0) {
    globalEval = new Function("_", "return eval(_)");
}

function compile(module) {

    // Here we use a couple tricks to make debugging better in various browsers:
    // TODO: determine if these are all necessary / the best options
    // 1. name the function with something inteligible since some debuggers display the first part of each eval (Firebug)
    // 2. append the "//# sourceURL=filename" hack (Safari, Chrome, Firebug)
    //  * http://pmuellr.blogspot.com/2009/06/debugger-friendly.html
    //  * http://blog.getfirebug.com/2009/08/11/give-your-eval-a-name-with-sourceurl/
    //      TODO: investigate why this isn't working in Firebug.
    // 3. set displayName property on the factory function (Safari, Chrome)

    var displayName = module.filename.replace(/[^\w\d]|^\d/g, "_");

    try {
        module.factory = globalEval(
            "(function " +
            displayName +
             "(require, exports, module, __filename, __dirname) {" +
            module.text +
            "//*/\n})\n//# sourceURL=" +
            module.system.location + module.id
        );
    } catch (exception) {
        exception.message = exception.message + " in " + module.filename;
        throw exception;
    }

    // This should work and would be simpler, but Firebug does not show scripts executed via "new Function()" constructor.
    // TODO: sniff browser?
    // module.factory = new Function("require", "exports", "module", module.text + "\n//*/"+sourceURLComment);

    module.factory.displayName = module.filename;
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),

/***/ 8:
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = __webpack_require__(5);
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ })

/******/ });