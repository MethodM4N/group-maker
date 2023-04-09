import Vue from 'vue';
import VueRouter from 'vue-router';
import About from '@/pages/About.vue';
import Main from '@/pages/Main.vue';
import VuejsDialog from 'vuejs-dialog';

Vue.use(VueRouter);
Vue.use(VuejsDialog);

const routes = [
  {
    path: '/',
    name: 'home',
    component: About,
  },
  {
    path: '/main',
    name: 'main',
    component: Main,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
