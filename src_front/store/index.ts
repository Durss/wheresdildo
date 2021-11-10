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
		levels: [
			{
				picture: "level1.jpg",
				items:[
					{f:false, x:998, y:55, w:56, h:43, i:10},
					{f:false, x:2811, y:1475, w:40, h:82, i:11},
					{f:false, x:588, y:1158, w:68, h:65, i:12},
					{f:false, x:3008, y:352, w:56, h:105, i:13},
					{f:false, x:3128, y:1222, w:33, h:76, i:14},
				]
			},
			{
				picture: "level2.jpg",
				items:[
					{f:false, x:2984, y:1844, w:47, h:52, i:3},
					{f:false, x:2080, y:543, w:54, h:18, i:7},
					{f:false, x:998, y:55, w:56, h:43, i:10},
					{f:false, x:2811, y:1475, w:40, h:82, i:11},
					{f:false, x:588, y:1158, w:68, h:65, i:12},
					{f:false, x:3008, y:352, w:56, h:105, i:13},
					{f:false, x:3128, y:1222, w:33, h:76, i:14},
				]
			},
			{
				picture: "level3.jpg",
				items:[
					{f:false, x:802, y:2249, w:145, h:176, i:1},
					{f:false, x:763, y:1374, w:109, h:42, i:2},
					{f:false, x:3575, y:2122, w:76, h:81, i:3},
					{f:false, x:2780, y:1508, w:66, h:141, i:4},
					{f:false, x:4317, y:1931, w:105, h:118, i:5},
					{f:false, x:3862, y:792, w:39, h:87, i:6},
					{f:false, x:3646, y:2704, w:50, h:107, i:7},
					{f:false, x:2532, y:1389, w:82, h:40, i:8},
					{f:false, x:684, y:569, w:69, h:70, i:9},
				]
			}
		]
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
