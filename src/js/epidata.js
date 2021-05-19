// Wrapper for delphi_epidata.js
var Epidata = (function() {
  // The API
  var api = Epidata;

  // generic API access
  function handleData(onSuccess, onFailure, columns, params, result, message, epidata) {
    if (result <= 0) {
      // hard failure (can't continue)
      onFailure('There was an error fetching the data. [result=' + result + ']');
    }
    if (result === 2) {
      // soft failure (can continue)
      onFailure('Too many results, data truncated.');
    }
    if (result >= 1) {
      // success
      onSuccess(loadEpidata(epidata, columns, params));
    }
  }
  // generic callback generator
  function getCallback(onSuccess, onFailure, columns, params) {
    return function (result, message, epidata) {
      handleData(onSuccess, onFailure, columns, params, result, message, epidata);
    };
  }
  // public API
  return {
    api: api,
  };
}());
