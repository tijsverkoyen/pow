// Generated by CoffeeScript 1.6.2
(function() {
  var Log, Logger, dirname, fs, level, mkdirp, _fn, _i, _len, _ref,
    __slice = [].slice;

  fs = require("fs");

  dirname = require("path").dirname;

  Log = require("log");

  mkdirp = require("./util").mkdirp;

  module.exports = Logger = (function() {
    Logger.LEVELS = ["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"];

    function Logger(path, level) {
      this.path = path;
      this.level = level != null ? level : "debug";
      this.readyCallbacks = [];
    }

    Logger.prototype.ready = function(callback) {
      var _this = this;

      if (this.state === "ready") {
        return callback.call(this);
      } else {
        this.readyCallbacks.push(callback);
        if (!this.state) {
          this.state = "initializing";
          return mkdirp(dirname(this.path), function(err) {
            if (err) {
              return _this.state = null;
            } else {
              _this.stream = fs.createWriteStream(_this.path, {
                flags: "a"
              });
              return _this.stream.on("open", function() {
                var _i, _len, _ref;

                _this.log = new Log(_this.level, _this.stream);
                _this.state = "ready";
                _ref = _this.readyCallbacks;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  callback = _ref[_i];
                  callback.call(_this);
                }
                return _this.readyCallbacks = [];
              });
            }
          });
        }
      }
    };

    return Logger;

  })();

  _ref = Logger.LEVELS;
  _fn = function(level) {
    return Logger.prototype[level] = function() {
      var args;

      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.ready(function() {
        return this.log[level].apply(this.log, args);
      });
    };
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    level = _ref[_i];
    _fn(level);
  }

}).call(this);
