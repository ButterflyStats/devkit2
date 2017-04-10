<template>
  <div id="loading">
    <div class="sk-folding-cube">
      <div class="sk-cube1 sk-cube"></div>
      <div class="sk-cube2 sk-cube"></div>
      <div class="sk-cube4 sk-cube"></div>
      <div class="sk-cube3 sk-cube"></div>
    </div>
    <div id="loading-prog" :style="'width: '+perc+'%;'">&nbsp;</div>
    <span id="loading-ptext">{{ text }}</span>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'loading',
    computed: mapState({
      text: state => state.loading.text,
      perc: state => state.loading.perc
    })
  }
</script>

<style scoped lang="scss">
  @import '../sass/globals.scss';
  @import '../sass/cube.scss';

  #loading {
    display: block;
    position: relative;
    top: 45%;
    left: 50%;
    margin-top: -20px;
    margin-left: -50%;
    height: 100px;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: $font-share;

    #loading-prog {
      width: 0px;
      background-color: $color-dota;
      line-height: 2px;
      margin: 5px auto 5px;
    }
  }
</style>
