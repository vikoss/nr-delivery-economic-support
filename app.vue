<template>
  <div>
    <header-base />
    <div style="padding: 8px; text-align: center; max-width: 448px; margin: auto;">
      <h2>
        Selecciona el genero y la talla
      </h2>
      <h3 style="margin-bottom: 32px;">
        Utiliza los selectores para buscar existencias
      </h3>
      <!--div style="display: flex; flex-direction: column; align-items: center;"-->
      <div>
        <v-combobox
          v-model="app.selectGender"
          clearable
          label="Genero"
          :items="[{ title: 'Masculino', value: 'male' }, { title: 'Femenino', value: 'female' }]"
        />
        <v-combobox
          v-model="app.selectShoeSizes"
          clearable
          label="Talla"
          :items="app.shoeSizes"
        />
        <v-btn
          size="large"
          elevation="8"
          @click="generatePDF"
        >
          Generar PDF / Imprimir
        </v-btn>
        <!--v-progress-circular model-value="20" :size="63" :width="5"></v-progress-circular-->
      </div>
      <v-dialog
        v-model="app.dialog"
        width="auto"
      >
        <v-card>
          <v-card-text>
            Antes debes seleccionar el genero y la talla.
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" block @click="app.dialog = false">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
          <div style="display: flex; justify-content: space-evenly;">
            <h3 style="text-align: center;">
              Zapato
              <br>
              {{ app.selectGender?.title }}
            </h3>
            <h3 style="text-align: center;">
              Talla
              <br>
              {{ app.selectShoeSizes?.value?.size }}
            </h3>
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
          <div style="display: flex; justify-content: space-evenly;">
            <h3 style="text-align: center;">
              Zapato
              <br>
              {{ app.selectGender?.title }}
            </h3>
            <h3 style="text-align: center;">
              Talla
              <br>
              {{ app.selectShoeSizes?.value?.size }}
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import HeaderBase from './components/HeaderBase.vue'
import { getDocs, doc, collection, deleteDoc, updateDoc } from 'firebase/firestore'
import { jsPDF } from "jspdf"

export default {
  components: { HeaderBase },
  setup() {
    const app = reactive({
      currentFolio: null,
      currentFolioId: null,
      allShoeSizes: [],
      counter: '',
      selectShoeSizes: '',
      selectGender: '',
      shoeSizes: computed(() => app.allShoeSizes.filter(size => {
        console.log(size)
        return size.value.gender === app.selectGender.value
      })),
      dialog: false,
    })
    //const dialog = ref(false)
    const nuxtApp = useNuxtApp()
    const shoeSizesRef = collection(nuxtApp.$firestore, 'shoeSizes')
    const counterRef = collection(nuxtApp.$firestore, 'counter')
    const getShoeSizes = async () => {
      const results = await getDocs(shoeSizesRef)
      const sizes = []
      results.forEach(doc => sizes.push({ value: doc.data(), title: doc.data().size }))
      console.log(app.allShoeSizes);
      app.allShoeSizes = sizes
    }
    const getCounter = async () => {
      const q = await getDocs(counterRef)
      const init = []
      q.forEach(doc => init.push(doc.data()))
      app.currentFolio = init[0].init++
      app.currentFolioId = init[0].id
    }
    getCounter()
    const pdfTemplate = ref(null)
    const generatePDF = () => {
      if (app.selectShoeSizes == '' || app.selectGender == '') {
        app.dialog = true
        return
      }
      const htmlTemplate = document.getElementById('pdf-template')
      const documentJS = new jsPDF()
      documentJS.html(htmlTemplate, {
        callback:  async function(document) {
          document.autoPrint()
          document.output('dataurlnewwindow')
          await deleteDoc(doc(nuxtApp.$firestore, 'shoeSizes', app.selectShoeSizes.value.id))
          await updateDoc(doc(nuxtApp.$firestore, 'counter', app.currentFolioId), { id: app.currentFolioId, init: app.currentFolio++ })
          app.selectShoeSizes = ''
          app.selectGender = ''
          getShoeSizes()
        },
        margin: [10, 10, 10, 10],
        autoPaging: 'text',
        x: 0,
        y: 0,
        width: 190, //target width in the PDF document
        windowWidth: 675 //window width in CSS pixels
      })
    }
    getShoeSizes()
    return {
      //dialog,
      app,
      pdfTemplate,
      generatePDF,
    }
  },
}
</script>
