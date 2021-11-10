
<template>
	<div id="app" class="app">
		<router-view class="view" v-if="loadComplete" />
		<Confirm />
		<Footer />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Footer from "./components/Footer.vue";
import Confirm from "./views/Confirm.vue";

@Component({
	components:{
		Confirm,
		Footer,
	}
})
export default class App extends Vue {

	public loadCount:number = 0;
	public loadComplete:boolean = false;
	public showNotConnected:boolean = false;
	private preloadedFiles:string[] = [];
	private timeoutStuckCheck:number;

	public async mounted():Promise<void> {
		
		//Preload elements
		let preloaders = [require.context("@/assets/icons/"), require.context("@/assets/images/objects"), require.context("@/assets/fonts/")];
		for (let i = 0; i < preloaders.length; i++) {
			preloaders[i].keys().forEach(file => {
				let el:any = preloaders[i](file);
				this.preloadedFiles.push(el);
				let loader:any;
				if(/\.ttf$/gi.test(file)){
					//@ts-ignore
					loader = new FontFace("FontTMP"+i, "url("+el+")");
					loader.load().then(_=> {
						this.onLoadComplete();
					});
				}else{
					loader = new Image();
					loader.src = el;
					loader.addEventListener("error", (e)=> {
						console.error("Loading image failed ! error");
						console.log(file);
						console.log(e);
					})
					loader.addEventListener("abort", (e)=> {
						console.error("Loading image failed ! abort");
						console.log(e);
					})
					loader.addEventListener("stalled", (e)=> {
						// console.error("Loading image failed ! stalled");
						// console.log(e);
					})
					loader.addEventListener("load",(e)=> {
						// console.log("IMAGE OK");
						this.onLoadComplete();
					})
				}
			});
		}
	}

	public onLoadComplete():void {
		clearTimeout(this.timeoutStuckCheck);
		this.loadCount++;
		let total = this.preloadedFiles.length;
		if(this.loadCount >= total) {
			this.loadComplete = true;
			return;
		}

		//Avoid getting stuck if a loading never ends
		this.timeoutStuckCheck = setTimeout(_=> {
			console.log("Loading stuck at", this.loadCount +"/"+ total);
			this.loadCount = total-1;
			this.onLoadComplete();
		}, 2000)
	}

}
</script>

<style scoped lang="less">
.app{
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: @mainColor_dark;
	width: 100vw;
	height: 100vh;
	overflow: hidden;

	.view {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}
}
</style>