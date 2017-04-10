<template>
  <!-- Play button -->
  <div id="controls">
    <div id="playbutton" v-on:click="playToggle">
      <template v-if="playing">
        <span class="img fa fa-pause"></span>
      </template>
      <template v-else>
        <span class="img fa fa-play"></span>
      </template>
    </div>

    <div id="playbar">
      <div class="slider" v-on:click="seek">
          <span class="stooltip" :style="'top:-'+off_top+'px;left:'+off_left+'px'">{{stime_formated}}</span>
          <span class="slider-time">{{time_cur}} / {{time_end}}</span>
          <span class="slider-progress-wrapper" v-on:mousemove="hover">
          <span class="slider-progress"></span>
          <span class="slider-progress-cur" :style="'width:'+off_width+'%'"></span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'controls',
  data: function() {
    return {
      stime: 0.00,
      stime_formated: "00:00",
      swidth: 0,
      off_top: 35,
      off_left: 0,
      off_width: 0
    }
  },
  computed: mapState({
    tickdata: state => state.bf.tickdata,
    playing: state => state.bf.playing,
    time_end: function (state) {
      var tstart = state.bf.tickdata.time_end - state.bf.tickdata.time_pregame - 90
      return new Date(1000 * tstart).toISOString().substr(14, 5)
    },
    time_cur: function (state) {
      var tcur = state.bf.time_cur - state.bf.tickdata.time_pregame - 90
      return this.getTime(tcur)
    }
  }),
  mounted: function () {
    var self = this

    this.$nextTick(function () {
      this.$bf.register('seekResponse', function(type, data) {
        self.$store.commit('bfSetTimeCur', data['time'])
        self.off_width = self.swidth
      })

      this.$bf.register('playResponse', function(type, data) {
        self.$store.commit('bfSetPlaying')
      })

      this.$bf.register('pauseResponse', function(type, data) {
        self.$store.commit('bfSetPause')
      })
    })
  },
  methods: {
    /** format time */
    getTime: function(fl) {
      var afl = Math.abs(fl)
      var min = Math.floor(afl / 60.0)
      var secs = Math.floor(afl % 60)

      if (min < 10) min = "0" + Math.abs(min)
      if (secs < 10) secs = "0" + Math.abs(secs)

      if (fl < 0) return "-" + min + ":" + secs
      return min + ":" + secs
    },

    /** Seek to a specific position in a replay */
    seek: function(event) {
      if (this.stime > 0) {
        this.$bf.seek(this.stime)
      }
    },

    /** Toggle pause / play */
    playToggle: function(ev) {
      this.$bf.togglePlaying()
    },

    /** Compute position relative to replay length */
    hover: function(event) {
      var pos = event.layerX
      var max = event.target.offsetWidth

      // max width is always offsetWidth
      if (pos > max) {
        pos = max
      }

      // compute length
      var percent = (pos / max) * 100
      this.swidth = parseInt(percent)
      this.stime = (this.tickdata.time_end / 100.0) * percent
      this.stime_formated = this.getTime(this.stime - this.tickdata.time_pregame - 90)

      // off_top is 35 because of the slider height
      // off_left is 90+X because X is the mouse position, and 90 is (110 - 20), the ele being 40 pix width
      // and the offset from the far right is 110
      this.off_left = 90 + pos
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  @import '../sass/globals.scss';

  // Play button
  #controls {
    // left-side button
    #playbutton {
      height: $playbar-height;
      margin: 0px;
      padding: 0 0 4px 0px;
      position: absolute;
      width: $sidebar-width;
      left: 0%;
      bottom: 0%;
      background-color: $color-bg-light;
      font-size: 20px;
      z-index: 20;
      border-top: 1px solid $color-controls-border;
      border-right: 1px solid $color-controls-border;
      text-align: center;
      color: $color-controls;
      cursor: pointer;
    }

    // play-bar
    #playbar {
      right: 0%;
      height: $playbar-height;
      max-height: $playbar-height;
      border-top: 1px solid $color-controls-border;
      position: absolute;
      bottom: 0%;
      background-color: $color-bg-light;
      width: calc(100% - 100px);
      color: $color-bg-light;
      font-size: 20px;
      z-index: 1;

      .slider {
        padding: 0px;
        margin: 0px;
        display: inline-block;
        width: 100%;

        .slider-time {
          position: absolute;
          font-size: 13px;
          text-align: center;
          display: inline-block;
          width: 110px;
          vertical-align: middle;
          line-height: 33px;
          color: #000;
        }

        .slider-progress-wrapper {
          position: relative;
          display: inline-block;
          width: calc(100% - 140px);
          height: 10px;
          left: 110px;
        }

        .slider-progress-wrapper:hover {
          cursor: pointer;
        }

        .slider-progress {
          position: absolute;
          display: inline-block;
          height: 4px;
          width: 100%;
          background-color: $color-controls;
          z-index: 2;
          top: 4px;
        }

        .slider-progress-cur {
          position: absolute;
          display: inline-block;
          height: 4px;
          width: 0px;
          background-color: $color-dire;
          z-index: 3;
          top: 4px;
        }

        .stooltip {
          display: none;
          position: absolute;
          z-index: 3;
          background-color: $color-controls;
          color: white;
          padding: 5px;
          font-size: 12px;
          border-radius: 2px;
        }
      }

      .slider:hover {
        .stooltip {
          display: inline-block;
        }
      }
    }
  }
</style>
