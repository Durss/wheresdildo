import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		initialized: false,
		confirm:{
			title:null,
			description:null,
			confirmCallback:null,
			cancelCallback:null,
			yesLabel:null,
			noLabel:null,
		},
	},
	mutations: {


		confirm(state, payload) { state.confirm = payload; },
	},
	actions: {
		async startApp({ state, commit, dispatch }, payload) { 
			
			// let res = await PubSub.instance.getSubsList("29961813");
			// console.log(res);
			this.state.initialized = true;
			return true;
		},


		confirm({commit}, payload) { commit("confirm", payload); },
	},
})
