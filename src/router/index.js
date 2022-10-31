import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', component: () => import('@/views/Home.vue') },
    {
      path: '/generalTree',
      component: () => import('@/views/GeneralTree.vue')
    },
    { path: '/treeFilter', component: () => import('@/views/TreeFilter.vue') },
    { path: '/treeFilter', component: () => import('@/views/TreeFilter.vue') },
    {
      path: '/defaultExpand',
      component: () => import('@/views/DefaultExpand.vue')
    },
    { path: '/customNode', component: () => import('@/views/CustomNode.vue') },
    { path: '/selectNode', component: () => import('@/views/SelectNode.vue') },
    {
      path: '/disableNode',
      component: () => import('@/views/DisableNode.vue')
    },
    { path: '/eventEmit', component: () => import('@/views/EventEmit.vue') }
  ]
})

export default router
