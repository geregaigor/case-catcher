import { createApp } from 'vue';


// import 'vuetify/styles/main.css';
import './style.scss';

//import './style.scss';
// import './materialdesignicons.min.css';


// Vuetify
import { createVuetify } from 'vuetify';
import App from '@content/app';

const appDiv = document.createElement('div');
appDiv.id = 'app';
appDiv.textContent = 'Loading...';
document.body.append(appDiv);



var app = createApp(App);
const vuetify = createVuetify({ theme: { defaultTheme: 'light' } });
app.use(vuetify);
app.mount("#app");

console.log('content script loaded!!!!');