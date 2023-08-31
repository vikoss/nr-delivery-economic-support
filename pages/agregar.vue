<template>
  <div>
    <v-text-field v-model="app.gender" label="Genero"></v-text-field>
    <v-text-field v-model="app.size" label="Talla"></v-text-field>
    <v-text-field v-model="app.total" label="Total"></v-text-field>
    <v-btn @click="saveShoes">
      Button
    </v-btn>
  </div>
</template>

<script>
import { doc, setDoc } from 'firebase/firestore'
export default {
  setup() {
    const nuxtApp = useNuxtApp()
    const app = reactive({
      gender: '',
      size: '',
      total: '',
    })
    const saveShoes = async () => {
      const arrayTotal = []
      for (let index = 0; index < Number(app.total); index++) {
        arrayTotal.push(index)
      }
      await Promise.all(
        arrayTotal.map(async () => {
          const uuid = crypto.randomUUID()
          console.log(uuid)
          return await setDoc(doc(nuxtApp.$firestore, 'shoes', uuid), {
            id: uuid,
            gender: app.gender,
            size: app.size,
          })
        })
      )
    }

    return {
      saveShoes,
      app,
    }
  }
}
</script>