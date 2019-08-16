const Graphlite = require('graphlite');

const defaultFindType = 'findAll';

let graphliteInstance;

const createGraphliteInstance = ({
  schemas,
  queries,
  associations,
  connection,
  locales,
  debug,
}) => new Graphlite({
  schemas,
  queries,
  associations,
  connection,
  locales,
  debug,
});

const returnError = (res, message) => res.json({ error: 1, message });

const expressGraphliteMiddleware = (req, res) => {
  const {
    url,
    method,
    body: payload,
  } = req;

  if (method !== 'GET') {
    return returnError(res, 'Make Graphlite requests using GET method');
  }

  let findType;
  let queryName;

  if (/^\/\w+\/[\w\-]+$/.test(url)) {
    // /findType/queryName
    const chunks = url.split('/').filter(e => !!e);
    findType = chunks.shift();
    queryName = chunks.shift();
  } else if (/^\/\w+$/.test(url)) {
    // /queryName
    const chunks = url.split('/').filter(e => !!e);
    findType = defaultFindType;
    queryName = chunks.shift();
  } else {
    return returnError(res, 'Check your url specification');
  }

  if (!queryName) {
    return returnError(res, 'Missing query name');
  }

  const queryOptions = payload;

  try {
    return graphliteInstance[findType](queryName, queryOptions)
      .then(data => res.json(data))
      .catch(err => returnError(res, err.toString()));
  } catch (exception) {
    return returnError(res, exception.toString());
  }
};

const useGraphliteMiddleware = (...args) => {
  graphliteInstance = createGraphliteInstance(...args);
  return expressGraphliteMiddleware;
};

module.exports = useGraphliteMiddleware;
