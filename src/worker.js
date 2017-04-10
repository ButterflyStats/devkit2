import enums from './worker_enums'

var cvisitor = null;
var cnvisitor = null;
var parser = null;
var play_timer = null;

/** Global data across all visitors */
var data = {
  /** Gamerules entity id */
  gent_id: -1,

  /** Data about min/max time and tick */
  tickdata: {
    tick_min: 0,
    tick_max: 0,
    time_pregame: 0.0,
    time_start: 0.0,
    time_finish: 0.0,
    time_end: 0.0
  },

  /** Current time */
  time_cur: 0.0,

  /** Are we playing */
  playing: false,

  /** Tickrate */
  tickrate: 1000.0 / 30.0
}

/** Used to get final state for analysis */
var fvisitor = {
  /** Parsing percentage */
  lperc: 0,

  /** FS representation */
  build_fs: function(id, table, target) {
    var eSerializers = parser.serializers()
    var ser = eSerializers.get(id)
    var props = ser.properties
    var ret = []

    for (var i = 0; i < props.size(); ++i) {
      var prop = props.get(i)
      ret.push({
        name: prop.info().name,
        bits: prop.info().bits,
        flags: prop.info().flags,
        min: prop.info().min,
        max: prop.info().max
      })
    }

    props.delete()
    return ret
  },

  /** Packet callback */
  on_packet: function(id, data) {},

  /** State callback */
  on_state: function(state) {
    // note down some timings at replay end
    if (state == 3) {
      var gent = parser.entity(data.gent_id);

      data.tickdata.tick_max = parser.tick;
      data.tickdata.time_pregame = gent.get("m_pGameRules.m_flPreGameStartTime").value();
      data.tickdata.time_finish = gent.get("m_pGameRules.m_flGameEndTime").value();
      data.tickdata.time_end = gent.get("m_pGameRules.m_fGameTime").value();

      send(enums['tickdataInfo'], data.tickdata);

      // send classes after load
      var classes = []
      var eClasses = parser.entity_classes.data
      var eIdx = eClasses.indices()

      for (var i = 0; i < eIdx.size(); ++i) {
        var cls = eClasses.by_index(eIdx.get(i))

        classes.push({
          id: cls.index,
          name: cls.key,
          type: cls.value().type
        })
      }

      send(enums['classesInfo'], classes)
    }
  },

  /** Entity callback */
  on_entity: function(state, entity) {
    // look for gamerules proxy
    if (data.gent_id === -1 && state == Module.entity_state.ENT_UPDATED) {
      var clazz = entity.cls()
      var clazz_name = parser.class_name(clazz)

      if (clazz_name == "CDOTAGamerulesProxy") {
        data.gent_id = entity.id()
        data.tickdata.tick_min = parser.tick
        //data.tickdata.time_start = entity.get("m_pGameRules.m_fGameTime").value();
      }
    }
  },

  on_tick: function(tick) {},

  on_progress: function(perc) {
    // perc callback
    if (perc > this.lperc+1) {
      send(enums['openProgressInfo'], {perc: perc})
      this.lperc = perc
    }
  }
}

/** Normal visitor that allows seeking and everything else */
var nvisitor = {
  /** Packet callback */
  on_packet: function(id, data) {},

  /** State callback */
  on_state: function(state) {
  },

  /** Entity callback */
  on_entity: function(state, entity) {
    if (state == Module.entity_state.ENT_UPDATED && entity.id() == data.gent_id) {
      data.time_cur = entity.get("m_pGameRules.m_fGameTime").value()
      send(enums['seekResponse'], {time: data.time_cur})
    }
  },

  on_tick: function(tick) {},
  on_progress: function(perc) {}
}

/** Send a new message to the browser */
var send = function (type, message) {
  var obj = {type: type, data: message};
  postMessage(JSON.stringify(obj))
}

/** Parse a single message and return the time left base on tick */
var parse = function() {
  // perf now
  var time_before = performance.now()
  var tick_before = parser.tick

  // parse one
  parser.parse(cnvisitor)

  // perf after
  var time_after = performance.now()
  var tick_after = parser.tick

  // calc timeout
  var frame = (tick_after - tick_before) * data.tickrate
  var spend = frame - (time_after - time_before)

  if (spend > 0 && data.playing) {
    play_timer = setTimeout(parse, spend);
  }
}

/** Callback for memory load */
self.g_LocateFile = function (text) {
  return "static/butterfly/butterflyjs1.js.mem"
}

/** Callback for compilation */
self.g_OnASMReady = function () {
  cvisitor = Module.visitor.implement(fvisitor);
  cnvisitor = Module.visitor.implement(nvisitor);
  send(enums['loadResponse'], null)
}

/** Worker constructor */
function worker() {}

/** Handle new message */
worker.prototype.on = function(type, message) {
  switch (type) {
    /** Load butterfly.js asm */
    case enums['loadRequest']: {
      importScripts('/static/butterfly/butterflyjs1.js');
    } break;

    /** Open and get initial replay state */
    case enums['openRequest']: {
      var fs = new FileReaderSync();
      FS.writeFile("/replay.dem", new Uint8Array(fs.readAsArrayBuffer(message.file)), {encoding: 'binary'});

      parser = new Module.parser();
      parser.open("/replay.dem", cvisitor);
      parser.parse_all(cvisitor);
      parser.seek(0);
      send(enums['openResponse'])
    } break;

    /** Seek to a specific position in a replay */
    case enums['seekRequest']: {
      console.log(message['time'])
      parser.seek(message['time'])

      var gent = parser.entity(data.gent_id)
      data.time_cur = gent.get("m_pGameRules.m_fGameTime").value()
      send(enums['seekResponse'], {time: data.time_cur});
    }

    /** Parse a single packet */
    case enums['parseOneRequest']: {
      parse()
    } break;

    /** Toggle playing */
    case enums['togglePlayRequest']: {
      if (data.playing) {
        // stop playing
        data.playing = false
        clearTimeout(play_timer)
        play_timer = null
        send(enums['pauseResponse'], null)
      } else {
        // start playing
        data.playing = true;
        parse()
        send(enums['playResponse'], null)
      }
    } break;

    /** Return all entities (overview) */
    case enums['entitiesRequest']: {
      // there might be more, but this should be fine
      var ret = []

      for (var i = 0; i < 4096; ++i) {
        var ent = parser.entity(i)
        if (ent.valid()) {
          ret.push({id: ent.id(), cls: ent.cls()});
        }
      }

      send(enums['entitiesResponse'], ret)
    } break;

    /** Return all stringtables (overview) */
    case enums['stringtablesRequest']: {
      var ret = []
      var tables = parser.stringtables()
      var is = tables.indices()

      for (var i = 0; i < is.size(); ++i) {
        var ii = is.get(i)
        var ie = tables.by_index(ii)
        ret.push({
          name: ie.key,
          index: ie.index
        })
      }

      console.log("sending", ret)
      send(enums['stringtablesResponse'], ret)
    } break;

    /** Spew entity */
    case enums['spewEntityRequest']: {
      send(enums['spewEntityResponse'], parser.entity(message['id']).spew_string())
    } break;

    /** Spew class */
    case enums['spewClassRequest']: {
      send(enums['spewClassResponse'], parser.serializers().spew_string(message['id']))
    } break;
  }
}

var worker = new worker()
onmessage = function(e) {
  var data = {}

  if (typeof(e['data']) != 'object') {
    data = JSON.parse(e['data'])
  } else {
    data = e['data']
  }

  console.log('Message received from main script', enums.i2s(data['type']));
  worker.on(data['type'], data['data'])
}
