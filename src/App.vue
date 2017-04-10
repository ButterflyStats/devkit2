<template>
  <div id="app">
    <!-- loading -->
    <template v-if="isLoading">
      <loading></loading>
    </template>

    <!-- upload -->
    <template v-if="isPreUpload">
      <upload v-on:open="onOpen"></upload>
    </template>

    <!-- Left sidebar -->
    <template v-if="isPostUpload">
      <sidebar></sidebar>

      <!-- Content -->
      <div id="content">
        <router-view></router-view>
      </div>

      <!-- Controls -->
      <controls></controls>
    </template>
</template>

<script>
  import sidebar from './components/sidebar'
  import controls from './components/controls'
  import loading from './components/loading'
  import upload from './components/upload'
  import { mapState } from 'vuex'

  export default {
    name: 'app',
    components: { sidebar, controls, loading, upload },
    computed: mapState({
      isLoading: state => (state.app.state === 0),
      isPreUpload: state => (state.app.state === 1),
      isPostUpload: state => (state.app.state === 2)
    }),

    // callbacks for events
    methods: {
      onOpen: function (e) {
        this.$store.commit('loadingText', "[Building initial state]")
        this.$store.commit('appSetLoading')
      }
    },

    // triggered when the component is loaded
    mounted: function () {
      this.$nextTick(function () {
        // load butterfly webworker
        this.$store.commit('loadingText', "[Compiling ASM.js]")

        var self = this

        // register load handler
        this.$bf.register('loadResponse', function() {
          self.$store.commit('appSetPreUpload')
        })

        // register progress handler
        this.$bf.register('openProgressInfo', function(type, data) {
          self.$store.commit('loadingPerc', data['perc'])
        })

        // finalize on load
        this.$bf.register('openResponse', function() {
          self.$store.commit('appSetPostUpload')
        })

        // set tickdata in store
        this.$bf.register('tickdataInfo', function(type, data) {
          self.$store.commit('bfSetTickdata', data)
        })

        // set classes
        this.$bf.register('classesInfo', function(type, data) {
          self.$store.commit('bfSetClasses', data)
          console.log(data)
        })

        // load
        this.$bf.load()
      })
    }
  }
</script>

<style lang="scss">
  @import '/sass/globals.scss';

  html, body {
    width: 100%;
    height: 100%;
  }

  #app {
    width: 100%;
    height: 100%;
    background-color: $color-bg-dark;
  }

  #content {
    margin-left: $sidebar-width;
    width: calc(100% - $sidebar-width);
    height: calc(100% - 34px);
    background-color: $color-bg-content;
  }

  .ibox {
    margin: $ibox-spacing $ibox-spacing 0 $ibox-spacing;
    background-color: white;
    padding: 10px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.48), 0 1px 2px rgba(0,0,0,0.48);
    max-height: calc(100% - 15px);
    overflow: hidden;
  }

  .bar {
    background-color: $color-bg-dark;
    font-size: 16px;
    padding: 0 5px 0 5px;
    line-height: 34px;
    color: #fff;

    .title {
      font-family: $font-lato;
    }

    .filter {
        margin-left: 20px;
        display: inline-block;
        border: 0px none;
        background-color: $color-bg-dark;
        font-size: 12px;
        color: #ccc;
        width: 50%;
    }
  }

  .side-nav {
    height: 90%;
    overflow: scroll;
    overflow-x:hidden;

    ul {
      list-style: none;
      margin: 0px;
      padding: 0px;
      width: 100%;

      li {
        background-color: $color-bg-light;
        padding: 4px;
        border-bottom: 1px solid #ccc;
      }
    }
  }
</style>
