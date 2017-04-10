export default {
  state: {
    tickdata: {
      tick_min: 0,
      tick_max: 0,
      time_pregame: 0.0,
      time_start: 0.0,
      time_finish: 0.0,
      time_end: 0.0
    },
    time_cur: 0.0,
    playing: false,
    classes: {}
  },
  mutations: {
    bfSetTickdata: function(state, tdata) {
      state.tickdata = tdata
    },
    bfSetTimeCur: function(state, time) {
      state.time_cur = time
    },
    bfSetPlaying: function(state) {
      state.playing = true
    },
    bfSetPause: function(state) {
      state.playing = false
    },
    bfSetClasses: function(state, classes) {
      state.classes = classes
    }
  }
}
