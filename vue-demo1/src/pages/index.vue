<template>
  <div class="index">
    index {{ msg }}-{{count}}
    <test :name="name"/>
  </div>
</template>

<script>
import test from '../components/test.vue'
export default {
  name: 'Index',
  data () {
    return {
      msg: '测试组件通信',
      name: 'xiaoming'
    }
  },
  created () {

  },
  computed: {
    count () {
      return this.$store.state.count
    }
  },
  mounted () {
  },
  components: {
    test
  }
}
</script>

<style>
  .index {

  }
</style>
