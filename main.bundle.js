/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ScopedLspi = __webpack_require__(2);

	var LspiFlux = function () {
	  function LspiFlux() {
	    var initialState = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    var storeName = arguments.length <= 1 || arguments[1] === undefined ? 'lspi-flux' : arguments[1];

	    _classCallCheck(this, LspiFlux);

	    this.storeName = storeName;
	    this.lspi = new ScopedLspi();
	    this.setState(initialState);
	    this.mainStore = this.fetchState.state;
	  }

	  _createClass(LspiFlux, [{
	    key: "setState",
	    value: function setState(state) {
	      var init = this.lspi.setRecord(this.storeName, state);
	      if (init === undefined) {
	        this.mainStore = this.fetchState.state;
	        return { status: true, state: this.mainStore };
	      }
	      return { status: false, state: this.mainStore };
	    }
	  }, {
	    key: "whereState",
	    value: function whereState(key, equals) {
	      var whereMatch = this.lspi.where(this.storeName, key, equals);
	      if (whereMatch) return { status: true, match: whereMatch };
	      return { status: false, match: whereMatch };
	    }
	  }, {
	    key: "fetchState",
	    get: function get() {
	      var state = this.lspi.getRecord(this.storeName);
	      if (state) return { status: true, state: state };
	      return { status: false, state: this.mainStore };
	    }
	  }]);

	  return LspiFlux;
	}();

	module.exports = LspiFlux;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ScopedLspi = function () {
	  function ScopedLspi() {
	    _classCallCheck(this, ScopedLspi);
	  }

	  _createClass(ScopedLspi, [{
	    key: "setRecord",
	    value: function setRecord(recordName, data) {
	      try {
	        localStorage.setItem(recordName, JSON.stringify(data));
	      } catch (error) {
	        return false;
	      }
	    }
	  }, {
	    key: "setRecords",
	    value: function setRecords(args) {
	      var _this = this;

	      args.forEach(function (arg) {
	        return _this.setRecord(arg[0], arg[1]);
	      });
	    }
	  }, {
	    key: "setJSONRecord",
	    value: function setJSONRecord(recordName, string) {
	      try {
	        localStorage.setItem(recordName, string);
	      } catch (error) {
	        return false;
	      }
	    }
	  }, {
	    key: "getRecord",
	    value: function getRecord(recordName) {
	      try {
	        var obj = JSON.parse(localStorage.getItem(recordName));
	        return obj;
	      } catch (error) {
	        return false;
	      }
	    }
	  }, {
	    key: "getRecords",
	    value: function getRecords() {
	      var _this2 = this;

	      return Array.from(arguments).map(function (arg) {
	        return _this2.getRecord(arg);
	      });
	    }
	  }, {
	    key: "where",
	    value: function where(recordName, key, equals) {
	      var result = [];
	      var record = this.getRecord(recordName);

	      if (!record) return record;

	      record.forEach(function (obj) {
	        obj[key] === equals && result.push(obj);
	      });

	      if (!result[0]) return false;
	      return result;
	    }
	  }, {
	    key: "getJSONRecord",
	    value: function getJSONRecord(recordName) {
	      try {
	        var json = localStorage.getItem(recordName);
	        return json;
	      } catch (error) {
	        return false;
	      }
	    }
	  }, {
	    key: "whereEitherOr",
	    value: function whereEitherOr(recordName, keys, value) {
	      var result = [];
	      var record = this.getRecord(recordName);

	      if (!record) return false;

	      record.forEach(function (obj) {
	        obj[key[0]] === equals || obj[key[1]] === equals && result.push(obj);
	      });

	      if (!result[0]) return false;
	      return result;
	    }
	  }, {
	    key: "arrayWeakMatch",
	    value: function arrayWeakMatch(recordName, query) {
	      var result = [];
	      var record = this.getRecord(recordName);

	      if (!record) return false;

	      record.forEach(function (el) {
	        query.includes(el) && result.push(el);
	      });

	      if (!result[0]) return false;
	      return result;
	    }
	  }, {
	    key: "arrayStrongMatch",
	    value: function arrayStrongMatch(recordName, query) {
	      var result = [];
	      var record = this.getRecord(recordName);

	      record.forEach(function (el) {
	        query === el && result.push(el);
	      });

	      if (!result[0]) return false;
	      return result;
	    }
	  }, {
	    key: "deleteRecord",
	    value: function deleteRecord(recordName) {
	      localStorage.removeItem(recordName);
	    }
	  }, {
	    key: "deleteRecords",
	    value: function deleteRecords() {
	      var _this3 = this;

	      Array.from(arguments).forEach(function (arg) {
	        return _this3.deleteRecord(arg);
	      });
	    }
	  }, {
	    key: "dropAll",
	    value: function dropAll() {
	      localStorage.clear();
	    }
	  }]);

	  return ScopedLspi;
	}();

	module.exports = ScopedLspi;

/***/ }
/******/ ]);