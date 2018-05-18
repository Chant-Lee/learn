<template>
  <div class="test">
     hello {{ name }}
  </div>
</template>

<script>
export default {
  name: 'Test',
  props: {
    name: [String, Object]
  }
}
</script>

<style>

</style>
