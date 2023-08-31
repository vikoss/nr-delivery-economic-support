<template>
  <header-base />
    <div style="padding: 8px; text-align: center; max-width: 448px; margin: auto;">
    <h3 style="font-weight: normal;">
      <strong>Folio</strong>
      {{ app.currentFolio }}
    </h3>
    <h2>
        Selecciona el genero y la talla
      </h2>
      <h3 style="margin-bottom: 32px;">
        Utiliza los selectores para buscar existencias
      </h3>
      <p>
        {{ app.selectedShoes }}
      </p>
      <div>
        <div v-show="['1','2','3'].includes(app.numberBeneficiaries)">
          <h4>Beneficiario 1</h4>
          <v-combobox
            v-model="firstSelectedGender"
            clearable
            label="Genero"
            @update:model-value="onChangeGender('first')"
            :items="[{ title: 'Masculino', value: 'male' }, { title: 'Femenino', value: 'female' }]"
          />
          <v-combobox
            v-model="firstSelectedSize"
            clearable
            label="Talla"
            @update:model-value="onChangeSize"
            :items="firstAvailableSizes"
          />
        </div>
        <div v-show="['2','3'].includes(app.numberBeneficiaries)">
          <h4>Beneficiario 2</h4>
          <v-combobox
            v-model="secondSelectedGender"
            clearable
            label="Genero"
            @update:model-value="onChangeGender('second')"
            :items="[{ title: 'Masculino', value: 'male' }, { title: 'Femenino', value: 'female' }]"
          />
          <v-combobox
            v-model="secondSelectedSize"
            clearable
            label="Talla"
            @update:model-value="onChangeSize"
            :items="secondAvailableSizes"
          />
        </div>
        <div v-show="['3'].includes(app.numberBeneficiaries)">
          <h4>Beneficiario 3</h4>
          <v-combobox
            v-model="thirdSelectedGender"
            clearable
            label="Genero"
            @update:model-value="onChangeGender('third')"
            :items="[{ title: 'Masculino', value: 'male' }, { title: 'Femenino', value: 'female' }]"
          />
          <v-combobox
            v-model="thirdSelectedSize"
            clearable
            label="Talla"
            @update:model-value="onChangeSize"
            :items="thirdAvailableSizes"
          />
        </div>
        <v-btn
          size="large"
          elevation="8"
          @click="generatePDF"
        >
          Generar PDF / Imprimir
        </v-btn>
      </div>
      <modal-base v-model="app.modal.show" :loading="app.modal.loading" :title="app.modal.title" @close="app.modal.show = false" />
    </div>

    <div v-show="false">
      <div id="pdf-template">
        <div style="border: 1px solid black; padding: 8px; margin: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-evenly; margin-bottom: 40px;">
            <h1>
              Folio
              <strong>
                {{ app.currentFolio }}
              </strong>
            </h1>
            <img src="@/assets/logos/logo.png" alt="logo" style="height: 128px;">
          </div>
          <div style="display: flex; justify-content: space-evenly; text-align: center;">
            <div v-show="['1','2','3'].includes(app.numberBeneficiaries)">
              <h3>
                Zapato
              </h3>
              <p>{{ firstSelectedGender?.title }}</p>
              <br>
              <h3>
                Talla
              </h3>
              <p>{{ firstSelectedSize?.title }}</p>
            </div>
            <div v-show="['2','3'].includes(app.numberBeneficiaries)">
              <h3>
                Zapato
              </h3>
              <p>{{ secondSelectedGender?.title }}</p>
              <br>
              <h3>
                Talla
              </h3>
              <p>{{ secondSelectedSize?.title }}</p>
            </div>
            <div v-show="['3'].includes(app.numberBeneficiaries)">
              <h3>
                Zapato
              </h3>
              <p>{{ thirdSelectedGender?.title }}</p>
              <br>
              <h3>
                Talla
              </h3>
              <p>{{ thirdSelectedSize?.title }}</p>
            </div>
          </div>
        </div>
        <div style="border: 1px solid black; padding: 8px; margin-top: 60px;">
          <div style="display: flex; align-items: center; justify-content: space-evenly; margin-bottom: 40px;">
            <h1>
              Folio
              <strong>
                {{ app.currentFolio }}
              </strong>
            </h1>
            <img src="@/assets/logos/logo.png" alt="logo" style="height: 128px;">
          </div>
          <div style="display: flex; justify-content: space-evenly; text-align: center;">
            <div v-show="['1','2','3'].includes(app.numberBeneficiaries)">
              <h3>
                Zapato
              </h3>
              <p>{{ firstSelectedGender?.title }}</p>
              <br>
              <h3>
                Talla
              </h3>
              <p>{{ firstSelectedSize?.title }}</p>
            </div>
            <div v-show="['2','3'].includes(app.numberBeneficiaries)">
              <h3>
                Zapato
              </h3>
              <p>{{ secondSelectedGender?.title }}</p>
              <br>
              <h3>
                Talla
              </h3>
              <p>{{ secondSelectedSize?.title }}</p>
            </div>
            <div v-show="['3'].includes(app.numberBeneficiaries)">
              <h3>
                Zapato
              </h3>
              <p>{{ thirdSelectedGender?.title }}</p>
              <br>
              <h3>
                Talla
              </h3>
              <p>{{ thirdSelectedSize?.title }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import HeaderBase from '@/components/HeaderBase.vue'
import ModalBase from '@/components/ModalBase.vue'
import { getDocs, doc, collection, deleteDoc, updateDoc } from 'firebase/firestore'
import { jsPDF } from "jspdf"
import { getDoc } from 'firebase/firestore'

export default {
  components: { HeaderBase, ModalBase },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const nuxtApp = useNuxtApp()

    // Select's
    const firstSelectedGender = ref('')
    const firstSelectedSize = ref('')
    const firstAvailableSizes = computed(() => {
      return app.shoes.filter((shoe) => {
        if (shoe.selected) {
          return false
        }
        if (shoe.gender === firstSelectedGender.value?.value) {
          return true
        }
        return false
      }).map((shoe) => ({ title: shoe.size, value: shoe })).sort((a, b) => {
        if (Number(a.title) > Number(b.title)) {
          return 1
        }
        if (Number(a.title) < Number(b.title)) {
          return -1
        }
        return 0
      })
    })
    const secondSelectedGender = ref('')
    const secondSelectedSize = ref('')
    const secondAvailableSizes = computed(() => {
      return app.shoes.filter((shoe) => {
        if (shoe.selected) {
          return false
        }
        if (shoe.gender === secondSelectedGender.value?.value) {
          return true
        }
        return false
      }).map((shoe) => ({ title: shoe.size, value: shoe })).sort((a, b) => {
        if (Number(a.title) > Number(b.title)) {
          return 1
        }
        if (Number(a.title) < Number(b.title)) {
          return -1
        }
        return 0
      })
    })
    const thirdSelectedGender = ref('')
    const thirdSelectedSize = ref('')
    const thirdAvailableSizes = computed(() => {
      return app.shoes.filter((shoe) => {
        if (shoe.selected) {
          return false
        }
        if (shoe.gender === thirdSelectedGender.value?.value) {
          return true
        }
        return false
      }).map((shoe) => ({ title: shoe.size, value: shoe })).sort((a, b) => {
        if (Number(a.title) > Number(b.title)) {
          return 1
        }
        if (Number(a.title) < Number(b.title)) {
          return -1
        }
        return 0
      })
    })
    const app = reactive({
      shoes: [],
      numberBeneficiaries: route.query.beneficiarios,
      currentFolio: null,
      modal: {
        title: '',
        show: true,
        loading: true,
      },
    })

    const onChangeGender = (select) => {
      if (select === 'first') {
        firstSelectedSize.value = ''
      }
      if (select === 'second') {
        secondSelectedSize.value = ''
      }
      if (select === 'third') {
        thirdSelectedSize.value = ''
      }
    }
    const onChangeSize = (value) => {
      // set as selected
      if (value?.value?.id) {
        const index = app.shoes.findIndex((shoe) => shoe.id === value.value.id)
        app.shoes[index] = { ...value.value, selected: true }
        return
      }
      // reset all select's sizes
      const arrayShoes = app.shoes
      app.shoes = arrayShoes.map((shoe) => ({ ...shoe, selected: false }))
      firstSelectedSize.value = ''
      secondSelectedSize.value = ''
      thirdSelectedSize.value = ''
    }
    const createArrayDummy = (total) => {
      const arrayTotal = []
      for (let index = 0; index < Number(total); index++) {
        arrayTotal.push(index)
      }
      return arrayTotal
    }

    const generatePDF = () => {
      if (firstSelectedSize.value === '') {
        app.modal.title = 'Antes debes seleccionar el genero y talla'
        app.modal.show = true
        return
      }
      const htmlTemplate = document.getElementById('pdf-template')
      const documentJS = new jsPDF()
      documentJS.html(htmlTemplate, {
        callback: async function(document) {
          app.modal.loading = true
          app.modal.show = true
          // remove stock
          if (firstSelectedSize.value !== '') {
            await removeShoesStock(firstSelectedSize.value.value.id)
          }
          if (secondSelectedSize.value !== '') {
            await removeShoesStock(secondSelectedSize.value.value.id)
          }
          if (thirdSelectedSize.value !== '') {
            await removeShoesStock(thirdSelectedSize.value.value.id)
          }
          await increaseFolio()
          // generate PDF to print
          document.autoPrint()
          document.output('dataurlnewwindow')
          app.modal.loading = false
          app.modal.show = false
          // redirect
          router.push('/')
        },
        margin: [10, 10, 10, 10],
        autoPaging: 'text',
        x: 0,
        y: 0,
        width: 190, //target width in the PDF document
        windowWidth: 675 //window width in CSS pixels
      })
    }
    const counterRef = doc(nuxtApp.$firestore, 'counter', 'init')
    const shoesRef = collection(nuxtApp.$firestore, 'shoes')

    const removeShoesStock = async (shoeId) => {
      await deleteDoc(doc(nuxtApp.$firestore, 'shoes', shoeId))
      console.log(`remove shoe: ${shoeId}`)
    }

    const getShoes = async () => {
      const results = await getDocs(shoesRef)
      const sizes = []
      results.forEach(doc => sizes.push( doc.data() ))
      app.shoes = sizes
      console.log('shoes:', app.shoes)
      app.modal.show = false
      app.modal.loading = false
      showStock()
    }
    const showStock = () => {
      const shoes = app.shoes
      const totalStock = shoes.length
      const genderMaleStock = shoes.filter((shoe) => shoe.gender === 'male').length
      const genderFemaleStock = shoes.filter((shoe) => shoe.gender === 'female').length
      app.modal.show = true
      app.modal.title = `Total existencias: ${totalStock}\nTotal zapatos masculinos: ${genderMaleStock}\nTotal zapatos femeninos: ${genderFemaleStock}`
    }
    // FOLIOS
    const increaseFolio = async () => {
      const value = app.currentFolio + 1
      await updateDoc(counterRef, { value })
      console.log(`increase folio: ${value}`)
    }
    const getCurrentFolio = async () => {
      const counterSnap = await getDoc(counterRef)
      app.currentFolio = counterSnap.data().value
    }

    getCurrentFolio()
    getShoes()

    return {
      app,
      generatePDF,
      // Selector's
      firstSelectedGender,
      firstSelectedSize,
      firstAvailableSizes,
      secondSelectedGender,
      secondSelectedSize,
      secondAvailableSizes,
      thirdSelectedGender,
      thirdSelectedSize,
      thirdAvailableSizes,
      // events
      onChangeGender,
      onChangeSize,

    }
  },
}
</script>