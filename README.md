# Express Graphlite
Graphlite middleware for express.

## Installation
```bash
yarn add express-graphlite
```

## Usage
```javascript
// ...
const app = express();

const schemas = require('../config/schemas');
const queries = require('../config/queries');
const associations = require('../config/useAssociations');
const databases = require('../config/databases');

// Create an instance of databases to run the query.
const storage = new SqliteStorage({ databases });

// Apply the middleware passing down all graphlite options.
app.use('/graphlite', expressGraphlite({
  schemas,
  queries,
  associations,
  connection: storage,
  debug: true,
}));
```

## Options
| Name | Type | Description |
| ---- | ---- | ----------- |
| schemas | Array | Array of Graphlite schemas |
| queries | Array | Array of Graphlite queries |
| associations | Function | Function to associated all schemas between them |
| connection | Object, Function | Object or function which Graphlite uses to run the query on database.
| debug | Boolean | If must or must not enable the Graphlite builtin debugger. |

After that, simply call the express server using the ```GET``` and the ```/graphlite/(findAll|findOne)/queryName``` url format.

The query options must be defined as json object and requested as ```application/json```.

See [Graphlite](https://github.com/ffrm/graphlite.git) options reference  for further information about specific filters keywords.
