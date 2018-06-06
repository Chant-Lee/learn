<template>
  <div class="index">
    index {{ msg }} {{count}}
    <button @click="add">增加</button>
    <button @click="less">--</button>
    <button @click="asyncAdd">异步增加</button>
    <button @click="asyncLess">异步--</button>
    <Test :name="name"/>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'

import Test from '../components/test.vue'

export default {
  name: 'Index',
  data () {
    return {
      msg: '测试组件通信',
      name: 'xiaoming'
    }
  },
  computed: {
    count () {
      return this.$store.state.count
    }
  },
  methods: {
    add () {
      this.$store.commit('increment')
    },
    ...mapMutations({
      // 将 `this.less()` 映射为 `this.$store.commit('lessCount')`
      less: 'lessCount'
    }),
    asyncLess () {
      this.$store.dispatch('asyncLessCount')
    },
    ...mapActions({
      asyncAdd: 'asyncIncrement'
    })
  },
  components: {
    Test
  }
}
</script>

<style>
  .index {

  }
</style>
