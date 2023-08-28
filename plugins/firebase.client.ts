import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

export default defineNuxtPlugin(nuxtApp => {
    //const config = useRuntimeConfig()
    //config.FB_API_KEY

    const firebaseConfig = {
        apiKey: "AIzaSyD9-nSizVoKw2TBQ6ByCsBc00Ewetr4_KI",
        authDomain: "nr-delivery-economic-support.firebaseapp.com",
        projectId: "nr-delivery-economic-support",
        storageBucket: "nr-delivery-economic-support.appspot.com",
        messagingSenderId: "728682719549",
        appId: "1:728682719549:web:4f4bda4f94c572d3d3bd54",
    };

    const app = initializeApp(firebaseConfig)

    const firestore = getFirestore(app)

    nuxtApp.vueApp.provide('firestore', firestore)
    nuxtApp.provide('firestore', firestore)
    console.log(firestore, 'firestore');
    

    nuxtApp.vueApp.provide('hello', console.log('hey'))

})
