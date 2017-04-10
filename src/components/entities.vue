<template>
    <div class="h100p">
      <div class="bar">
        <div class="container-fluid">
          <div class="row row-no-padding">
            <div class="col-md-2">
              <span class="title">Entities</span>
              <input class="filter" type="text" placeholder="Filter..." />
              <span class="pull-right">
                  <i id="erefresh" class="fa fa-refresh item-icon" aria-hidden="true"> </i>
                  <i id="esettings" class="fa fa-cog item-icon" aria-hidden="true"> </i>
              </span>
            </div>
            <div class="col-md-10 etabs">
              <ul>
                <li>CDOTAPlayer</li>
                <li>CDOTAGameRulesEntity</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="container-fluid h100">
        <div class="row row-no-padding h100">
          <div class="col-md-2 side-nav h100">
            <ul class="h100">
              <template v-for="e in entities">
                <li v-on:click="onSpew(e.id)">{{ classes[e.cls].name }}</li>
              </template>
            </ul>
          </div>
          <div class="col-md-10 nopadding h100">
            <div class="econtent h100" style="padding-bottom: 20px;">
              <div class="ibox" style="overflow-y: scroll">
                <!-- <table class="table table-condensed">
                  <thead>
                    <tr> <th>#</th> <th>First Name</th> <th>Last Name</th> <th>Username</th> </tr>
                  </thead>
                  <tbody>
                    <tr> <th scope="row">1</th> <td>Mark</td> <td>Otto</td> <td>@mdo</td> </tr>
                    <tr> <th scope="row">1</th> <td>Mark</td> <td>Otto</td> <td>@mdo</td> </tr>
                    <tr> <th scope="row">1</th> <td>Mark</td> <td>Otto</td> <td>@mdo</td> </tr>
                    <tr> <th scope="row">1</th> <td>Mark</td> <td>Otto</td> <td>@mdo</td> </tr>
                    <tr> <th scope="row">1</th> <td>Mark</td> <td>Otto</td> <td>@mdo</td> </tr>
                  </tbody>
                </table> -->
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
    name: 'entities',
    computed: mapState({
      classes: state => state.bf.classes
    }),
    data: function() {
      return {
        content: null,
        entities: []
      }
    },
    methods: {
      onEntities(type, data) {
        this.entities = data
      },
      onRefresh(type, data) {
        this.$bf.getEntities()
      },
      onSpew(id) {
        this.$bf.spewEntity(id)
      }
    },
    mounted: function () {
      var self = this

      this.$nextTick(function () {
        this.onRefresh()

        // make sure we refresh at certain events
        this.$bf.register('seekResponse', this.onRefresh)
        this.$bf.register('entitiesResponse', this.onEntities)

        // set content
        this.$bf.register('spewEntityResponse', function(type, data) {
          self.content = data
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

  .econtent {
    .ibox {
      padding-bottom: 0px;
    }
  }

  .etabs {
    font-size: 12px;

    ul {
      list-style: none;
      margin: 0px;
      padding: 0px;

      li {
        display: inline-block;
        background-color: $color-bg-light;
        color: #333;
        padding: 0 7px 0 7px;
        margin: 0px 4px 0px 4px;
        line-height: 24px;
        border-radius: 2px;
        font-family: $font-lato;
      }
    }
  }

  .elist {
    height: 100%;

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

  .etabs {
    text-align: center;
  }
</style>
