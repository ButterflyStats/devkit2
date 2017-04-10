<template>
  <div id="sidebar">
    <!-- Sidebar -->
    <ul id="nav">
      <!-- Login -->
      <div class="profile" v-if="!loggedIn">
        <img src="../assets/steam.png" class="img img-circle" />
        <div class="spacer"></div>
        <div class="tags">
          <span class="img fa fa-cog"></span>
        </div>
      </div>

      <!-- Profile -->
      <div class="profile" v-else>
        <img src="../assets/person.jpg" class="img img-circle" />
        <div class="spacer"></div>
        <div class="tags">
          <span class="img fa fa-cog"></span>
          <span class="img fa fa-user"></span>
          <span class="img fa fa-sign-out"></span>
        </div>
      </div>

      <!-- Links -->
      <template v-for="link in links">
        <li v-on:click="navigate(link.view)" :id="'sb-' + link.view"
          :class="(small ? 'sb-link small' : 'sb-link') + ((active == link.view) ? ' active' : '')"
        >
          <span v-if="!small" :class="'img fa fa-' + link.icon"></span>
          <span class="txt">
            <span v-if="small" :class="'img fa fa-' + link.icon"></span> {{ link.name }}
          </span>
        </li>
      </template> <!-- /Links -->
    </ul> <!-- /Sidebar -->
  </div>
</template>

<script>
  import Router from 'vue-router'
  import { mapState } from 'vuex'

  export default {
    /** Component name */
    name: 'sidebar',

    computed: mapState({
      loggedIn: state => (state.app.session !== 0)
    }),

    /** Toggle small-display */
    toggleSmall: function() {
      this.small = !this.small
    },

    /** Activate link */
    setActive: function(str) {
      this.active = str
    },

    /** Event methods */
    methods: {
      navigate: function(event) {
        this.active = event
        this.$router.replace(event)
      }
    },

    /** Link data */
    data: function() {
      return {
        links: [
          {name: "Dashboard", view: "dashboard", icon: "desktop"},
          {name: "Broadcasters", view: "audio", icon: "microphone"},
          {name: "Map", view: "map", icon: "map-o"},
          {name: "Graphs", view: "graphs", icon: "area-chart"},
          {name: "Combatlog", view: "combatlog", icon: "file-text"},
          {name: "Classes", view: "classes", icon: "clone"},
          {name: "Entities", view: "entities", icon: "cubes"},
          {name: "Stringtables", view: "stringtables", icon: "table"}
        ],
        small: false,
        active: "dashboard"
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  @import '../sass/globals.scss';

  #sidebar {
    // globals for element
    background-color: $color-bg-dark;
    height: 100%;
    position: absolute;
    width: $sidebar-width;
    z-index: 10;

    // navigation
    #nav {
      list-style: none;
      padding: 0px;

      .profile {
        margin: 10px 0 10px 0;
        text-align: center;

        .img {
          width: 60px;
          display: inline-block;
        }

        .spacer {
          border-bottom: 1px solid rgba(255, 255, 255, 0.5);
          width: 50%;
          margin: 7px auto 7px;
        }

        .tags {
          color: #fff;
          font-size: 13px;
          margin-top: 4px;

          span {
            display: inline-block;
            margin: 0 4px 0 4px;
          }
        }
      }

      // List element
      li {
        margin: 0px 0 10px 0;
        padding: 7px;
        line-height: 20px;
        text-align: center;
        cursor: pointer;

        // Font-awesome icon
        span.img {
          color: #fff;
          font-size: 23px;
        }

        // Text
        span.txt {
          font-family: $font-lato;
          font-size: 11px;
          display: block;
          text-decoration: none;
          color: #fff;
        }
      }

      // Hover and click
      li.active, li:hover {
        text-decoration: none;
        border-left: 2px solid $color-dota;
        margin-right: 2px;
      }

      // Small LI sidebar
      li.small {
        margin: 0px 0 0px 0px;
        line-height: 11px;
        text-align: left;

        span.img {
          font-size: 11px;
          margin-right: 5px;
        }
      }

      // Small hover + click
      li.active.small, li.small:hover {
          padding-left: 5px;
      }
    }
  }
</style>
