'use strict';

function _interopDefault (ex) { return 'default' in ex ? ex['default'] : ex; }

var bug = _interopDefault(require('debug'));
var os = _interopDefault(require('os'));
var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));

var babelHelpers = {};

babelHelpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

babelHelpers.createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

babelHelpers;

var debug = bug('taskwiz:json-adapter');

var Adapter = function () {
  function Adapter() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    babelHelpers.classCallCheck(this, Adapter);

    this.path = options.path || path.join(os.homedir(), '.taskwiz', 'tasks.json');

    debug('Constructor', this);
  }

  babelHelpers.createClass(Adapter, [{
    key: 'findOrCreatePath',
    value: function findOrCreatePath() {
      var _this = this;

      return new Promise(function (res, rej) {
        fs.stat(_this.path, function (err, stats) {
          if (err) {
            (function () {
              // Task file does not exist
              debug('Unable to stat ' + _this.path, err.message);
              var dirname = path.dirname(_this.path);

              // Check if containing directory exists
              fs.stat(dirname, function (err, stats) {
                if (err) {
                  // Containing directory does not exist
                  debug('Unable to stat ' + dirname, err.message);

                  // Attempt to create the directory
                  try {
                    fs.mkdirSync(dirname, 493);
                  } catch (e) {
                    debug('Unable to create ' + dirname, e.message);
                    return rej(e);
                  }
                }

                // Create Task file
                fs.writeFile(_this.path, '[]', {
                  flag: 'w',
                  mode: 420
                }, function (err) {
                  if (err) {
                    debug('Unable to open ' + _this.path + ' for writing', err.message);
                    return rej(err);
                  }

                  debug('Created new task file: ' + _this.path);
                  return res(_this.path);
                });
              });
            })();
          } else {
            debug(_this.path + ' stats', stats);
            return res(_this.path);
          }
        });
      });
    }
  }, {
    key: 'create',
    value: function create(task) {
      debug('Create', task);
      return Promise.reject(new Error('Not implemented'));
    }
  }, {
    key: 'read',
    value: function read(uuid) {
      debug('Read ' + uuid);
      return Promise.reject(new Error('Not found: ' + uuid));
    }
  }, {
    key: 'update',
    value: function update(task) {
      debug('Update ' + task.uuid);
      return Promise.reject(new Error('Not implemented'));
    }
  }, {
    key: 'delete',
    value: function _delete(uuid) {
      debug('Delete ' + uuid);
      return Promise.reject(new Error('Not implemented'));
    }
  }]);
  return Adapter;
}();

