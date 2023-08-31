<template>
  <v-dialog
    width="auto"
  >
    <v-progress-circular v-show="loading" :size="100" color="primary" indeterminate></v-progress-circular>
    <v-card v-show="!loading">
      <v-card-text v-for="(lineBreak, index) in title.split('\n')" :key="index">
        {{ lineBreak }}
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="$emit('close')">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>