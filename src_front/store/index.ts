import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		initialized: false,
		tooltip: null,
		levels: [
			{
				picture: "level1.jpg",
				items:[
					{f:false, x:1987, y:501, w:36, h:42, i:5},
					{f:false, x:2061, y:106, w:31, h:51, i:7},
					{f:false, x:392, y:698, w:15, h:57, i:10},
					{f:false, x:2738, y:1734, w:67, h:71, i:11},
					{f:false, x:1108, y:955, w:53, h:82, i:13},
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
					{f:false, x:820, y:2251, w:94, h:163, i:1},
					{f:false, x:778, y:1375, w:102, h:46, i:2},
					{f:false, x:3575, y:2122, w:76, h:81, i:3},
					{f:false, x:2783, y:1506, w:73, h:160, i:4},
					{f:false, x:4415, y:2004, w:90, h:103, i:5},
					{f:false, x:3859, y:794, w:36, h:86, i:6},
					{f:false, x:3646, y:2704, w:50, h:107, i:7},
					{f:false, x:2505, y:1387, w:106, h:43, i:8},
					{f:false, x:684, y:569, w:69, h:70, i:9},
				]
			},
			{
				picture: "level4.jpg",
				items:[
					{f:false, x:1017, y:1001, w:43, h:76, i:1},
					{f:false, x:1610, y:986, w:45, h:98, i:2},
					{f:false, x:301, y:1549, w:16, h:40, i:3},
					{f:false, x:1916, y:1405, w:88, h:33, i:4},
					{f:false, x:270, y:1063, w:37, h:41, i:5},
					{f:false, x:1478, y:1417, w:22, h:52, i:6},
					{f:false, x:2544, y:1057, w:28, h:60, i:7},
					{f:false, x:1709, y:984, w:40, h:81, i:8},
					{f:false, x:2708, y:1447, w:38, h:39, i:9},
					{f:false, x:786, y:1372, w:16, h:64, i:10},
					{f:false, x:2458, y:572, w:67, h:42, i:11},
					{f:false, x:485, y:1765, w:15, h:33, i:12},
					{f:false, x:802, y:573, w:40, h:26, i:13},
					{f:false, x:1963, y:1909, w:49, h:117, i:14},
				]
			}
		]
	},
	mutations: {
		openTooltip(state, payload) { state.tooltip = payload; },
		
		closeTooltip(state) { state.tooltip = null; },
	},
	actions: {
		async startApp({ state, commit, dispatch }, payload) { 
			
			// let res = await PubSub.instance.getSubsList("29961813");
			// console.log(res);
			this.state.initialized = true;
			return true;
		},

		openTooltip({commit}, payload) { commit("openTooltip", payload); },
		
		closeTooltip({commit}) { commit("closeTooltip", null); },
	},
})
