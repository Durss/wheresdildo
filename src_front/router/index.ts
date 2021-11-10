import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '@/views/Home.vue'
import Game from '@/views/Game.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
	{
		path: '/',
		name: 'home',
		component: Home,
		meta:{
			noTwitch:true,
		}
	},
	{
		path: '/play',
		name: 'play',
		component: Game,
		meta:{
			noTwitch:true,
		}
	},
	{
		path: "*",
		redirect:to => {
			return {name:"home"};
		}
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router