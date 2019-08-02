const Graphlite = require('graphlite');

let graphliteInstance;

const createGraphliteInstance = ({
  schemas,
  queries,
  associations,
  connection,
  locales,
}) => {
  return new Graphlite({
    schemas,
    queries,
    associations,
    connection,
    locales,
  });
};

const expressGraphliteMiddleware = (req, res) => {
  if (req.method !== 'POST') {
    return res.json({
      error: 1,
      message: 'Make Graphlite requests using POST method!',
    });
  }

  const { body: payload } = req;
  const {
    queryName,
    type,
    locale,
  } = payload;

  const options = {
    ...payload,
    locale,
  };

  delete options.queryName;
  delete options.type;

  if (!queryName) {
    return res.json({
      error: 1,
      message: 'Missing queryName param',
    });
  }

  try {
    return graphliteInstance[type || 'findAll'](queryName, options)
      .then(data => res.json(data))
      .catch(err => res.json({
        error: 1,
        message: err.toString(),
      }));
  } catch (exception) {
    return res.json({
      error: 1,
      message: exception.toString(),
    });
  }
};

const useGraphliteMiddleware = (...args) => {
  graphliteInstance = createGraphliteInstance(...args);
  return expressGraphliteMiddleware;
};

module.exports = useGraphliteMiddleware;
