import bug from 'debug';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { createInterface } from 'readline';
import tempfile from 'tempfile';
import _ from 'highland';

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

  createInterface({ input: fs.createReadStream(file) }).on('line', function (line) {
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

export default index;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1hZGFwdGVyLmVzMjAxNS5qcyIsInNvdXJjZXMiOlsiLi4vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJ1ZyBmcm9tICdkZWJ1ZydcbmNvbnN0IGRlYnVnID0gYnVnKCd0YXNrd2l6Ompzb24tYWRhcHRlcicpXG5cbmltcG9ydCBvcyBmcm9tICdvcydcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBjcmVhdGVJbnRlcmZhY2UgfSBmcm9tICdyZWFkbGluZSdcbmltcG9ydCB0ZW1wZmlsZSBmcm9tICd0ZW1wZmlsZSdcbmltcG9ydCBfIGZyb20gJ2hpZ2hsYW5kJ1xuXG5jb25zdCBmcm9tSlNPTiA9IHggPT4gSlNPTi5wYXJzZSh4KVxuY29uc3QgdG9CdWZmZXIgPSB4ID0+IG5ldyBCdWZmZXIoYCR7SlNPTi5zdHJpbmdpZnkoeCl9XFxuYClcblxuY29uc3QgY3JlYXRlTGluZVJlYWRlclN0cmVhbSA9IGZpbGUgPT4ge1xuICBjb25zdCBzdHJlYW0gPSBfKClcblxuICBjcmVhdGVJbnRlcmZhY2UoeyBpbnB1dDogZnMuY3JlYXRlUmVhZFN0cmVhbShmaWxlKSB9KVxuICAgIC5vbignbGluZScsIGxpbmUgPT4gc3RyZWFtLndyaXRlKGxpbmUpKVxuICAgIC5vbignY2xvc2UnLCAoKSA9PiBzdHJlYW0uZW5kKCkpXG5cbiAgcmV0dXJuIHN0cmVhbVxufVxuXG5jbGFzcyBBZGFwdGVyIHtcbiAgY29uc3RydWN0b3IgKG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMucGF0aCA9IG9wdGlvbnMucGF0aCB8fCBwYXRoLmpvaW4ob3MuaG9tZWRpcigpLCAnLnRhc2t3aXonLCAndGFza3MuanNvbicpXG5cbiAgICBkZWJ1ZygnQ29uc3RydWN0b3InLCB0aGlzKVxuICB9XG5cbiAgZmluZE9yQ3JlYXRlUGF0aCAoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgZnMuc3RhdCh0aGlzLnBhdGgsIChlcnIsIHN0YXRzKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAvLyBUYXNrIGZpbGUgZG9lcyBub3QgZXhpc3RcbiAgICAgICAgICBkZWJ1ZyhgVW5hYmxlIHRvIHN0YXQgJHt0aGlzLnBhdGh9YCwgZXJyLm1lc3NhZ2UpXG4gICAgICAgICAgY29uc3QgZGlybmFtZSA9IHBhdGguZGlybmFtZSh0aGlzLnBhdGgpXG5cbiAgICAgICAgICAvLyBDaGVjayBpZiBjb250YWluaW5nIGRpcmVjdG9yeSBleGlzdHNcbiAgICAgICAgICBmcy5zdGF0KGRpcm5hbWUsIChlcnIsIHN0YXRzKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIC8vIENvbnRhaW5pbmcgZGlyZWN0b3J5IGRvZXMgbm90IGV4aXN0XG4gICAgICAgICAgICAgIGRlYnVnKGBVbmFibGUgdG8gc3RhdCAke2Rpcm5hbWV9YCwgZXJyLm1lc3NhZ2UpXG5cbiAgICAgICAgICAgICAgLy8gQXR0ZW1wdCB0byBjcmVhdGUgdGhlIGRpcmVjdG9yeVxuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGZzLm1rZGlyU3luYyhkaXJuYW1lLCAwbzc1NSlcbiAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGRlYnVnKGBVbmFibGUgdG8gY3JlYXRlICR7ZGlybmFtZX1gLCBlLm1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlaihlKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSBUYXNrIGZpbGVcbiAgICAgICAgICAgIGZzLndyaXRlRmlsZSh0aGlzLnBhdGgsICcnLCB7IG1vZGU6IDBvNjQ0IH0sIGVyciA9PiB7XG4gICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBkZWJ1ZyhgVW5hYmxlIHRvIG9wZW4gJHt0aGlzLnBhdGh9IGZvciB3cml0aW5nYCwgZXJyLm1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlaihlcnIpXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBkZWJ1ZyhgQ3JlYXRlZCBuZXcgdGFzayBmaWxlOiAke3RoaXMucGF0aH1gKVxuICAgICAgICAgICAgICByZXR1cm4gcmVzKHRoaXMucGF0aClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWJ1ZyhgJHt0aGlzLnBhdGh9IHN0YXRzYCwgc3RhdHMpXG4gICAgICAgICAgcmV0dXJuIHJlcyh0aGlzLnBhdGgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGNyZWF0ZSAodGFzaykge1xuICAgIGRlYnVnKCdDcmVhdGUnLCB0YXNrKVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcbiAgICAgIHRoaXMuZmluZE9yQ3JlYXRlUGF0aCgpLnRoZW4odGFza0ZpbGUgPT4ge1xuICAgICAgICBjb25zdCB0ZW1wID0gdGVtcGZpbGUoKVxuICAgICAgICBkZWJ1ZyhgdGVtcGZpbGU6ICR7dGVtcH1gKVxuXG4gICAgICAgIGZzLmNyZWF0ZVJlYWRTdHJlYW0odGFza0ZpbGUpLnBpcGUoZnMuY3JlYXRlV3JpdGVTdHJlYW0odGVtcCkpXG5cbiAgICAgICAgY3JlYXRlTGluZVJlYWRlclN0cmVhbSh0YXNrRmlsZSlcbiAgICAgICAgICAubWFwKGZyb21KU09OKVxuICAgICAgICAgIC5maW5kV2hlcmUoeyB1dWlkOiB0YXNrLnV1aWQgfSlcbiAgICAgICAgICAudG9BcnJheShhID0+IHtcbiAgICAgICAgICAgIGRlYnVnKCd0b0FycmF5JywgYSlcblxuICAgICAgICAgICAgaWYgKGEubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGRlYnVnKGAke3Rhc2sudXVpZH0gZXhpc3RzYClcbiAgICAgICAgICAgICAgcmVqKG5ldyBFcnJvcignRHVwbGljYXRlIHV1aWQnKSlcbiAgICAgICAgICAgICAgZnMudW5saW5rKHRlbXApXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBkZWJ1ZyhgJHt0YXNrLnV1aWR9IG5vdCBmb3VuZCwgd3JpdGluZyB0byBmaWxlYClcbiAgICAgICAgICAgICAgY29uc3Qgb3V0cHV0ID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0odGFza0ZpbGUsIHsgbW9kZTogMG82NDQgfSlcbiAgICAgICAgICAgICAgICAub24oJ2ZpbmlzaCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgIGRlYnVnKGBVcGRhdGVkICR7dGFza0ZpbGV9IHdyaXR0ZW5gKVxuICAgICAgICAgICAgICAgICAgcmVzKHRhc2spXG4gICAgICAgICAgICAgICAgICBmcy51bmxpbmsodGVtcClcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgIGNyZWF0ZUxpbmVSZWFkZXJTdHJlYW0odGVtcClcbiAgICAgICAgICAgICAgICAubWFwKGZyb21KU09OKVxuICAgICAgICAgICAgICAgIC5hcHBlbmQodGFzaylcbiAgICAgICAgICAgICAgICAubWFwKHRvQnVmZmVyKVxuICAgICAgICAgICAgICAgIC5waXBlKG91dHB1dClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgcmVhZCAodXVpZCkge1xuICAgIGRlYnVnKGBSZWFkICR7dXVpZH1gKVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcbiAgICAgIHRoaXMuZmluZE9yQ3JlYXRlUGF0aCgpLnRoZW4odGFza0ZpbGUgPT4ge1xuICAgICAgICBjcmVhdGVMaW5lUmVhZGVyU3RyZWFtKHRhc2tGaWxlKVxuICAgICAgICAgIC5tYXAoZnJvbUpTT04pXG4gICAgICAgICAgLmZpbmRXaGVyZSh7IHV1aWQgfSlcbiAgICAgICAgICAudG9BcnJheShhID0+XG4gICAgICAgICAgICBhLmxlbmd0aCA/IHJlcyhhWzBdKSA6IHJlaihuZXcgRXJyb3IoYE5vdCBmb3VuZDogJHt1dWlkfWApKSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHVwZGF0ZSAodGFzaykge1xuICAgIGRlYnVnKGBVcGRhdGUgJHt0YXNrLnV1aWR9YClcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKSlcbiAgfVxuXG4gIGRlbGV0ZSAodXVpZCkge1xuICAgIGRlYnVnKGBEZWxldGUgJHt1dWlkfWApXG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkJykpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgKC4uLmFyZ3MpID0+IG5ldyBBZGFwdGVyKC4uLmFyZ3MpXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBTSxRQUFRLElBQUksc0JBQUosQ0FBUjs7QUFFTixBQU9BLElBQU0sV0FBVyxTQUFYLFFBQVc7U0FBSyxLQUFLLEtBQUwsQ0FBVyxDQUFYO0NBQUw7QUFDakIsSUFBTSxXQUFXLFNBQVgsUUFBVztTQUFLLElBQUksTUFBSixDQUFjLEtBQUssU0FBTCxDQUFlLENBQWYsUUFBZDtDQUFMOztBQUVqQixJQUFNLHlCQUF5QixTQUF6QixzQkFBeUIsT0FBUTtNQUMvQixTQUFTLEdBQVQsQ0FEK0I7O2tCQUdyQixFQUFFLE9BQU8sR0FBRyxnQkFBSCxDQUFvQixJQUFwQixDQUFQLEVBQWxCLEVBQ0csRUFESCxDQUNNLE1BRE4sRUFDYztXQUFRLE9BQU8sS0FBUCxDQUFhLElBQWI7R0FBUixDQURkLENBRUcsRUFGSCxDQUVNLE9BRk4sRUFFZTtXQUFNLE9BQU8sR0FBUDtHQUFOLENBRmYsQ0FIcUM7O1NBTzlCLE1BQVAsQ0FQcUM7Q0FBUjs7SUFVekI7V0FBQSxPQUNKLEdBQTJCO1FBQWQsZ0VBQVUsa0JBQUk7c0NBRHZCLFNBQ3VCOztT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