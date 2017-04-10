<template>
    <div class="h100p">
      <div class="bar">
        <div class="container-fluid">
          <div class="row row-no-padding">
            <div class="col-md-2">
              <span class="title">Stringtables</span>
            </div>
          </div>
        </div>
      </div>

      <div class="container-fluid h100">
        <div class="row row-no-padding h100">
          <div class="col-md-2 side-nav h100">
            <ul class="h100">
              <template v-for="tbl in stringtables">
                <li>{{ tbl.name }}</li>
              </template>
            </ul>
          </div>
          <div class="col-md-10 nopadding h100">
            <div class="h100" style="padding-bottom: 20px;">
              <div class="ibox" style="overflow-y: scroll">
                <pre>{{content}}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'stringtables',
    data: function() {
      return {
        content: null,
        stringtables: []
      }
    },
    methods: {
    },
    mounted: function () {
      var self = this

      this.$nextTick(function () {
        this.$bf.getStringtables()

        this.$bf.register('stringtablesResponse', function(type, data) {
          self.stringtables = data
        })
      })
    }
  }
</script>

<style lang='scss' scoped>
  @import '../sass/globals.scss';

  pre {
    background-color: white;
    border: 0px;
  }

  .side-nav {
    overflow-y: hidden;
  }
</style>
