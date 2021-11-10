import gsap from 'gsap';
import { CSSPlugin, Draggable, InertiaPlugin, SlowMo, SplitText } from 'gsap/all';
import Vue from 'vue';
import { Route } from 'vue-router';
import App from './App.vue';
import './less/index.less';
import router from './router';
import store from './store';
import Config from './utils/Config';

gsap.registerPlugin(Draggable, InertiaPlugin, CSSPlugin, SlowMo, SplitText);
Vue.config.productionTip = false;
Config.init();

router.beforeEach(async (to: Route, from: Route, next: Function) => {

	if(!store.state.initialized) {
		store.dispatch("startApp");
	}

	next();
});

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
