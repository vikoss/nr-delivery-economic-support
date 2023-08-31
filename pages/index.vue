<template>
   <header-base />
  <div style="padding: 8px; text-align: center; max-width: 448px; margin: auto;">
    <h2>
      Selecciona el numero de beneficiarios
    </h2>
    <h3 style="margin-bottom: 32px;">
      Puedes seleccionar hasta 3 beneficiarios
    </h3>
    <v-combobox
      v-model="app.selectNumberOfBeneficiaries"
      clearable
      label="Numero de beneficiarios"
      :items="[{ title: '1', value: '1' }, { title: '2', value: '2' },{ title: '3', value: '3' }]"
    />
    <v-btn
      size="large"
      elevation="8"
      @click="nextStep"
    >
      Siguiente
    </v-btn>
  </div>
</template>

<script>
export default {
  setup() {
    const router = useRouter()
    const app = reactive({
      selectNumberOfBeneficiaries: '',
    })

    const nextStep = () => {
      router.push(`generar-pdf?beneficiarios=${app.selectNumberOfBeneficiaries.value || 1}`)
    }

    return {
      app,
      nextStep,
    }
  }

}
</script>

<style>

</style>