module.exports = Adapter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1hZGFwdGVyLmpzIiwic291cmNlcyI6WyIuLi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYnVnIGZyb20gJ2RlYnVnJ1xuY29uc3QgZGVidWcgPSBidWcoJ3Rhc2t3aXo6anNvbi1hZGFwdGVyJylcblxuaW1wb3J0IG9zIGZyb20gJ29zJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuY2xhc3MgQWRhcHRlciB7XG4gIGNvbnN0cnVjdG9yIChvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLnBhdGggPSBvcHRpb25zLnBhdGggfHwgcGF0aC5qb2luKG9zLmhvbWVkaXIoKSwgJy50YXNrd2l6JywgJ3Rhc2tzLmpzb24nKVxuXG4gICAgZGVidWcoJ0NvbnN0cnVjdG9yJywgdGhpcylcbiAgfVxuXG4gIGZpbmRPckNyZWF0ZVBhdGggKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcbiAgICAgIGZzLnN0YXQodGhpcy5wYXRoLCAoZXJyLCBzdGF0cykgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgLy8gVGFzayBmaWxlIGRvZXMgbm90IGV4aXN0XG4gICAgICAgICAgZGVidWcoYFVuYWJsZSB0byBzdGF0ICR7dGhpcy5wYXRofWAsIGVyci5tZXNzYWdlKVxuICAgICAgICAgIGNvbnN0IGRpcm5hbWUgPSBwYXRoLmRpcm5hbWUodGhpcy5wYXRoKVxuXG4gICAgICAgICAgLy8gQ2hlY2sgaWYgY29udGFpbmluZyBkaXJlY3RvcnkgZXhpc3RzXG4gICAgICAgICAgZnMuc3RhdChkaXJuYW1lLCAoZXJyLCBzdGF0cykgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAvLyBDb250YWluaW5nIGRpcmVjdG9yeSBkb2VzIG5vdCBleGlzdFxuICAgICAgICAgICAgICBkZWJ1ZyhgVW5hYmxlIHRvIHN0YXQgJHtkaXJuYW1lfWAsIGVyci5tZXNzYWdlKVxuXG4gICAgICAgICAgICAgIC8vIEF0dGVtcHQgdG8gY3JlYXRlIHRoZSBkaXJlY3RvcnlcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBmcy5ta2RpclN5bmMoZGlybmFtZSwgMG83NTUpXG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBkZWJ1ZyhgVW5hYmxlIHRvIGNyZWF0ZSAke2Rpcm5hbWV9YCwgZS5tZXNzYWdlKVxuICAgICAgICAgICAgICAgIHJldHVybiByZWooZSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDcmVhdGUgVGFzayBmaWxlXG4gICAgICAgICAgICBmcy53cml0ZUZpbGUodGhpcy5wYXRoLCAnW10nLCB7XG4gICAgICAgICAgICAgIGZsYWc6ICd3JyxcbiAgICAgICAgICAgICAgbW9kZTogMG82NDRcbiAgICAgICAgICAgIH0sIGVyciA9PiB7XG4gICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBkZWJ1ZyhgVW5hYmxlIHRvIG9wZW4gJHt0aGlzLnBhdGh9IGZvciB3cml0aW5nYCwgZXJyLm1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlaihlcnIpXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBkZWJ1ZyhgQ3JlYXRlZCBuZXcgdGFzayBmaWxlOiAke3RoaXMucGF0aH1gKVxuICAgICAgICAgICAgICByZXR1cm4gcmVzKHRoaXMucGF0aClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWJ1ZyhgJHt0aGlzLnBhdGh9IHN0YXRzYCwgc3RhdHMpXG4gICAgICAgICAgcmV0dXJuIHJlcyh0aGlzLnBhdGgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGNyZWF0ZSAodGFzaykge1xuICAgIGRlYnVnKCdDcmVhdGUnLCB0YXNrKVxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCcpKVxuICB9XG5cbiAgcmVhZCAodXVpZCkge1xuICAgIGRlYnVnKGBSZWFkICR7dXVpZH1gKVxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoYE5vdCBmb3VuZDogJHt1dWlkfWApKVxuICB9XG5cbiAgdXBkYXRlICh0YXNrKSB7XG4gICAgZGVidWcoYFVwZGF0ZSAke3Rhc2sudXVpZH1gKVxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCcpKVxuICB9XG5cbiAgZGVsZXRlICh1dWlkKSB7XG4gICAgZGVidWcoYERlbGV0ZSAke3V1aWR9YClcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBZGFwdGVyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLElBQU0sUUFBUSxJQUFJLHNCQUFKLENBQVI7O0FBRU4sSUFJTTtXQUFBLE9BQ0osR0FBMkI7UUFBZCxnRUFBVSxrQkFBSTtzQ0FEdkIsU0FDdUI7O1NBQ3BCLElBQUwsR0FBWSxRQUFRLElBQVIsSUFBZ0IsS0FBSyxJQUFMLENBQVUsR0FBRyxPQUFILEVBQVYsRUFBd0IsVUFBeEIsRUFBb0MsWUFBcEMsQ0FBaEIsQ0FEYTs7VUFHbkIsYUFBTixFQUFxQixJQUFyQixFQUh5QjtHQUEzQjs7MkJBREk7O3VDQU9nQjs7O2FBQ1gsSUFBSSxPQUFKLENBQVksVUFBQyxHQUFELEVBQU0sR0FBTixFQUFjO1dBQzVCLElBQUgsQ0FBUSxNQUFLLElBQUwsRUFBVyxVQUFDLEdBQUQsRUFBTSxLQUFOLEVBQWdCO2NBQzdCLEdBQUosRUFBUzs7O3dDQUVpQixNQUFLLElBQUwsRUFBYSxJQUFJLE9BQUosQ0FBckM7a0JBQ00sVUFBVSxLQUFLLE9BQUwsQ0FBYSxNQUFLLElBQUwsQ0FBdkI7OztpQkFHSCxJQUFILENBQVEsT0FBUixFQUFpQixVQUFDLEdBQUQsRUFBTSxLQUFOLEVBQWdCO29CQUMzQixHQUFKLEVBQVM7OzRDQUVpQixPQUF4QixFQUFtQyxJQUFJLE9BQUosQ0FBbkM7OztzQkFHSTt1QkFDQyxTQUFILENBQWEsT0FBYixFQUFzQixHQUF0QixFQURFO21CQUFKLENBRUUsT0FBTyxDQUFQLEVBQVU7Z0RBQ2dCLE9BQTFCLEVBQXFDLEVBQUUsT0FBRixDQUFyQyxDQURVOzJCQUVILElBQUksQ0FBSixDQUFQLENBRlU7bUJBQVY7aUJBUEo7OztrQkFjQSxDQUFHLFNBQUgsQ0FBYSxNQUFLLElBQUwsRUFBVyxJQUF4QixFQUE4Qjt3QkFDdEIsR0FBTjt3QkFDTSxHQUFOO2lCQUZGLEVBR0csZUFBTztzQkFDSixHQUFKLEVBQVM7OENBQ2lCLE1BQUssSUFBTCxpQkFBeEIsRUFBaUQsSUFBSSxPQUFKLENBQWpELENBRE87MkJBRUEsSUFBSSxHQUFKLENBQVAsQ0FGTzttQkFBVDs7b0RBS2dDLE1BQUssSUFBTCxDQUFoQyxDQU5RO3lCQU9ELElBQUksTUFBSyxJQUFMLENBQVgsQ0FQUTtpQkFBUCxDQUhILENBZitCO2VBQWhCLENBQWpCO2lCQU5PO1dBQVQsTUFrQ087a0JBQ0ksTUFBSyxJQUFMLFdBQVQsRUFBNEIsS0FBNUIsRUFESzttQkFFRSxJQUFJLE1BQUssSUFBTCxDQUFYLENBRks7V0FsQ1A7U0FEaUIsQ0FBbkIsQ0FEK0I7T0FBZCxDQUFuQixDQURrQjs7OzsyQkE2Q1osTUFBTTtZQUNOLFFBQU4sRUFBZ0IsSUFBaEIsRUFEWTthQUVMLFFBQVEsTUFBUixDQUFlLElBQUksS0FBSixDQUFVLGlCQUFWLENBQWYsQ0FBUCxDQUZZOzs7O3lCQUtSLE1BQU07c0JBQ0ksSUFBZCxFQURVO2FBRUgsUUFBUSxNQUFSLENBQWUsSUFBSSxLQUFKLGlCQUF3QixJQUF4QixDQUFmLENBQVAsQ0FGVTs7OzsyQkFLSixNQUFNO3dCQUNJLEtBQUssSUFBTCxDQUFoQixDQURZO2FBRUwsUUFBUSxNQUFSLENBQWUsSUFBSSxLQUFKLENBQVUsaUJBQVYsQ0FBZixDQUFQLENBRlk7Ozs7NEJBS04sTUFBTTt3QkFDSSxJQUFoQixFQURZO2FBRUwsUUFBUSxNQUFSLENBQWUsSUFBSSxLQUFKLENBQVUsaUJBQVYsQ0FBZixDQUFQLENBRlk7OztTQW5FVjs7OyJ9