'use strict';

function _interopDefault (ex) { return 'default' in ex ? ex['default'] : ex; }

var bug = _interopDefault(require('debug'));
var os = _interopDefault(require('os'));
var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var readline = require('readline');
var tempfile = _interopDefault(require('tempfile'));
var _ = _interopDefault(require('highland'));

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

var fromJSON = function fromJSON(x) {
  return JSON.parse(x);
};
var toBuffer = function toBuffer(x) {
  return new Buffer(JSON.stringify(x) + '\n');
};

var createLineReaderStream = function createLineReaderStream(file) {
  var stream = _();

  readline.createInterface({ input: fs.createReadStream(file) }).on('line', function (line) {
    return stream.write(line);
  }).on('close', function () {
    return stream.end();
  });

  return stream;
};

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
                fs.writeFile(_this.path, '', { mode: 420 }, function (err) {
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
      var _this2 = this;

      debug('Create', task);
      return new Promise(function (res, rej) {
        _this2.findOrCreatePath().then(function (taskFile) {
          var temp = tempfile();
          debug('tempfile: ' + temp);

          fs.createReadStream(taskFile).pipe(fs.createWriteStream(temp));

          createLineReaderStream(taskFile).map(fromJSON).findWhere({ uuid: task.uuid }).toArray(function (a) {
            debug('toArray', a);

            if (a.length) {
              debug(task.uuid + ' exists');
              rej(new Error('Duplicate uuid'));
              fs.unlink(temp);
            } else {
              debug(task.uuid + ' not found, writing to file');
              var output = fs.createWriteStream(taskFile, { mode: 420 }).on('finish', function () {
                debug('Updated ' + taskFile + ' written');
                res(task);
                fs.unlink(temp);
              });

              createLineReaderStream(temp).map(fromJSON).append(task).map(toBuffer).pipe(output);
            }
          });
        });
      });
    }
  }, {
    key: 'read',
    value: function read(uuid) {
      var _this3 = this;

      debug('Read ' + uuid);
      return new Promise(function (res, rej) {
        _this3.findOrCreatePath().then(function (taskFile) {
          createLineReaderStream(taskFile).map(fromJSON).findWhere({ uuid: uuid }).toArray(function (a) {
            return a.length ? res(a[0]) : rej(new Error('Not found: ' + uuid));
          });
        });
      });
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

var index = (function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new (Function.prototype.bind.apply(Adapter, [null].concat(args)))();
})

module.exports = index;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1hZGFwdGVyLmpzIiwic291cmNlcyI6WyIuLi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYnVnIGZyb20gJ2RlYnVnJ1xuY29uc3QgZGVidWcgPSBidWcoJ3Rhc2t3aXo6anNvbi1hZGFwdGVyJylcblxuaW1wb3J0IG9zIGZyb20gJ29zJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IGNyZWF0ZUludGVyZmFjZSB9IGZyb20gJ3JlYWRsaW5lJ1xuaW1wb3J0IHRlbXBmaWxlIGZyb20gJ3RlbXBmaWxlJ1xuaW1wb3J0IF8gZnJvbSAnaGlnaGxhbmQnXG5cbmNvbnN0IGZyb21KU09OID0geCA9PiBKU09OLnBhcnNlKHgpXG5jb25zdCB0b0J1ZmZlciA9IHggPT4gbmV3IEJ1ZmZlcihgJHtKU09OLnN0cmluZ2lmeSh4KX1cXG5gKVxuXG5jb25zdCBjcmVhdGVMaW5lUmVhZGVyU3RyZWFtID0gZmlsZSA9PiB7XG4gIGNvbnN0IHN0cmVhbSA9IF8oKVxuXG4gIGNyZWF0ZUludGVyZmFjZSh7IGlucHV0OiBmcy5jcmVhdGVSZWFkU3RyZWFtKGZpbGUpIH0pXG4gICAgLm9uKCdsaW5lJywgbGluZSA9PiBzdHJlYW0ud3JpdGUobGluZSkpXG4gICAgLm9uKCdjbG9zZScsICgpID0+IHN0cmVhbS5lbmQoKSlcblxuICByZXR1cm4gc3RyZWFtXG59XG5cbmNsYXNzIEFkYXB0ZXIge1xuICBjb25zdHJ1Y3RvciAob3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5wYXRoID0gb3B0aW9ucy5wYXRoIHx8IHBhdGguam9pbihvcy5ob21lZGlyKCksICcudGFza3dpeicsICd0YXNrcy5qc29uJylcblxuICAgIGRlYnVnKCdDb25zdHJ1Y3RvcicsIHRoaXMpXG4gIH1cblxuICBmaW5kT3JDcmVhdGVQYXRoICgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICBmcy5zdGF0KHRoaXMucGF0aCwgKGVyciwgc3RhdHMpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIC8vIFRhc2sgZmlsZSBkb2VzIG5vdCBleGlzdFxuICAgICAgICAgIGRlYnVnKGBVbmFibGUgdG8gc3RhdCAke3RoaXMucGF0aH1gLCBlcnIubWVzc2FnZSlcbiAgICAgICAgICBjb25zdCBkaXJuYW1lID0gcGF0aC5kaXJuYW1lKHRoaXMucGF0aClcblxuICAgICAgICAgIC8vIENoZWNrIGlmIGNvbnRhaW5pbmcgZGlyZWN0b3J5IGV4aXN0c1xuICAgICAgICAgIGZzLnN0YXQoZGlybmFtZSwgKGVyciwgc3RhdHMpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgLy8gQ29udGFpbmluZyBkaXJlY3RvcnkgZG9lcyBub3QgZXhpc3RcbiAgICAgICAgICAgICAgZGVidWcoYFVuYWJsZSB0byBzdGF0ICR7ZGlybmFtZX1gLCBlcnIubWVzc2FnZSlcblxuICAgICAgICAgICAgICAvLyBBdHRlbXB0IHRvIGNyZWF0ZSB0aGUgZGlyZWN0b3J5XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZnMubWtkaXJTeW5jKGRpcm5hbWUsIDBvNzU1KVxuICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgZGVidWcoYFVuYWJsZSB0byBjcmVhdGUgJHtkaXJuYW1lfWAsIGUubWVzc2FnZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVqKGUpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ3JlYXRlIFRhc2sgZmlsZVxuICAgICAgICAgICAgZnMud3JpdGVGaWxlKHRoaXMucGF0aCwgJycsIHsgbW9kZTogMG82NDQgfSwgZXJyID0+IHtcbiAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGRlYnVnKGBVbmFibGUgdG8gb3BlbiAke3RoaXMucGF0aH0gZm9yIHdyaXRpbmdgLCBlcnIubWVzc2FnZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVqKGVycilcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGRlYnVnKGBDcmVhdGVkIG5ldyB0YXNrIGZpbGU6ICR7dGhpcy5wYXRofWApXG4gICAgICAgICAgICAgIHJldHVybiByZXModGhpcy5wYXRoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlYnVnKGAke3RoaXMucGF0aH0gc3RhdHNgLCBzdGF0cylcbiAgICAgICAgICByZXR1cm4gcmVzKHRoaXMucGF0aClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgY3JlYXRlICh0YXNrKSB7XG4gICAgZGVidWcoJ0NyZWF0ZScsIHRhc2spXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgdGhpcy5maW5kT3JDcmVhdGVQYXRoKCkudGhlbih0YXNrRmlsZSA9PiB7XG4gICAgICAgIGNvbnN0IHRlbXAgPSB0ZW1wZmlsZSgpXG4gICAgICAgIGRlYnVnKGB0ZW1wZmlsZTogJHt0ZW1wfWApXG5cbiAgICAgICAgZnMuY3JlYXRlUmVhZFN0cmVhbSh0YXNrRmlsZSkucGlwZShmcy5jcmVhdGVXcml0ZVN0cmVhbSh0ZW1wKSlcblxuICAgICAgICBjcmVhdGVMaW5lUmVhZGVyU3RyZWFtKHRhc2tGaWxlKVxuICAgICAgICAgIC5tYXAoZnJvbUpTT04pXG4gICAgICAgICAgLmZpbmRXaGVyZSh7IHV1aWQ6IHRhc2sudXVpZCB9KVxuICAgICAgICAgIC50b0FycmF5KGEgPT4ge1xuICAgICAgICAgICAgZGVidWcoJ3RvQXJyYXknLCBhKVxuXG4gICAgICAgICAgICBpZiAoYS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgZGVidWcoYCR7dGFzay51dWlkfSBleGlzdHNgKVxuICAgICAgICAgICAgICByZWoobmV3IEVycm9yKCdEdXBsaWNhdGUgdXVpZCcpKVxuICAgICAgICAgICAgICBmcy51bmxpbmsodGVtcClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGRlYnVnKGAke3Rhc2sudXVpZH0gbm90IGZvdW5kLCB3cml0aW5nIHRvIGZpbGVgKVxuICAgICAgICAgICAgICBjb25zdCBvdXRwdXQgPSBmcy5jcmVhdGVXcml0ZVN0cmVhbSh0YXNrRmlsZSwgeyBtb2RlOiAwbzY0NCB9KVxuICAgICAgICAgICAgICAgIC5vbignZmluaXNoJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgZGVidWcoYFVwZGF0ZWQgJHt0YXNrRmlsZX0gd3JpdHRlbmApXG4gICAgICAgICAgICAgICAgICByZXModGFzaylcbiAgICAgICAgICAgICAgICAgIGZzLnVubGluayh0ZW1wKVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgY3JlYXRlTGluZVJlYWRlclN0cmVhbSh0ZW1wKVxuICAgICAgICAgICAgICAgIC5tYXAoZnJvbUpTT04pXG4gICAgICAgICAgICAgICAgLmFwcGVuZCh0YXNrKVxuICAgICAgICAgICAgICAgIC5tYXAodG9CdWZmZXIpXG4gICAgICAgICAgICAgICAgLnBpcGUob3V0cHV0KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICByZWFkICh1dWlkKSB7XG4gICAgZGVidWcoYFJlYWQgJHt1dWlkfWApXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgdGhpcy5maW5kT3JDcmVhdGVQYXRoKCkudGhlbih0YXNrRmlsZSA9PiB7XG4gICAgICAgIGNyZWF0ZUxpbmVSZWFkZXJTdHJlYW0odGFza0ZpbGUpXG4gICAgICAgICAgLm1hcChmcm9tSlNPTilcbiAgICAgICAgICAuZmluZFdoZXJlKHsgdXVpZCB9KVxuICAgICAgICAgIC50b0FycmF5KGEgPT5cbiAgICAgICAgICAgIGEubGVuZ3RoID8gcmVzKGFbMF0pIDogcmVqKG5ldyBFcnJvcihgTm90IGZvdW5kOiAke3V1aWR9YCkpKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgdXBkYXRlICh0YXNrKSB7XG4gICAgZGVidWcoYFVwZGF0ZSAke3Rhc2sudXVpZH1gKVxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCcpKVxuICB9XG5cbiAgZGVsZXRlICh1dWlkKSB7XG4gICAgZGVidWcoYERlbGV0ZSAke3V1aWR9YClcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCAoLi4uYXJncykgPT4gbmV3IEFkYXB0ZXIoLi4uYXJncylcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBTSxRQUFRLElBQUksc0JBQUosQ0FBUjs7QUFFTixBQU9BLElBQU0sV0FBVyxTQUFYLFFBQVc7U0FBSyxLQUFLLEtBQUwsQ0FBVyxDQUFYO0NBQUw7QUFDakIsSUFBTSxXQUFXLFNBQVgsUUFBVztTQUFLLElBQUksTUFBSixDQUFjLEtBQUssU0FBTCxDQUFlLENBQWYsUUFBZDtDQUFMOztBQUVqQixJQUFNLHlCQUF5QixTQUF6QixzQkFBeUIsT0FBUTtNQUMvQixTQUFTLEdBQVQsQ0FEK0I7OzJCQUdyQixFQUFFLE9BQU8sR0FBRyxnQkFBSCxDQUFvQixJQUFwQixDQUFQLEVBQWxCLEVBQ0csRUFESCxDQUNNLE1BRE4sRUFDYztXQUFRLE9BQU8sS0FBUCxDQUFhLElBQWI7R0FBUixDQURkLENBRUcsRUFGSCxDQUVNLE9BRk4sRUFFZTtXQUFNLE9BQU8sR0FBUDtHQUFOLENBRmYsQ0FIcUM7O1NBTzlCLE1BQVAsQ0FQcUM7Q0FBUjs7SUFVekI7V0FBQSxPQUNKLEdBQTJCO1FBQWQsZ0VBQVUsa0JBQUk7c0NBRHZCLFNBQ3VCOztTQUNw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