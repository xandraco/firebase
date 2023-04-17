<template>
  <tablaUsuarios />
</template>

<script>
import tablaUsuarios from '~/components/dash/tabla-usuarios.vue'
export default {
  name: 'IndexPage',
  auth: true,
  components: {
    tablaUsuarios
  },
  layout: 'principal'
}
</script>
