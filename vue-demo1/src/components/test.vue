<template>
  <div class="test">
    <h2>子组件：</h2>
     hello {{ name }}  {{count}}
  </div>
</template>

<script>
export default {
  name: 'Test',
  props: {
    name: [String, Object]
  },
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}
</script>

<style>

</style>
