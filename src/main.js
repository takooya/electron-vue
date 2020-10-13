import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueLazyload from 'vue-lazyload'

Vue.use(ElementUI)
Vue.use(VueLazyload, {
    preLoad: 1.3,
    attempt: 1,   // 加载图片数量
    listenEvents: ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove']
})

Vue.config.productionTip = false

//const demoCpp = require("../build/Release/democpp.node")
//const demoCpp = require('addon')

new Vue({
    render: h => h(App),
}).$mount('#app')
