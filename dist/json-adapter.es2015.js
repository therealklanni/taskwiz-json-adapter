import bug from 'debug';
import os from 'os';
import fs from 'fs';
import path from 'path';

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

export default Adapter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1hZGFwdGVyLmVzMjAxNS5qcyIsInNvdXJjZXMiOlsiLi4vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJ1ZyBmcm9tICdkZWJ1ZydcbmNvbnN0IGRlYnVnID0gYnVnKCd0YXNrd2l6Ompzb24tYWRhcHRlcicpXG5cbmltcG9ydCBvcyBmcm9tICdvcydcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbmNsYXNzIEFkYXB0ZXIge1xuICBjb25zdHJ1Y3RvciAob3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5wYXRoID0gb3B0aW9ucy5wYXRoIHx8IHBhdGguam9pbihvcy5ob21lZGlyKCksICcudGFza3dpeicsICd0YXNrcy5qc29uJylcblxuICAgIGRlYnVnKCdDb25zdHJ1Y3RvcicsIHRoaXMpXG4gIH1cblxuICBmaW5kT3JDcmVhdGVQYXRoICgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICBmcy5zdGF0KHRoaXMucGF0aCwgKGVyciwgc3RhdHMpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIC8vIFRhc2sgZmlsZSBkb2VzIG5vdCBleGlzdFxuICAgICAgICAgIGRlYnVnKGBVbmFibGUgdG8gc3RhdCAke3RoaXMucGF0aH1gLCBlcnIubWVzc2FnZSlcbiAgICAgICAgICBjb25zdCBkaXJuYW1lID0gcGF0aC5kaXJuYW1lKHRoaXMucGF0aClcblxuICAgICAgICAgIC8vIENoZWNrIGlmIGNvbnRhaW5pbmcgZGlyZWN0b3J5IGV4aXN0c1xuICAgICAgICAgIGZzLnN0YXQoZGlybmFtZSwgKGVyciwgc3RhdHMpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgLy8gQ29udGFpbmluZyBkaXJlY3RvcnkgZG9lcyBub3QgZXhpc3RcbiAgICAgICAgICAgICAgZGVidWcoYFVuYWJsZSB0byBzdGF0ICR7ZGlybmFtZX1gLCBlcnIubWVzc2FnZSlcblxuICAgICAgICAgICAgICAvLyBBdHRlbXB0IHRvIGNyZWF0ZSB0aGUgZGlyZWN0b3J5XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZnMubWtkaXJTeW5jKGRpcm5hbWUsIDBvNzU1KVxuICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgZGVidWcoYFVuYWJsZSB0byBjcmVhdGUgJHtkaXJuYW1lfWAsIGUubWVzc2FnZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVqKGUpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ3JlYXRlIFRhc2sgZmlsZVxuICAgICAgICAgICAgZnMud3JpdGVGaWxlKHRoaXMucGF0aCwgJ1tdJywge1xuICAgICAgICAgICAgICBmbGFnOiAndycsXG4gICAgICAgICAgICAgIG1vZGU6IDBvNjQ0XG4gICAgICAgICAgICB9LCBlcnIgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgZGVidWcoYFVuYWJsZSB0byBvcGVuICR7dGhpcy5wYXRofSBmb3Igd3JpdGluZ2AsIGVyci5tZXNzYWdlKVxuICAgICAgICAgICAgICAgIHJldHVybiByZWooZXJyKVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgZGVidWcoYENyZWF0ZWQgbmV3IHRhc2sgZmlsZTogJHt0aGlzLnBhdGh9YClcbiAgICAgICAgICAgICAgcmV0dXJuIHJlcyh0aGlzLnBhdGgpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVidWcoYCR7dGhpcy5wYXRofSBzdGF0c2AsIHN0YXRzKVxuICAgICAgICAgIHJldHVybiByZXModGhpcy5wYXRoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBjcmVhdGUgKHRhc2spIHtcbiAgICBkZWJ1ZygnQ3JlYXRlJywgdGFzaylcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKSlcbiAgfVxuXG4gIHJlYWQgKHV1aWQpIHtcbiAgICBkZWJ1ZyhgUmVhZCAke3V1aWR9YClcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKGBOb3QgZm91bmQ6ICR7dXVpZH1gKSlcbiAgfVxuXG4gIHVwZGF0ZSAodGFzaykge1xuICAgIGRlYnVnKGBVcGRhdGUgJHt0YXNrLnV1aWR9YClcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKSlcbiAgfVxuXG4gIGRlbGV0ZSAodXVpZCkge1xuICAgIGRlYnVnKGBEZWxldGUgJHt1dWlkfWApXG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkJykpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWRhcHRlclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLElBQU0sUUFBUSxJQUFJLHNCQUFKLENBQVI7O0FBRU4sSUFJTTtXQUFBLE9BQ0osR0FBMkI7UUFBZCxnRUFBVSxrQkFBSTtzQ0FEdkIsU0FDdUI7O1NBQ3BCLElBQUwsR0FBWSxRQUFRLElBQVIsSUFBZ0IsS0FBSyxJQUFMLENBQVUsR0FBRyxPQUFILEVBQVYsRUFBd0IsVUFBeEIsRUFBb0MsWUFBcEMsQ0FBaEIsQ0FEYTs7VUFHbkIsYUFBTixFQUFxQixJQUFyQixFQUh5QjtHQUEzQjs7MkJBREk7O3VDQU9nQjs7O2FBQ1gsSUFBSSxPQUFKLENBQVksVUFBQyxHQUFELEVBQU0sR0FBTixFQUFjO1dBQzVCLElBQUgsQ0FBUSxNQUFLLElBQUwsRUFBVyxVQUFDLEdBQUQsRUFBTSxLQUFOLEVBQWdCO2NBQzdCLEdBQUosRUFBUzs7O3dDQUVpQixNQUFLLElBQUwsRUFBYSxJQUFJLE9BQUosQ0FBckM7a0JBQ00sVUFBVSxLQUFLLE9BQUwsQ0FBYSxNQUFLLElBQUwsQ0FBdkI7OztpQkFHSCxJQUFILENBQVEsT0FBUixFQUFpQixVQUFDLEdBQUQsRUFBTSxLQUFOLEVBQWdCO29CQUMzQixHQUFKLEVBQVM7OzRDQUVpQixPQUF4QixFQUFtQyxJQUFJLE9BQUosQ0FBbkM7OztzQkFHSTt1QkFDQyxTQUFILENBQWEsT0FBYixFQUFzQixHQUF0QixFQURFO21CQUFKLENBRUUsT0FBTyxDQUFQLEVBQVU7Z0RBQ2dCLE9BQTFCLEVBQXFDLEVBQUUsT0FBRixDQUFyQyxDQURVOzJCQUVILElBQUksQ0FBSixDQUFQLENBRlU7bUJBQVY7aUJBUEo7OztrQkFjQSxDQUFHLFNBQUgsQ0FBYSxNQUFLLElBQUwsRUFBVyxJQUF4QixFQUE4Qjt3QkFDdEIsR0FBTjt3QkFDTSxHQUFOO2lCQUZGLEVBR0csZUFBTztzQkFDSixHQUFKLEVBQVM7OENBQ2lCLE1BQUssSUFBTCxpQkFBeEIsRUFBaUQsSUFBSSxPQUFKLENBQWpELENBRE87MkJBRUEsSUFBSSxHQUFKLENBQVAsQ0FGTzttQkFBVDs7b0RBS2dDLE1BQUssSUFBTCxDQUFoQyxDQU5RO3lCQU9ELElBQUksTUFBSyxJQUFMLENBQVgsQ0FQUTtpQkFBUCxDQUhILENBZitCO2VBQWhCLENBQWpCO2lCQU5PO1dBQVQsTUFrQ087a0JBQ0ksTUFBSyxJQUFMLFdBQVQsRUFBNEIsS0FBNUIsRUFESzttQkFFRSxJQUFJLE1BQUssSUFBTCxDQUFYLENBRks7V0FsQ1A7U0FEaUIsQ0FBbkIsQ0FEK0I7T0FBZCxDQUFuQixDQURrQjs7OzsyQkE2Q1osTUFBTTtZQUNOLFFBQU4sRUFBZ0IsSUFBaEIsRUFEWTthQUVMLFFBQVEsTUFBUixDQUFlLElBQUksS0FBSixDQUFVLGlCQUFWLENBQWYsQ0FBUCxDQUZZOzs7O3lCQUtSLE1BQU07c0JBQ0ksSUFBZCxFQURVO2FBRUgsUUFBUSxNQUFSLENBQWUsSUFBSSxLQUFKLGlCQUF3QixJQUF4QixDQUFmLENBQVAsQ0FGVTs7OzsyQkFLSixNQUFNO3dCQUNJLEtBQUssSUFBTCxDQUFoQixDQURZO2FBRUwsUUFBUSxNQUFSLENBQWUsSUFBSSxLQUFKLENBQVUsaUJBQVYsQ0FBZixDQUFQLENBRlk7Ozs7NEJBS04sTUFBTTt3QkFDSSxJQUFoQixFQURZO2FBRUwsUUFBUSxNQUFSLENBQWUsSUFBSSxLQUFKLENBQVUsaUJBQVYsQ0FBZixDQUFQLENBRlk7OztTQW5FVjs7OyJ9