<template>
    <div>
      <input type="file" @change="handleUpload" />
    </div>
</template>

<script>
export default {
  name: 'dashboard',
  methods: {
    handleUpload: function(e) {
      var files = e.target.files
      this.$emit('open')
      this.$bf.open(files[0])
    }
  }
}
</script>

<style scoped>
</style>
