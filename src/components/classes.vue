<template>
  <div class="h100p">

    <!-- Top bar -->
    <div class="bar">
      <div class="container-fluid">
        <div class="row row-no-padding">
          <div class="col-md-2">
            <span class="title">Classes</span>
            <input class="filter" type="text" placeholder="Filter..." />
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid h100">
      <div class="row row-no-padding h100">
        <!-- navigation -->
        <div class="col-md-3 side-nav h100">
          <ul>
            <template v-for="c in classes">
              <li v-on:click="onSpew(c.id)">{{ c.name }}</li>
            </template>
          </ul>
        </div>

        <!-- content -->
        <div class="col-md-9 h100" style="padding-bottom: 20px;">
          <div class="ibox" v-if="content !== null">
            <pre>{{content}}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'classes',
    computed: mapState({
      classes: state => state.bf.classes
    }),
    mounted: function () {
      var self = this

      this.$nextTick(function () {
        this.$bf.register('spewClassResponse', function(type, data) {
          self.content = data
        })
      })
    },
    data: function() {
      return {
        content: null
      }
    },
    methods: {
      onSpew: function(id) {
        this.$bf.spewClass(id)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../sass/globals.scss';

  pre {
    background-color: white;
    border: 0px;
  }

  ul {
    li {
      padding-left: 20px;
    }
  }
</style>
