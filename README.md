# TaskWiz JSON Adapter [![Build Status](https://travis-ci.org/therealklanni/taskwiz-json-adapter.svg?branch=master)](https://travis-ci.org/therealklanni/taskwiz-json-adapter)

> Store [Task Wizard](https://github.com/therealklanni/taskwiz) meta data in a flat JSON file

This adapter is responsible only for the manipulation (storing, updating, removing) of task data within corresponding flat JSON files on the local file system. This is the default adapter used with [Task Wizard](https://github.com/therealklanni/taskwiz). This adapter adheres to the relevant specifications defined in the [Taskwarrior design specifications (JSON format)](https://taskwarrior.org/docs/design/task.html) in order to remain compatible with Taskwarrior.

> The consumer of the adapter is responsible for ensuring the task data is correctly formatted according to the Taskwarrior specification. To reiterate, this adapter only ensures the **file** format adheres to the specification.

By default files will be created in your user HOME directory, in a subfolder named `.taskwiz`. This can be overridden in the options upon instantiating the adapter.

Task data is stored in the following format, as defined in the Taskwarrior specification, with each line being an individual task.

```js
{"description":"One two three","status":"pending", ... }
```

## Usage

```js
import jsonAdapter from 'taskwiz-json-adapter'
const adapter = jsonAdapter()
```

### **jsonAdapter(*[options]*)**

This factory function will instantiate a new JSON Adapter. Available options are defined as shown below.

- *path* (String) the path to the folder where JSON data should be stored. This should point to a directory location, not a file. If the directory does not exist, it will be created any time the adapter attempts to store data.

```js
const adapter = jsonAdapter({
  path: '/User/someone/.taskwiz'
})
```

The adapter will automatically create the appropriate files, as needed.

### Methods

All methods use a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) interface for asynchronous operation.

#### **.create(task)**

Creates the given task.

```js
adapter.create({
  uuid: '0f52edbe-1393-4f1e-8463-c23295b957a2',
  description: 'New task',
  status: 'pending',
  ...
}).then(task => {
  // task successfully created in data store
}).catch(err => {
  // an error occurred while creating task
})
```

#### **.read(uuid)**

Finds the task with the given `uuid`, if it exists.

```js
adapter.read('0f52edbe-1393-4f1e-8463-c23295b957a2')
  .then(task => {
    // task data retrieved
  })
  .catch(err => {
    // unable to read task; it probably doesn't exist
  })
```

#### **.update(task)**

Finds the task with a matching `uuid` and replaces it with the given task.

```js
adapter.update({
  uuid: '0f52edbe-1393-4f1e-8463-c23295b957a2',
  description: 'New task',
  status: 'completed',
  ...
}).then(task => {
  // task successfully updated in data store
}).catch(err => {
  // an error occurred while updating task
})
```

#### **.delete(uuid)**

Finds the task matching the given `uuid` and removes it from the data store.

```js
adapter.read('0f52edbe-1393-4f1e-8463-c23295b957a2')
  .then(task => {
    // task data deleted
  })
  .catch(err => {
    // unable to remove task; it probably doesn't exist
  })
```
