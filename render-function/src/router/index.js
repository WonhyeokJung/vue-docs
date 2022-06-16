import { createRouter, createWebHistory } from 'vue-router'
import HyperScript from '../views/HyperScriptView.vue'
import SlotsView from '../views/SlotsView.vue'
import ParentView from '../views/ParentView.vue'
import SlotProps from '../views/SlotProps.vue'
const routes = [
  {
    path: '/',
    name: 'hyperscript',
    component: HyperScript
  },
  {
    path: '/render',
    name: 'render',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/RenderView.vue')
  },
  {
    path: '/slots',
    name: 'slots',
    component: SlotsView
  },
  {
    path: '/components',
    name: 'components',
    component: ParentView
  },
  {
    path: '/slotprops',
    name: 'slotprops',
    component: SlotProps
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
