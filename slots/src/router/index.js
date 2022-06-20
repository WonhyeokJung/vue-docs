import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DefaultSlot from '../views/DefaultSlot.vue'
import SlotDefaultValue from '../views/SlotDefaultValue.vue'
import NamedSlot from '../views/NamedSlot'
import DynamicSlotName from '../views/DynamicSlotNames.vue'
import SlotProps from '../views/SlotProps'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/default',
    name: 'default',
    component: DefaultSlot
  },
  {
    path: '/dupl',
    name: 'duplicatedSlotsParent',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/DuplicatedSlotsParent.vue')
  },
  {
    path: '/defvalue',
    name: 'slotDefaultValue',
    component: SlotDefaultValue
  },
  {
    path: '/namedslot',
    name: 'namedSlot',
    component: NamedSlot
  },
  {
    path: '/dynamicname',
    name: 'dynamicName',
    component: DynamicSlotName
  },
  {
    path: '/slotprops',
    name: 'slotProps',
    component: SlotProps
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
