/******/ (function(modules) { // webpackBootstrap
/******/ 	
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/ 		
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/ 		
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 		
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/ 	
/******/ 	
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var bus, deck, events, hub, store;
	
	events = __webpack_require__(3);
	
	store = __webpack_require__(4);
	
	hub = __webpack_require__(21);
	
	deck = __webpack_require__(2);
	
	hub.connect().then(function(val) {
	  var userList;
	  console.log(val.room);
	  userList = new goinstant.widgets.UserList({
	    room: val.room,
	    collapsed: false,
	    position: 'left'
	  });
	  userList.initialize(function(err) {
	    if (err) {
	      throw err;
	    }
	  });
	  $('#deck-source').keydown(function(e) {
	    if (e.keyCode === 13) {
	      return e.preventDefault();
	    }
	  }).keyup(function(e) {
	    if (e.keyCode === 13) {
	      return deck.load($(this).val());
	    }
	  });
	  $('#load-deck').click(function(e) {
	    return deck.load($('#deck-source').val());
	  });
	})["catch"](function(err) {
	  console.log(err);
	});
	
	bus = new events.EventEmitter();


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Deck, promise, store;
	
	store = __webpack_require__(4);
	
	promise = __webpack_require__(5);
	
	Deck = (function() {
	  function Deck() {
	    this.gist_url = store.get('deck_gist_url');
	    this.list = store.get('deck_list') || [];
	    this.hash = null;
	  }
	
	  Deck.prototype.load = function(gist_url) {
	    $.ajax({
	      url: 'https://api.github.com/gists/' + gist_url,
	      type: 'GET',
	      dataType: 'jsonp'
	    }).success(function(rec) {
	      var data, file, meta;
	      meta = rec.meta;
	      data = rec.data;
	      if (meta.status !== 200) {
	        return;
	      }
	      file = Object.keys(data.files)[0];
	      return console.log(data.files[file].content);
	    }).error(function(e) {
	      return console.log(e);
	    });
	  };
	
	  return Deck;
	
	})();
	
	module.exports = new Deck();


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
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
	
	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;
	
	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;
	
	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;
	
	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;
	
	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};
	
	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;
	
	  if (!this._events)
	    this._events = {};
	
	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        throw TypeError('Uncaught, unspecified "error" event.');
	      }
	      return false;
	    }
	  }
	
	  handler = this._events[type];
	
	  if (isUndefined(handler))
	    return false;
	
	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        len = arguments.length;
	        args = new Array(len - 1);
	        for (i = 1; i < len; i++)
	          args[i - 1] = arguments[i];
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    len = arguments.length;
	    args = new Array(len - 1);
	    for (i = 1; i < len; i++)
	      args[i - 1] = arguments[i];
	
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }
	
	  return true;
	};
	
	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events)
	    this._events = {};
	
	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);
	
	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];
	
	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    var m;
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }
	
	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      console.trace();
	    }
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.on = EventEmitter.prototype.addListener;
	
	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  var fired = false;
	
	  function g() {
	    this.removeListener(type, g);
	
	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }
	
	  g.listener = listener;
	  this.on(type, g);
	
	  return this;
	};
	
	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events || !this._events[type])
	    return this;
	
	  list = this._events[type];
	  length = list.length;
	  position = -1;
	
	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	
	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }
	
	    if (position < 0)
	      return this;
	
	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }
	
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;
	
	  if (!this._events)
	    return this;
	
	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }
	
	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }
	
	  listeners = this._events[type];
	
	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];
	
	  return this;
	};
	
	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};
	
	EventEmitter.listenerCount = function(emitter, type) {
	  var ret;
	  if (!emitter._events || !emitter._events[type])
	    ret = 0;
	  else if (isFunction(emitter._events[type]))
	    ret = 1;
	  else
	    ret = emitter._events[type].length;
	  return ret;
	};
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	
	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(global) {;(function(win){
		var store = {},
			doc = win.document,
			localStorageName = 'localStorage',
			storage
	
		store.disabled = false
		store.set = function(key, value) {}
		store.get = function(key) {}
		store.remove = function(key) {}
		store.clear = function() {}
		store.transact = function(key, defaultVal, transactionFn) {
			var val = store.get(key)
			if (transactionFn == null) {
				transactionFn = defaultVal
				defaultVal = null
			}
			if (typeof val == 'undefined') { val = defaultVal || {} }
			transactionFn(val)
			store.set(key, val)
		}
		store.getAll = function() {}
		store.forEach = function() {}
	
		store.serialize = function(value) {
			return JSON.stringify(value)
		}
		store.deserialize = function(value) {
			if (typeof value != 'string') { return undefined }
			try { return JSON.parse(value) }
			catch(e) { return value || undefined }
		}
	
		// Functions to encapsulate questionable FireFox 3.6.13 behavior
		// when about.config::dom.storage.enabled === false
		// See https://github.com/marcuswestin/store.js/issues#issue/13
		function isLocalStorageNameSupported() {
			try { return (localStorageName in win && win[localStorageName]) }
			catch(err) { return false }
		}
	
		if (isLocalStorageNameSupported()) {
			storage = win[localStorageName]
			store.set = function(key, val) {
				if (val === undefined) { return store.remove(key) }
				storage.setItem(key, store.serialize(val))
				return val
			}
			store.get = function(key) { return store.deserialize(storage.getItem(key)) }
			store.remove = function(key) { storage.removeItem(key) }
			store.clear = function() { storage.clear() }
			store.getAll = function() {
				var ret = {}
				store.forEach(function(key, val) {
					ret[key] = val
				})
				return ret
			}
			store.forEach = function(callback) {
				for (var i=0; i<storage.length; i++) {
					var key = storage.key(i)
					callback(key, store.get(key))
				}
			}
		} else if (doc.documentElement.addBehavior) {
			var storageOwner,
				storageContainer
			// Since #userData storage applies only to specific paths, we need to
			// somehow link our data to a specific path.  We choose /favicon.ico
			// as a pretty safe option, since all browsers already make a request to
			// this URL anyway and being a 404 will not hurt us here.  We wrap an
			// iframe pointing to the favicon in an ActiveXObject(htmlfile) object
			// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
			// since the iframe access rules appear to allow direct access and
			// manipulation of the document element, even for a 404 page.  This
			// document can be used instead of the current document (which would
			// have been limited to the current path) to perform #userData storage.
			try {
				storageContainer = new ActiveXObject('htmlfile')
				storageContainer.open()
				storageContainer.write('<s' + 'cript>document.w=window</s' + 'cript><iframe src="/favicon.ico"></iframe>')
				storageContainer.close()
				storageOwner = storageContainer.w.frames[0].document
				storage = storageOwner.createElement('div')
			} catch(e) {
				// somehow ActiveXObject instantiation failed (perhaps some special
				// security settings or otherwse), fall back to per-path storage
				storage = doc.createElement('div')
				storageOwner = doc.body
			}
			function withIEStorage(storeFunction) {
				return function() {
					var args = Array.prototype.slice.call(arguments, 0)
					args.unshift(storage)
					// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
					// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
					storageOwner.appendChild(storage)
					storage.addBehavior('#default#userData')
					storage.load(localStorageName)
					var result = storeFunction.apply(store, args)
					storageOwner.removeChild(storage)
					return result
				}
			}
	
			// In IE7, keys may not contain special chars. See all of https://github.com/marcuswestin/store.js/issues/40
			var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
			function ieKeyFix(key) {
				return key.replace(forbiddenCharsRegex, '___')
			}
			store.set = withIEStorage(function(storage, key, val) {
				key = ieKeyFix(key)
				if (val === undefined) { return store.remove(key) }
				storage.setAttribute(key, store.serialize(val))
				storage.save(localStorageName)
				return val
			})
			store.get = withIEStorage(function(storage, key) {
				key = ieKeyFix(key)
				return store.deserialize(storage.getAttribute(key))
			})
			store.remove = withIEStorage(function(storage, key) {
				key = ieKeyFix(key)
				storage.removeAttribute(key)
				storage.save(localStorageName)
			})
			store.clear = withIEStorage(function(storage) {
				var attributes = storage.XMLDocument.documentElement.attributes
				storage.load(localStorageName)
				for (var i=0, attr; attr=attributes[i]; i++) {
					storage.removeAttribute(attr.name)
				}
				storage.save(localStorageName)
			})
			store.getAll = function(storage) {
				var ret = {}
				store.forEach(function(key, val) {
					ret[key] = val
				})
				return ret
			}
			store.forEach = withIEStorage(function(storage, callback) {
				var attributes = storage.XMLDocument.documentElement.attributes
				for (var i=0, attr; attr=attributes[i]; ++i) {
					callback(attr.name, store.deserialize(storage.getAttribute(attr.name)))
				}
			})
		}
	
		try {
			var testKey = '__storejs__'
			store.set(testKey, testKey)
			if (store.get(testKey) != testKey) { store.disabled = true }
			store.remove(testKey)
		} catch(e) {
			store.disabled = true
		}
		store.enabled = !store.disabled
		
		if (typeof module != 'undefined' && module.exports) { module.exports = store }
		else if (true) { !(__WEBPACK_AMD_DEFINE_FACTORY__ = (store), (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_RESULT__ = __WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : module.exports = __WEBPACK_AMD_DEFINE_FACTORY__)) }
		else { win.store = store }
		
	})(this.window || global);
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	
	/**
	 * Promises/A+ and when() implementation
	 * when is part of the cujoJS family of libraries (http://cujojs.com/)
	 * @author Brian Cavalier
	 * @author John Hann
	 * @version 3.1.0
	 */
	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require) {
	
		var timed = __webpack_require__(7);
		var array = __webpack_require__(8);
		var flow = __webpack_require__(9);
		var inspect = __webpack_require__(10);
		var generate = __webpack_require__(11);
		var progress = __webpack_require__(12);
		var withThis = __webpack_require__(13);
	
		var Promise = [array, flow, generate, progress, inspect, withThis, timed]
			.reduceRight(function(Promise, feature) {
				return feature(Promise);
			}, __webpack_require__(6));
	
		var resolve = Promise.resolve;
		var slice = Array.prototype.slice;
	
		// Public API
	
		when.promise     = promise;              // Create a pending promise
		when.resolve     = Promise.resolve;      // Create a resolved promise
		when.reject      = Promise.reject;       // Create a rejected promise
	
		when.lift        = lift;                 // lift a function to return promises
		when['try']      = tryCall;              // call a function and return a promise
		when.attempt     = tryCall;              // alias for when.try
	
		when.iterate     = Promise.iterate;      // Generate a stream of promises
		when.unfold      = Promise.unfold;       // Generate a stream of promises
	
		when.join        = join;                 // Join 2 or more promises
	
		when.all         = all;                  // Resolve a list of promises
		when.settle      = settle;               // Settle a list of promises
	
		when.any         = lift(Promise.any);    // One-winner race
		when.some        = lift(Promise.some);   // Multi-winner race
	
		when.map         = map;                  // Array.map() for promises
		when.reduce      = reduce;               // Array.reduce() for promises
		when.reduceRight = reduceRight;          // Array.reduceRight() for promises
	
		when.isPromiseLike = isPromiseLike;      // Is something promise-like, aka thenable
	
		when.Promise     = Promise;              // Promise constructor
		when.defer       = defer;                // Create a {promise, resolve, reject} tuple
	
		/**
		 * When x, which may be a promise, thenable, or non-promise value,
		 *
		 * @param {*} x
		 * @param {function?} onFulfilled callback to be called when x is
		 *   successfully fulfilled.  If promiseOrValue is an immediate value, callback
		 *   will be invoked immediately.
		 * @param {function?} onRejected callback to be called when x is
		 *   rejected.
		 * @param {function?} onProgress callback to be called when progress updates
		 *   are issued for x.
		 * @returns {Promise} a new promise that will fulfill with the return
		 *   value of callback or errback or the completion value of promiseOrValue if
		 *   callback and/or errback is not supplied.
		 */
		function when(x, onFulfilled, onRejected, onProgress) {
			var p = resolve(x);
			return arguments.length < 2 ? p : p.then(onFulfilled, onRejected, onProgress);
		}
	
		/**
		 * Creates a new promise whose fate is determined by resolver.
		 * @param {function} resolver function(resolve, reject, notify)
		 * @returns {Promise} promise whose fate is determine by resolver
		 */
		function promise(resolver) {
			return new Promise(resolver);
		}
	
		/**
		 * Lift the supplied function, creating a version of f that returns
		 * promises, and accepts promises as arguments.
		 * @param {function} f
		 * @returns {Function} version of f that returns promises
		 */
		function lift(f) {
			return function() {
				return _apply(f, this, slice.call(arguments));
			};
		}
	
		/**
		 * Call f in a future turn, with the supplied args, and return a promise
		 * for the result.
		 * @param {function} f
		 * @returns {Promise}
		 */
		function tryCall(f /*, args... */) {
			/*jshint validthis:true */
			return _apply(f, this, slice.call(arguments, 1));
		}
	
		/**
		 * try/lift helper that allows specifying thisArg
		 * @private
		 */
		function _apply(func, thisArg, args) {
			return Promise.all(args).then(function(args) {
				return func.apply(thisArg, args);
			});
		}
	
		/**
		 * Creates a {promise, resolver} pair, either or both of which
		 * may be given out safely to consumers.
		 * @return {{promise: Promise, resolve: function, reject: function, notify: function}}
		 */
		function defer() {
			return new Deferred();
		}
	
		function Deferred() {
			var p = Promise._defer();
	
			function resolve(x) { p._handler.resolve(x); }
			function reject(x) { p._handler.reject(x); }
			function notify(x) { p._handler.notify(x); }
	
			this.promise = p;
			this.resolve = resolve;
			this.reject = reject;
			this.notify = notify;
			this.resolver = { resolve: resolve, reject: reject, notify: notify };
		}
	
		/**
		 * Determines if x is promise-like, i.e. a thenable object
		 * NOTE: Will return true for *any thenable object*, and isn't truly
		 * safe, since it may attempt to access the `then` property of x (i.e.
		 *  clever/malicious getters may do weird things)
		 * @param {*} x anything
		 * @returns {boolean} true if x is promise-like
		 */
		function isPromiseLike(x) {
			return x && typeof x.then === 'function';
		}
	
		/**
		 * Return a promise that will resolve only once all the supplied arguments
		 * have resolved. The resolution value of the returned promise will be an array
		 * containing the resolution values of each of the arguments.
		 * @param {...*} arguments may be a mix of promises and values
		 * @returns {Promise}
		 */
		function join(/* ...promises */) {
			return Promise.all(arguments);
		}
	
		/**
		 * Return a promise that will fulfill once all input promises have
		 * fulfilled, or reject when any one input promise rejects.
		 * @param {array|Promise} promises array (or promise for an array) of promises
		 * @returns {Promise}
		 */
		function all(promises) {
			return when(promises, Promise.all);
		}
	
		/**
		 * Return a promise that will always fulfill with an array containing
		 * the outcome states of all input promises.  The returned promise
		 * will only reject if `promises` itself is a rejected promise.
		 * @param {array|Promise} promises array (or promise for an array) of promises
		 * @returns {Promise}
		 */
		function settle(promises) {
			return when(promises, Promise.settle);
		}
	
		/**
		 * Promise-aware array map function, similar to `Array.prototype.map()`,
		 * but input array may contain promises or values.
		 * @param {Array|Promise} promises array of anything, may contain promises and values
		 * @param {function} mapFunc map function which may return a promise or value
		 * @returns {Promise} promise that will fulfill with an array of mapped values
		 *  or reject if any input promise rejects.
		 */
		function map(promises, mapFunc) {
			return when(promises, function(promises) {
				return Promise.map(promises, mapFunc);
			});
		}
	
		/**
		 * Traditional reduce function, similar to `Array.prototype.reduce()`, but
		 * input may contain promises and/or values, and reduceFunc
		 * may return either a value or a promise, *and* initialValue may
		 * be a promise for the starting value.
		 *
		 * @param {Array|Promise} promises array or promise for an array of anything,
		 *      may contain a mix of promises and values.
		 * @param {function} f reduce function reduce(currentValue, nextValue, index)
		 * @returns {Promise} that will resolve to the final reduced value
		 */
		function reduce(promises, f /*, initialValue */) {
			/*jshint unused:false*/
			var args = slice.call(arguments, 1);
			return when(promises, function(array) {
				args.unshift(array);
				return Promise.reduce.apply(Promise, args);
			});
		}
	
		/**
		 * Traditional reduce function, similar to `Array.prototype.reduceRight()`, but
		 * input may contain promises and/or values, and reduceFunc
		 * may return either a value or a promise, *and* initialValue may
		 * be a promise for the starting value.
		 *
		 * @param {Array|Promise} promises array or promise for an array of anything,
		 *      may contain a mix of promises and values.
		 * @param {function} f reduce function reduce(currentValue, nextValue, index)
		 * @returns {Promise} that will resolve to the final reduced value
		 */
		function reduceRight(promises, f /*, initialValue */) {
			/*jshint unused:false*/
			var args = slice.call(arguments, 1);
			return when(promises, function(array) {
				args.unshift(array);
				return Promise.reduceRight.apply(Promise, args);
			});
		}
	
		return when;
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	})(__webpack_require__(14));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */
	
	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require) {
	
		var makePromise = __webpack_require__(15);
		var Scheduler = __webpack_require__(16);
		var async = __webpack_require__(17);
	
		return makePromise({
			scheduler: new Scheduler(async),
			monitor: typeof console !== 'undefined' ? console : void 0
		});
	
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	})(__webpack_require__(14));


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */
	
	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {
	
		var timer = __webpack_require__(18);
	
		return function timed(Promise) {
			/**
			 * Return a new promise whose fulfillment value is revealed only
			 * after ms milliseconds
			 * @param {number} ms milliseconds
			 * @returns {Promise}
			 */
			Promise.prototype.delay = function(ms) {
				var p = this._beget();
	
				this._handler.chain(p._handler,
					function delay(x) {
						var h = this; // this = p._handler
						timer.set(function() { h.resolve(x); }, ms);
					},
					p._handler.reject, p._handler.notify);
	
				return p;
			};
	
			/**
			 * Return a new promise that rejects after ms milliseconds unless
			 * this promise fulfills earlier, in which case the returned promise
			 * fulfills with the same value.
			 * @param {number} ms milliseconds
			 * @param {Error|*=} reason optional rejection reason to use, defaults
			 *   to an Error if not provided
			 * @returns {Promise}
			 */
			Promise.prototype.timeout = function(ms, reason) {
				var hasReason = arguments.length > 1;
				var p = this._beget();
	
				var t = timer.set(onTimeout, ms);
	
				this._handler.chain(p._handler,
					function onFulfill(x) {
						timer.clear(t);
						this.resolve(x); // this = p._handler
					},
					function onReject(x) {
						timer.clear(t);
						this.reject(x); // this = p._handler
					},
					p._handler.notify);
	
				return p;
	
				function onTimeout() {
					p._handler.reject(hasReason
						? reason : new Error('timed out after ' + ms + 'ms'));
				}
			};
	
			return Promise;
	
		};
	
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(14)));


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */
	
	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
	
		return function array(Promise) {
	
			var arrayMap = Array.prototype.map;
			var arrayReduce = Array.prototype.reduce;
			var arrayReduceRight = Array.prototype.reduceRight;
			var arrayForEach = Array.prototype.forEach;
	
			var toPromise = Promise.resolve;
			var all = Promise.all;
	
			// Additional array combinators
	
			Promise.any = any;
			Promise.some = some;
			Promise.settle = settle;
	
			Promise.map = map;
			Promise.reduce = reduce;
			Promise.reduceRight = reduceRight;
	
			/**
			 * When this promise fulfills with an array, do
			 * onFulfilled.apply(void 0, array)
			 * @param (function) onFulfilled function to apply
			 * @returns {Promise} promise for the result of applying onFulfilled
			 */
			Promise.prototype.spread = function(onFulfilled) {
				return this.then(all).then(function(array) {
					return onFulfilled.apply(void 0, array);
				});
			};
	
			return Promise;
	
			/**
			 * One-winner competitive race.
			 * Return a promise that will fulfill when one of the promises
			 * in the input array fulfills, or will reject when all promises
			 * have rejected.
			 * @param {array} promises
			 * @returns {Promise} promise for the first fulfilled value
			 */
			function any(promises) {
				return new Promise(function(resolve, reject) {
					var pending = 0;
					var errors = [];
	
					arrayForEach.call(promises, function(p) {
						++pending;
						toPromise(p).then(resolve, handleReject);
					});
	
					if(pending === 0) {
						resolve();
					}
	
					function handleReject(e) {
						errors.push(e);
						if(--pending === 0) {
							reject(errors);
						}
					}
				});
			}
	
			/**
			 * N-winner competitive race
			 * Return a promise that will fulfill when n input promises have
			 * fulfilled, or will reject when it becomes impossible for n
			 * input promises to fulfill (ie when promises.length - n + 1
			 * have rejected)
			 * @param {array} promises
			 * @param {number} n
			 * @returns {Promise} promise for the earliest n fulfillment values
			 */
			function some(promises, n) {
				return new Promise(function(resolve, reject, notify) {
					var nFulfill = 0;
					var nReject;
					var results = [];
					var errors = [];
	
					arrayForEach.call(promises, function(p) {
						++nFulfill;
						toPromise(p).then(handleResolve, handleReject, notify);
					});
	
					n = Math.max(n, 0);
					nReject = (nFulfill - n + 1);
					nFulfill = Math.min(n, nFulfill);
	
					if(nFulfill === 0) {
						resolve(results);
						return;
					}
	
					function handleResolve(x) {
						if(nFulfill > 0) {
							--nFulfill;
							results.push(x);
	
							if(nFulfill === 0) {
								resolve(results);
							}
						}
					}
	
					function handleReject(e) {
						if(nReject > 0) {
							--nReject;
							errors.push(e);
	
							if(nReject === 0) {
								reject(errors);
							}
						}
					}
				});
			}
	
			/**
			 * Apply f to the value of each promise in a list of promises
			 * and return a new list containing the results.
			 * @param {array} promises
			 * @param {function} f
			 * @param {function} fallback
			 * @returns {Promise}
			 */
			function map(promises, f, fallback) {
				return all(arrayMap.call(promises, function(x) {
					return toPromise(x).then(f, fallback);
				}));
			}
	
			/**
			 * Return a promise that will always fulfill with an array containing
			 * the outcome states of all input promises.  The returned promise
			 * will never reject.
			 * @param {array} promises
			 * @returns {Promise}
			 */
			function settle(promises) {
				return all(arrayMap.call(promises, function(p) {
					p = toPromise(p);
					return p.then(inspect, inspect);
	
					function inspect() {
						return p.inspect();
					}
				}));
			}
	
			function reduce(promises, f) {
				return arguments.length > 2
					? arrayReduce.call(promises, reducer, arguments[2])
					: arrayReduce.call(promises, reducer);
	
				function reducer(result, x, i) {
					return toPromise(result).then(function(r) {
						return toPromise(x).then(function(x) {
							return f(r, x, i);
						});
					});
				}
			}
	
			function reduceRight(promises, f) {
				return arguments.length > 2
					? arrayReduceRight.call(promises, reducer, arguments[2])
					: arrayReduceRight.call(promises, reducer);
	
				function reducer(result, x, i) {
					return toPromise(result).then(function(r) {
						return toPromise(x).then(function(x) {
							return f(r, x, i);
						});
					});
				}
			}
		};
	
	
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(14)));


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */
	
	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {
	
		var setTimer = __webpack_require__(18).set;
	
		return function flow(Promise) {
	
			var resolve = Promise.resolve;
			var reject = Promise.reject;
			var origCatch = Promise.prototype['catch'];
	
			/**
			 * Handle the ultimate fulfillment value or rejection reason, and assume
			 * responsibility for all errors.  If an error propagates out of result
			 * or handleFatalError, it will be rethrown to the host, resulting in a
			 * loud stack track on most platforms and a crash on some.
			 * @param {function?} onResult
			 * @param {function?} onError
			 * @returns {undefined}
			 */
			Promise.prototype.done = function(onResult, onError) {
				var h = this._handler;
				h.when(this._maybeFatal, noop, this, h.receiver, onResult, onError);
			};
	
			/**
			 * Check if x is a rejected promise, and if so, delegate to this._fatal
			 * @private
			 * @param {*} x
			 */
			Promise.prototype._maybeFatal = function(x) {
				if((typeof x === 'object' || typeof x === 'function') && x !== null) {
					// Delegate to promise._fatal in case it has been overridden
					resolve(x)._handler.chain(this, void 0, this._fatal);
				}
			};
	
			/**
			 * Propagate fatal errors to the host environment.
			 * @private
			 */
			Promise.prototype._fatal = function(e) {
				if(this._handler._isMonitored()) {
					this._handler.join()._fatal(e);
				} else {
					setTimer(function() { throw e; }, 0);
				}
			};
	
			/**
			 * Add Error-type and predicate matching to catch.  Examples:
			 * promise.catch(TypeError, handleTypeError)
			 *   .catch(predicate, handleMatchedErrors)
			 *   .catch(handleRemainingErrors)
			 * @param onRejected
			 * @returns {*}
			 */
			Promise.prototype['catch'] = Promise.prototype.otherwise = function(onRejected) {
				if (arguments.length === 1) {
					return origCatch.call(this, onRejected);
				} else {
					if(typeof onRejected !== 'function') {
						return this.ensure(rejectInvalidPredicate);
					}
	
					return origCatch.call(this, createCatchFilter(arguments[1], onRejected));
				}
			};
	
			/**
			 * Wraps the provided catch handler, so that it will only be called
			 * if the predicate evaluates truthy
			 * @param {?function} handler
			 * @param {function} predicate
			 * @returns {function} conditional catch handler
			 */
			function createCatchFilter(handler, predicate) {
				return function(e) {
					return evaluatePredicate(e, predicate)
						? handler.call(this, e)
						: reject(e);
				};
			}
	
			/**
			 * Ensures that onFulfilledOrRejected will be called regardless of whether
			 * this promise is fulfilled or rejected.  onFulfilledOrRejected WILL NOT
			 * receive the promises' value or reason.  Any returned value will be disregarded.
			 * onFulfilledOrRejected may throw or return a rejected promise to signal
			 * an additional error.
			 * @param {function} handler handler to be called regardless of
			 *  fulfillment or rejection
			 * @returns {Promise}
			 */
			Promise.prototype['finally'] = Promise.prototype.ensure = function(handler) {
				if(typeof handler !== 'function') {
					// Optimization: result will not change, return same promise
					return this;
				}
	
				handler = isolate(handler, this);
				return this.then(handler, handler);
			};
	
			/**
			 * Recover from a failure by returning a defaultValue.  If defaultValue
			 * is a promise, it's fulfillment value will be used.  If defaultValue is
			 * a promise that rejects, the returned promise will reject with the
			 * same reason.
			 * @param {*} defaultValue
			 * @returns {Promise} new promise
			 */
			Promise.prototype['else'] = Promise.prototype.orElse = function(defaultValue) {
				return this.then(void 0, function() {
					return defaultValue;
				});
			};
	
			/**
			 * Shortcut for .then(function() { return value; })
			 * @param  {*} value
			 * @return {Promise} a promise that:
			 *  - is fulfilled if value is not a promise, or
			 *  - if value is a promise, will fulfill with its value, or reject
			 *    with its reason.
			 */
			Promise.prototype['yield'] = function(value) {
				return this.then(function() {
					return value;
				});
			};
	
			/**
			 * Runs a side effect when this promise fulfills, without changing the
			 * fulfillment value.
			 * @param {function} onFulfilledSideEffect
			 * @returns {Promise}
			 */
			Promise.prototype.tap = function(onFulfilledSideEffect) {
				return this.then(onFulfilledSideEffect)['yield'](this);
			};
	
			return Promise;
		};
	
		function rejectInvalidPredicate() {
			throw new TypeError('catch predicate must be a function');
		}
	
		function evaluatePredicate(e, predicate) {
			return isError(predicate) ? e instanceof predicate : predicate(e);
		}
	
		function isError(predicate) {
			return predicate === Error
				|| (predicate != null && predicate.prototype instanceof Error);
		}
	
		// prevent argument passing to f and ignore return value
		function isolate(f, x) {
			return function() {
				f.call(this);
				return x;
			};
		}
	
		function noop() {}
	
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(14)));


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */
	
	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
	
		return function inspect(Promise) {
	
			Promise.prototype.inspect = function() {
				return this._handler.inspect();
			};
	
			return Promise;
		};
	
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(14)));


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */
	
	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
	
		return function generate(Promise) {
	
			var resolve = Promise.resolve;
	
			Promise.iterate = iterate;
			Promise.unfold = unfold;
	
			return Promise;
	
			/**
			 * Generate a (potentially infinite) stream of promised values:
			 * x, f(x), f(f(x)), etc. until condition(x) returns true
			 * @param {function} f function to generate a new x from the previous x
			 * @param {function} condition function that, given the current x, returns
			 *  truthy when the iterate should stop
			 * @param {function} handler function to handle the value produced by f
			 * @param {*|Promise} x starting value, may be a promise
			 * @return {Promise} the result of the last call to f before
			 *  condition returns true
			 */
			function iterate(f, condition, handler, x) {
				return resolve(x).then(function(x) {
					return resolve(condition(x)).then(function(done) {
						return done ? x : next(x);
					});
				});
	
				function next(nextValue) {
					return resolve(handler(nextValue)).then(function() {
						return iterate(f, condition, handler, f(nextValue));
					});
				}
			}
	
			/**
			 * Generate a (potentially infinite) stream of promised values
			 * by applying handler(generator(seed)) iteratively until
			 * condition(seed) returns true.
			 * @param {function} unspool function that generates a [value, newSeed]
			 *  given a seed.
			 * @param {function} condition function that, given the current seed, returns
			 *  truthy when the unfold should stop
			 * @param {function} handler function to handle the value produced by unspool
			 * @param x {*|Promise} starting value, may be a promise
			 * @return {Promise} the result of the last value produced by unspool before
			 *  condition returns true
			 */
			function unfold(unspool, condition, handler, x) {
				return resolve(x).then(function(seed) {
					return resolve(condition(seed)).then(function(done) {
						return done ? seed : resolve(unspool(seed)).spread(next);
					});
				});
	
				function next(item, newSeed) {
					return resolve(handler(item)).then(function() {
						return unfold(unspool, condition, handler, newSeed);
					});
				}
			}
		};
	
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(14)));


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */
	
	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
	
		return function progress(Promise) {
	
			/**
			 * Register a progress handler for this promise
			 * @param {function} onProgress
			 * @returns {Promise}
			 */
			Promise.prototype.progress = function(onProgress) {
				return this.then(void 0, void 0, onProgress);
			};
	
			return Promise;
		};
	
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(14)));


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */
	
	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
	
		return function addWith(Promise) {
			/**
			 * Returns a promise whose handlers will be called with `this` set to
			 * the supplied `thisArg`.  Subsequent promises derived from the
			 * returned promise will also have their handlers called with `thisArg`.
			 * Calling `with` with undefined or no arguments will return a promise
			 * whose handlers will again be called in the usual Promises/A+ way (no `this`)
			 * thus safely undoing any previous `with` in the promise chain.
			 *
			 * WARNING: Promises returned from `with`/`withThis` are NOT Promises/A+
			 * compliant, specifically violating 2.2.5 (http://promisesaplus.com/#point-41)
			 *
			 * @param {object} thisArg `this` value for all handlers attached to
			 *  the returned promise.
			 * @returns {Promise}
			 */
			Promise.prototype['with'] = Promise.prototype.withThis
				= Promise.prototype._bindContext;
	
			return Promise;
		};
	
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(14)));
	


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */
	
	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
	
		return function makePromise(environment) {
	
			var tasks = environment.scheduler;
	
			var objectCreate = Object.create ||
				function(proto) {
					function Child() {}
					Child.prototype = proto;
					return new Child();
				};
	
			/**
			 * Create a promise whose fate is determined by resolver
			 * @constructor
			 * @returns {Promise} promise
			 * @name Promise
			 */
			function Promise(resolver) {
				this._handler = arguments.length === 0
					? foreverPendingHandler : init(resolver);
			}
	
			/**
			 * Run the supplied resolver
			 * @param resolver
			 * @returns {makePromise.DeferredHandler}
			 */
			function init(resolver) {
				var handler = new DeferredHandler();
	
				try {
					resolver(promiseResolve, promiseReject, promiseNotify);
				} catch (e) {
					promiseReject(e);
				}
	
				return handler;
	
				/**
				 * Transition from pre-resolution state to post-resolution state, notifying
				 * all listeners of the ultimate fulfillment or rejection
				 * @param {*} x resolution value
				 */
				function promiseResolve (x) {
					handler.resolve(x);
				}
				/**
				 * Reject this promise with reason, which will be used verbatim
				 * @param {Error|*} reason rejection reason, strongly suggested
				 *   to be an Error type
				 */
				function promiseReject (reason) {
					handler.reject(reason);
				}
	
				/**
				 * Issue a progress event, notifying all progress listeners
				 * @param {*} x progress event payload to pass to all listeners
				 */
				function promiseNotify (x) {
					handler.notify(x);
				}
			}
	
			// Creation
	
			Promise.resolve = resolve;
			Promise.reject = reject;
			Promise.never = never;
	
			Promise._defer = defer;
	
			/**
			 * Returns a trusted promise. If x is already a trusted promise, it is
			 * returned, otherwise returns a new trusted Promise which follows x.
			 * @param  {*} x
			 * @return {Promise} promise
			 */
			function resolve(x) {
				return x instanceof Promise ? x
					: promiseFromHandler(new AsyncHandler(getHandlerUnchecked(x)));
			}
	
			/**
			 * Return a reject promise with x as its reason (x is used verbatim)
			 * @param {*} x
			 * @returns {Promise} rejected promise
			 */
			function reject(x) {
				return promiseFromHandler(new AsyncHandler(new RejectedHandler(x)));
			}
	
			/**
			 * Return a promise that remains pending forever
			 * @returns {Promise} forever-pending promise.
			 */
			function never() {
				return foreverPendingPromise; // Should be frozen
			}
	
			/**
			 * Creates an internal {promise, resolver} pair
			 * @private
			 * @returns {{_handler: DeferredHandler, promise: Promise}}
			 */
			function defer() {
				return promiseFromHandler(new DeferredHandler());
			}
	
			/**
			 * Create a new promise with the supplied handler
			 * @private
			 * @param {object} handler
			 * @returns {Promise}
			 */
			function promiseFromHandler(handler) {
				return configurePromise(handler, new Promise());
			}
	
			function configurePromise(handler, p) {
				p._handler = handler;
				return p;
			}
	
			// Transformation and flow control
	
			/**
			 * Transform this promise's fulfillment value, returning a new Promise
			 * for the transformed result.  If the promise cannot be fulfilled, onRejected
			 * is called with the reason.  onProgress *may* be called with updates toward
			 * this promise's fulfillment.
			 * @param [onFulfilled] {Function} fulfillment handler
			 * @param [onRejected] {Function} rejection handler
			 * @param [onProgress] {Function} progress handler
			 * @return {Promise} new promise
			 */
			Promise.prototype.then = function(onFulfilled, onRejected, onProgress) {
				var p = this._beget();
				var parent = this._handler;
				var child = p._handler;
	
				parent.when(child.resolve, child.notify, child,
					parent.receiver, onFulfilled, onRejected, onProgress);
	
				return p;
			};
	
			/**
			 * If this promise cannot be fulfilled due to an error, call onRejected to
			 * handle the error. Shortcut for .then(undefined, onRejected)
			 * @param {function?} onRejected
			 * @return {Promise}
			 */
			Promise.prototype['catch'] = function(onRejected) {
				return this.then(void 0, onRejected);
			};
	
			/**
			 * Private function to bind a thisArg for this promise's handlers
			 * @private
			 * @param {object} thisArg `this` value for all handlers attached to
			 *  the returned promise.
			 * @returns {Promise}
			 */
			Promise.prototype._bindContext = function(thisArg) {
				return promiseFromHandler(new BoundHandler(this._handler, thisArg));
			};
	
			/**
			 * Creates a new, pending promise of the same type as this promise
			 * @private
			 * @returns {Promise}
			 */
			Promise.prototype._beget = function() {
				var p = new this.constructor();
				var parent = this._handler;
				var child = new DeferredHandler(parent.receiver, parent.join().context);
				return configurePromise(child, p);
			};
	
			// Array combinators
	
			Promise.all = all;
			Promise.race = race;
	
			/**
			 * Return a promise that will fulfill when all promises in the
			 * input array have fulfilled, or will reject when one of the
			 * promises rejects.
			 * @param {array} promises array of promises
			 * @returns {Promise} promise for array of fulfillment values
			 */
			function all(promises) {
				/*jshint maxcomplexity:6*/
				var resolver = new DeferredHandler();
				var len = promises.length >>> 0;
				var pending = len;
				var results = [];
				var i, h;
	
				for (i = 0; i < len; ++i) {
					if (i in promises) {
						h = getHandlerUnchecked(promises[i]);
						if(h.state === 0) {
							resolveOne(resolver, results, h, i);
						} else if (h.state === 1) {
							results[i] = h.value;
							--pending;
						} else {
							h.chain(resolver, void 0, resolver.reject);
							break;
						}
					} else {
						--pending;
					}
				}
	
				if(pending === 0) {
					resolver.resolve(results);
				}
	
				return promiseFromHandler(resolver);
	
				function resolveOne(resolver, results, handler, i) {
					handler.chain(resolver, function(x) {
						results[i] = x;
						if(--pending === 0) {
							this.resolve(results);
						}
					}, resolver.reject, resolver.notify);
				}
			}
	
			/**
			 * Fulfill-reject competitive race. Return a promise that will settle
			 * to the same state as the earliest input promise to settle.
			 *
			 * WARNING: The ES6 Promise spec requires that race()ing an empty array
			 * must return a promise that is pending forever.  This implementation
			 * returns a singleton forever-pending promise, the same singleton that is
			 * returned by Promise.never(), thus can be checked with ===
			 *
			 * @param {array} promises array of promises to race
			 * @returns {Promise} if input is non-empty, a promise that will settle
			 * to the same outcome as the earliest input promise to settle. if empty
			 * is empty, returns a promise that will never settle.
			 */
			function race(promises) {
				// Sigh, race([]) is untestable unless we return *something*
				// that is recognizable without calling .then() on it.
				if(Object(promises) === promises && promises.length === 0) {
					return never();
				}
	
				var h = new DeferredHandler();
				for(var i=0; i<promises.length; ++i) {
					getHandler(promises[i]).chain(h, h.resolve, h.reject);
				}
	
				return promiseFromHandler(h);
			}
	
			// Promise internals
	
			/**
			 * Get an appropriate handler for x, checking for untrusted thenables
			 * and promise graph cycles.
			 * @private
			 * @param {*} x
			 * @param {object?} h optional handler to check for cycles
			 * @returns {object} handler
			 */
			function getHandler(x, h) {
				if(x instanceof Promise) {
					return getHandlerChecked(x, h);
				}
				return maybeThenable(x) ? getHandlerUntrusted(x) : new FulfilledHandler(x);
			}
	
			/**
			 * Get an appropriate handler for x, without checking for cycles
			 * @private
			 * @param {*} x
			 * @returns {object} handler
			 */
			function getHandlerUnchecked(x) {
				if(x instanceof Promise) {
					return x._handler.join();
				}
				return maybeThenable(x) ? getHandlerUntrusted(x) : new FulfilledHandler(x);
			}
	
			/**
			 * Get x's handler, checking for cycles
			 * @param {Promise} x
			 * @param {object?} h handler to check for cycles
			 * @returns {object} handler
			 */
			function getHandlerChecked(x, h) {
				var xh = x._handler.join();
				return h === xh ? promiseCycleHandler() : xh;
			}
	
			/**
			 * Get a handler for potentially untrusted thenable x
			 * @param {*} x
			 * @returns {object} handler
			 */
			function getHandlerUntrusted(x) {
				try {
					var untrustedThen = x.then;
					return typeof untrustedThen === 'function'
						? new ThenableHandler(untrustedThen, x)
						: new FulfilledHandler(x);
				} catch(e) {
					return new RejectedHandler(e);
				}
			}
	
			/**
			 * Handler for a promise that is pending forever
			 * @private
			 * @constructor
			 */
			function Handler() {
				this.state = 0;
			}
	
			Handler.prototype.when
				= Handler.prototype.resolve
				= Handler.prototype.reject
				= Handler.prototype.notify
				= Handler.prototype._fatal
				= Handler.prototype._removeTrace
				= Handler.prototype._reportTrace
				= noop;
	
			Handler.prototype.inspect = toPendingState;
	
			Handler.prototype.join = function() { return this; };
	
			Handler.prototype.chain = function(to, f, r, u) {
				this.when(noop, noop, void 0, to, f, r, u);
			};
	
			Handler.prototype._env = environment.monitor || Promise;
			Handler.prototype._isMonitored = function() {
				return typeof this._env.promiseMonitor !== 'undefined';
			};
	
			Handler.prototype._createContext = function(fromContext) {
				var parent = fromContext || executionContext[executionContext.length - 1];
				this.context = { stack: void 0, parent: parent };
				this._env.promiseMonitor.captureStack(this.context, this.constructor);
			};
	
			Handler.prototype._enterContext = function() {
				executionContext.push(this.context);
			};
	
			Handler.prototype._exitContext = function() {
				executionContext.pop();
			};
	
			/**
			 * Handler that manages a queue of consumers waiting on a pending promise
			 * @private
			 * @constructor
			 */
			function DeferredHandler(receiver, inheritedContext) {
				this.consumers = [];
				this.receiver = receiver;
				this.handler = void 0;
				this.resolved = false;
				this.state = 0;
				if(this._isMonitored()) {
					this._createContext(inheritedContext);
				}
			}
	
			inherit(Handler, DeferredHandler);
	
			DeferredHandler.prototype.inspect = function() {
				return this.resolved ? this.join().inspect() : toPendingState();
			};
	
			DeferredHandler.prototype.resolve = function(x) {
				this._join(getHandler(x, this));
			};
	
			DeferredHandler.prototype.reject = function(x) {
				this._join(new RejectedHandler(x));
			};
	
			DeferredHandler.prototype.join = function() {
				if (this.resolved) {
					this.handler = this.handler.join();
					return this.handler;
				} else {
					return this;
				}
			};
	
			DeferredHandler.prototype.run = function() {
				var q = this.consumers;
				var handler = this.handler = this.handler.join();
				this.consumers = void 0;
	
				for (var i = 0; i < q.length; i+=7) {
					handler.when(q[i], q[i+1], q[i+2], q[i+3], q[i+4], q[i+5], q[i+6]);
				}
			};
	
			DeferredHandler.prototype._join = function(handler) {
				if(this.resolved) {
					return;
				}
	
				this.resolved = true;
				this.handler = handler;
				tasks.enqueue(this);
	
				if(this._isMonitored()) {
					handler._reportTrace(this.context);
					this.context = void 0;
				}
			};
	
			DeferredHandler.prototype.when = function(resolve, notify, t, receiver, f, r, u) {
				if(this._isMonitored()) { this.context = void 0; }
	
				if(this.resolved) {
					tasks.enqueue(new RunHandlerTask(resolve, notify, t, receiver, f, r, u, this.handler));
				} else {
					this.consumers.push(resolve, notify, t, receiver, f, r, u);
				}
			};
	
			DeferredHandler.prototype.notify = function(x) {
				if(!this.resolved) {
					tasks.enqueue(new ProgressTask(this.consumers, x));
				}
			};
	
			DeferredHandler.prototype._reportTrace = function(context) {
				this.resolved && this.handler.join()._reportTrace(context);
			};
	
			DeferredHandler.prototype._removeTrace = function() {
				this.resolved && this.handler.join()._removeTrace();
			};
	
			/**
			 * Abstract base for handler that delegates to another handler
			 * @private
			 * @param {object} handler
			 * @constructor
			 */
			function DelegateHandler(handler) {
				this.handler = handler;
				this.state = 0;
			}
	
			inherit(Handler, DelegateHandler);
	
			DelegateHandler.prototype.join = function() {
				return this.handler.join();
			};
	
			DelegateHandler.prototype.inspect = function() {
				return this.join().inspect();
			};
	
			DelegateHandler.prototype._reportTrace = function(context) {
				this.join()._reportTrace(context);
			};
	
			DelegateHandler.prototype._removeTrace = function() {
				this.join()._removeTrace();
			};
	
			/**
			 * Wrap another handler and force it into a future stack
			 * @private
			 * @param {object} handler
			 * @constructor
			 */
			function AsyncHandler(handler) {
				DelegateHandler.call(this, handler);
			}
	
			inherit(DelegateHandler, AsyncHandler);
	
			AsyncHandler.prototype.when = function(resolve, notify, t, receiver, f, r, u) {
				tasks.enqueue(new RunHandlerTask(resolve, notify, t, receiver, f, r, u, this.join()));
			};
	
			/**
			 * Handler that follows another handler, injecting a receiver
			 * @private
			 * @param {object} handler another handler to follow
			 * @param {object=undefined} receiver
			 * @constructor
			 */
			function BoundHandler(handler, receiver) {
				DelegateHandler.call(this, handler);
				this.receiver = receiver;
			}
	
			inherit(DelegateHandler, BoundHandler);
	
			BoundHandler.prototype.when = function(resolve, notify, t, receiver, f, r, u) {
				// Because handlers are allowed to be shared among promises,
				// each of which possibly having a different receiver, we have
				// to insert our own receiver into the chain if it has been set
				// so that callbacks (f, r, u) will be called using our receiver
				if(this.receiver !== void 0) {
					receiver = this.receiver;
				}
				this.join().when(resolve, notify, t, receiver, f, r, u);
			};
	
			/**
			 * Handler that wraps an untrusted thenable and assimilates it in a future stack
			 * @private
			 * @param {function} then
			 * @param {{then: function}} thenable
			 * @constructor
			 */
			function ThenableHandler(then, thenable) {
				DeferredHandler.call(this);
				this.assimilated = false;
				this.untrustedThen = then;
				this.thenable = thenable;
			}
	
			inherit(DeferredHandler, ThenableHandler);
	
			ThenableHandler.prototype.when = function(resolve, notify, t, receiver, f, r, u) {
				if(!this.assimilated) {
					this.assimilated = true;
					this._assimilate();
				}
				DeferredHandler.prototype.when.call(this, resolve, notify, t, receiver, f, r, u);
			};
	
			ThenableHandler.prototype._assimilate = function() {
				var h = this;
				this._try(this.untrustedThen, this.thenable, _resolve, _reject, _notify);
	
				function _resolve(x) { h.resolve(x); }
				function _reject(x)  { h.reject(x); }
				function _notify(x)  { h.notify(x); }
			};
	
			ThenableHandler.prototype._try = function(then, thenable, resolve, reject, notify) {
				try {
					then.call(thenable, resolve, reject, notify);
				} catch (e) {
					reject(e);
				}
			};
	
			/**
			 * Handler for a fulfilled promise
			 * @private
			 * @param {*} x fulfillment value
			 * @constructor
			 */
			function FulfilledHandler(x) {
				this.value = x;
				this.state = 1;
	
				if(this._isMonitored()) {
					this._createContext();
				}
			}
	
			inherit(Handler, FulfilledHandler);
	
			FulfilledHandler.prototype.inspect = function() {
				return { state: 'fulfilled', value: this.value };
			};
	
			FulfilledHandler.prototype.when = function(resolve, notify, t, receiver, f) {
				if(this._isMonitored()) { this._enterContext(); }
	
				var x = typeof f === 'function'
					? tryCatchReject(f, this.value, receiver)
					: this.value;
	
				if(this._isMonitored()) { this._exitContext(); }
	
				resolve.call(t, x);
			};
	
			/**
			 * Handler for a rejected promise
			 * @private
			 * @param {*} x rejection reason
			 * @constructor
			 */
			function RejectedHandler(x) {
				this.value = x;
				this.state = -1;
	
				if(this._isMonitored()) {
					this.id = errorId++;
					this._createContext();
					this._reportTrace();
				}
			}
	
			inherit(Handler, RejectedHandler);
	
			RejectedHandler.prototype.inspect = function() {
				return { state: 'rejected', reason: this.value };
			};
	
			RejectedHandler.prototype.when = function(resolve, notify, t, receiver, f, r) {
				if(this._isMonitored()) {
					this._removeTrace();
					this._enterContext();
				}
	
				var x = typeof r === 'function'
					? tryCatchReject(r, this.value, receiver)
					: promiseFromHandler(this);
	
				if(this._isMonitored()) { this._exitContext(); }
	
				resolve.call(t, x);
			};
	
			RejectedHandler.prototype._reportTrace = function(context) {
				this._env.promiseMonitor.addTrace(this, context);
			};
	
			RejectedHandler.prototype._removeTrace = function() {
				this._env.promiseMonitor.removeTrace(this);
			};
	
			RejectedHandler.prototype._fatal = function() {
				this._env.promiseMonitor.fatal(this);
			};
	
			// Execution context tracking for long stack traces
	
			var executionContext = [];
			var errorId = 0;
	
			// Errors and singletons
	
			var foreverPendingHandler = new Handler();
			var foreverPendingPromise = promiseFromHandler(foreverPendingHandler);
	
			function promiseCycleHandler() {
				return new RejectedHandler(new TypeError('Promise cycle'));
			}
	
			// Snapshot states
	
			/**
			 * Creates a pending state snapshot
			 * @private
			 * @returns {{state:'pending'}}
			 */
			function toPendingState() {
				return { state: 'pending' };
			}
	
			// Task runners
	
			/**
			 * Run a single consumer
			 * @private
			 * @constructor
			 */
			function RunHandlerTask(a, b, c, d, e, f, g, handler) {
				this.a=a;this.b=b;this.c=c;this.d=d;this.e=e;this.f=f;this.g=g;
				this.handler = handler;
			}
	
			RunHandlerTask.prototype.run = function() {
				this.handler.join().when(this.a,this.b,this.c,this.d,this.e,this.f,this.g);
			};
	
			/**
			 * Run a queue of progress handlers
			 * @private
			 * @constructor
			 */
			function ProgressTask(q, value) {
				this.q = q;
				this.value = value;
			}
	
			ProgressTask.prototype.run = function() {
				var q = this.q;
				// First progress handler is at index 1
				for (var i = 1; i < q.length; i+=7) {
					this._notify(q[i], q[i+1], q[i+2], q[i+5]);
				}
			};
	
			ProgressTask.prototype._notify = function(notify, t, receiver, u) {
				var x = typeof u === 'function'
					? tryCatchReturn(u, this.value, receiver)
					: this.value;
	
				notify.call(t, x);
			};
	
			// Other helpers
	
			/**
			 * @param {*} x
			 * @returns {boolean} false iff x is guaranteed not to be a thenable
			 */
			function maybeThenable(x) {
				return (typeof x === 'object' || typeof x === 'function') && x !== null;
			}
	
			/**
			 * Return f.call(thisArg, x), or if it throws return a rejected promise for
			 * the thrown exception
			 * @private
			 */
			function tryCatchReject(f, x, thisArg) {
				try {
					return f.call(thisArg, x);
				} catch(e) {
					return reject(e);
				}
			}
	
			/**
			 * Return f.call(thisArg, x), or if it throws, *return* the exception
			 * @private
			 */
			function tryCatchReturn(f, x, thisArg) {
				try {
					return f.call(thisArg, x);
				} catch(e) {
					return e;
				}
			}
	
			function inherit(Parent, Child) {
				Child.prototype = objectCreate(Parent.prototype);
				Child.prototype.constructor = Child;
			}
	
			function noop() {}
	
			return Promise;
		};
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(14)));


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */
	
	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {
	
		var Queue = __webpack_require__(19);
	
		// Credit to Twisol (https://github.com/Twisol) for suggesting
		// this type of extensible queue + trampoline approach for next-tick conflation.
	
		function Scheduler(enqueue) {
			this._enqueue = enqueue;
			this._handlerQueue = new Queue(15);
	
			var self = this;
			this.drainQueue = function() {
				self._drainQueue();
			};
		}
	
		/**
		 * Enqueue a task. If the queue is not currently scheduled to be
		 * drained, schedule it.
		 * @param {function} task
		 */
		Scheduler.prototype.enqueue = function(task) {
			if(this._handlerQueue.push(task) === 1) {
				this._enqueue(this.drainQueue);
			}
		};
	
		/**
		 * Drain the handler queue entirely, being careful to allow the
		 * queue to be extended while it is being processed, and to continue
		 * processing until it is truly empty.
		 */
		Scheduler.prototype._drainQueue = function() {
			var q = this._handlerQueue;
			while(q.length > 0) {
				q.shift().run();
			}
		};
	
		return Scheduler;
	
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(14)));


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;var require;/* WEBPACK VAR INJECTION */(function(process) {/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */
	
	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {
	
		// Sniff "best" async scheduling option
		// Prefer process.nextTick or MutationObserver, then check for
		// vertx and finally fall back to setTimeout
	
		/*jshint maxcomplexity:6*/
		/*global process,document,setTimeout,MutationObserver,WebKitMutationObserver*/
		var nextTick, MutationObs;
	
		if (typeof process !== 'undefined' && process !== null &&
			typeof process.nextTick === 'function') {
			nextTick = function(f) {
				process.nextTick(f);
			};
	
		} else if (MutationObs =
			(typeof MutationObserver === 'function' && MutationObserver) ||
			(typeof WebKitMutationObserver === 'function' && WebKitMutationObserver)) {
			nextTick = (function (document, MutationObserver) {
				var scheduled;
				var el = document.createElement('div');
				var o = new MutationObserver(run);
				o.observe(el, { attributes: true });
	
				function run() {
					var f = scheduled;
					scheduled = void 0;
					f();
				}
	
				return function (f) {
					scheduled = f;
					el.setAttribute('class', 'x');
				};
			}(document, MutationObs));
	
		} else {
			nextTick = (function(cjsRequire) {
				try {
					// vert.x 1.x || 2.x
					return __webpack_require__(!(function webpackMissingModule() { throw new Error("Cannot find module \"vertx\""); }())).runOnLoop || __webpack_require__(!(function webpackMissingModule() { throw new Error("Cannot find module \"vertx\""); }())).runOnContext;
				} catch (ignore) {}
	
				// capture setTimeout to avoid being caught by fake timers
				// used in time based tests
				var capturedSetTimeout = setTimeout;
				return function (t) {
					capturedSetTimeout(t, 0);
				};
			}(require));
		}
	
		return nextTick;
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(14)));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(20)))

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;var require;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */
	
	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {
		/*global setTimeout,clearTimeout*/
		var cjsRequire, vertx, setTimer, clearTimer;
	
		cjsRequire = require;
	
		try {
			vertx = __webpack_require__(!(function webpackMissingModule() { throw new Error("Cannot find module \"vertx\""); }()));
			setTimer = function (f, ms) { return vertx.setTimer(ms, f); };
			clearTimer = vertx.cancelTimer;
		} catch (e) {
			setTimer = function(f, ms) { return setTimeout(f, ms); };
			clearTimer = function(t) { return clearTimeout(t); };
		}
	
		return {
			set: setTimer,
			clear: clearTimer
		};
	
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(14)));


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */
	
	(function(define) { 'use strict';
	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
		/**
		 * Circular queue
		 * @param {number} capacityPow2 power of 2 to which this queue's capacity
		 *  will be set initially. eg when capacityPow2 == 3, queue capacity
		 *  will be 8.
		 * @constructor
		 */
		function Queue(capacityPow2) {
			this.head = this.tail = this.length = 0;
			this.buffer = new Array(1 << capacityPow2);
		}
	
		Queue.prototype.push = function(x) {
			if(this.length === this.buffer.length) {
				this._ensureCapacity(this.length * 2);
			}
	
			this.buffer[this.tail] = x;
			this.tail = (this.tail + 1) & (this.buffer.length - 1);
			++this.length;
			return this.length;
		};
	
		Queue.prototype.shift = function() {
			var x = this.buffer[this.head];
			this.buffer[this.head] = void 0;
			this.head = (this.head + 1) & (this.buffer.length - 1);
			--this.length;
			return x;
		};
	
		Queue.prototype._ensureCapacity = function(capacity) {
			var head = this.head;
			var buffer = this.buffer;
			var newBuffer = new Array(capacity);
			var i = 0;
			var len;
	
			if(head === 0) {
				len = this.length;
				for(; i<len; ++i) {
					newBuffer[i] = buffer[i];
				}
			} else {
				capacity = buffer.length;
				len = this.tail;
				for(; head<capacity; ++i, ++head) {
					newBuffer[i] = buffer[head];
				}
	
				for(head=0; head<len; ++i, ++head) {
					newBuffer[i] = buffer[head];
				}
			}
	
			this.buffer = newBuffer;
			this.head = 0;
			this.tail = this.length;
		};
	
		return Queue;
	
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}(__webpack_require__(14)));


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	// shim for using process in browser
	
	var process = module.exports = {};
	
	process.nextTick = (function () {
	    var canSetImmediate = typeof window !== 'undefined'
	    && window.setImmediate;
	    var canPost = typeof window !== 'undefined'
	    && window.postMessage && window.addEventListener
	    ;
	
	    if (canSetImmediate) {
	        return function (f) { return window.setImmediate(f) };
	    }
	
	    if (canPost) {
	        var queue = [];
	        window.addEventListener('message', function (ev) {
	            var source = ev.source;
	            if ((source === window || source === null) && ev.data === 'process-tick') {
	                ev.stopPropagation();
	                if (queue.length > 0) {
	                    var fn = queue.shift();
	                    fn();
	                }
	            }
	        }, true);
	
	        return function nextTick(fn) {
	            queue.push(fn);
	            window.postMessage('process-tick', '*');
	        };
	    }
	
	    return function nextTick(fn) {
	        setTimeout(fn, 0);
	    };
	})();
	
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	
	function noop() {}
	
	process.on = noop;
	process.once = noop;
	process.off = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	}
	
	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var Hub, promise, store, url;
	
	store = __webpack_require__(4);
	
	promise = __webpack_require__(5);
	
	url = 'https://goinstant.net/dashed/metacardboard';
	
	Hub = (function() {
	  function Hub() {
	    this.roomName = store.get('roomname') || 'lobby';
	    this._displayName = store.get('displayname');
	    this.connection = null;
	  }
	
	  Hub.prototype._userDefaults = function() {
	    var userdefaults;
	    userdefaults = {};
	    if (this.roomName) {
	      userdefaults.displayName = this.roomName;
	    }
	    return userdefaults;
	  };
	
	  Hub.prototype._room = function() {
	    return this.connection.room(this.roomName);
	  };
	
	  Hub.prototype._user = function() {
	    return this._room().self();
	  };
	
	  Hub.prototype.connect = function() {
	    return goinstant.connect(url, {
	      user: this._userDefaults()
	    }).then((function(_this) {
	      return function(result) {
	        var obj, room;
	        _this.connection = result.connection;
	        room = _this._room();
	        obj = {};
	        if (!room.joined()) {
	          return room.join(_this._userDefaults()).then(function(room, user) {
	            _this._displayName = user.displayName;
	            obj.room = room;
	            obj.displayName = user.displayName;
	            return obj;
	          });
	        }
	        return room.self().get().then(function(result) {
	          var user;
	          user = result.value;
	          _this._displayName = user.displayName;
	          obj.room = room;
	          obj.displayName = user.displayName;
	          return obj;
	        });
	      };
	    })(this));
	  };
	
	  Hub.prototype.displayName = function(_newName) {
	    if (!!!_newName) {
	      return this._displayName;
	    }
	    if (_newName.length <= 0) {
	      return null;
	    }
	    return this._user().key('/displayName').set(_newName).then(function(result) {
	      store.set('displayname', _newName);
	      return result.value;
	    });
	  };
	
	  Hub.prototype.users = function() {
	    return this._room().users.get().then(function(result) {
	      return console.log(result);
	    });
	  };
	
	  return Hub;
	
	})();
	
	module.exports = new Hub();


/***/ }
/******/ ])
/*
//@ sourceMappingURL=metacardboard.js.map
*/