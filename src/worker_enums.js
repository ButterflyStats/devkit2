export default {
  'i2s': function(i) {
    for (var p in this) {
      if (this[p] === i) {
        return p
      }
    }
  },

  // max = 26

  // -- Request-replay messages
  'loadRequest':            1,  // loading
  'loadResponse':           2,

  'openRequest':            3,  // open file
  'openResponse':           4,

  'seekRequest':            7,  // seeking
  'seekResponse':           8,

  'togglePlayRequest':      10, // play / pause
  'playResponse':           11,
  'pauseResponse':          12,

  'spewEntityRequest':      14, // spew entity
  'spewEntityResponse':     15,
  'spewClassRequest':       16, // spew class
  'spewClassResponse':      17,

  'entitiesRequest':        18, // get all entities
  'entitiesResponse':       19,
  'entityRequest':          20, // get one entity
  'entityResponse':         21,

  'stringtablesRequest':    22, // get all stringtabes
  'stringtablesResponse':   23,
  'stringtableRequest':     24, // get one stringtable
  'stringtableResponse':    25,

  'subscriptionsRequest':   27,
  'subscriptionsResponse':  28,

  'combatlogRequest':       29,
  'combatlogResponse':      30,

  // -- Standalone Responses
  'openProgressInfo':       5,
  'tickdataInfo':           6,
  'classesInfo':            13,

  // -- Standalone Requests
  'parseOneRequest':        9,
  'subscriptionRequest':    26
}
