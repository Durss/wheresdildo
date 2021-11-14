<template>
	<div class="home">
		<div class="menu" ref="menu">
			<div class="title" ref="title">
				<div>WHERE'S</div>
				<div class="red">DILDO?</div>
			</div>
			
			<div class="levels">
				<Button class="startBt" title="Level1" @click="preloadLevel(1)" ref="startBt1" />
				<Button class="startBt" title="Level2" @click="preloadLevel(2)" ref="startBt2" />
				<Button class="startBt" title="Level3" @click="preloadLevel(3)" ref="startBt3" />
				<Button class="startBt" title="Level4" @click="preloadLevel(4)" ref="startBt4" v-if="showLevel4" />
			</div>
			
			<div class="loader" v-if="loading">Loading level...</div>

			<div class="error" v-if="error" @click="error=null">Woops...loading has failed :(</div>
		</div>

		<img src="@/assets/images/logo.png" alt="logo" ref="logo" class="logo">
	</div>
</template>

<script lang="ts">
import Button from "@/components/Button.vue";
import Utils from "@/utils/Utils";
import gsap, { SplitText } from "gsap/all";
import { Component, Vue } from "vue-property-decorator";

@Component({
	components:{
		Button,
	}
})
export default class Home extends Vue {

	public loading:boolean = false;
	public error:boolean = false;
	public showLevel4:boolean = false;
	
	public async mounted():Promise<void> {
		this.showLevel4 = Date.now() >= new Date("Sat Nov 20 2021 18:00:00 GMT+0100").getTime();
		// this.showLevel4 = Date.now() >= new Date("Sun Nov 14 2021 23:48:12 GMT+0100").getTime();
		await this.$nextTick();
		let mySplitText = new SplitText(this.$refs.title, { type: "chars,words" });
		gsap.from(this.$refs.menu, {duration:1, y:200, opacity:0, ease:"back.out"});
		let delay = .5;
		for(let i = 0; i < mySplitText.chars.length; i++) {
			const c = mySplitText.chars[i];
			// gsap.from(c, {duration:2, delay:i*.05, scale:0, rotate:Math.random()*180-90, ease:"elastic.out(2,.5)"});
			let rotate = Math.random()*10 + 30;
			if(Math.random() > .5) rotate *= -1;
			delay += .05
			gsap.from(c, {duration:1, scale:.8, rotate, opacity:0, delay, y:50, ease:"elastic.out"});
		}
		
		let levelsCount = document.getElementsByClassName("startBt").length;
		for (let i = 0; i < levelsCount; i++) {
			let bt = (this.$refs["startBt"+(i+1)] as Vue).$el;
			gsap.from(bt, {duration:1.5, delay, scaleX:.5, ease:"elastic.out(1.5,.25)"});
			gsap.from(bt, {duration:1.5, delay:delay+.1, scaleY:.5, ease:"elastic.out(1.5,.25)"});
			gsap.from(bt, {duration:.5, delay:delay+.1, y:0, opacity:0, rotate:35, ease:"back.out"});
			delay += .15;
		}
		gsap.to(this.$refs.logo, {duration:delay, bottom:-15, delay:2, ease:"sine.inOut"});
	}

	public beforeDestroy():void {
		
	}

	public play(level:number):void {
		gsap.killTweensOf(this.$refs.logo);
		gsap.killTweensOf(this.$refs.menu);
		
		gsap.to(this.$refs.logo, {duration:.5, bottom:-500, ease:"sine.inOut"});
		gsap.to(this.$refs.menu, {duration:.5, scale:0, ease:"back.in"});
		
		setTimeout(() => {
			this.$router.push("/play/"+level);
		}, 500);
	}

	public async preloadLevel(level:number):Promise<void> {
		this.error = false;
		let bt = (this.$refs["startBt"+level] as Vue).$el;
		gsap.killTweensOf(bt);
		gsap.set(bt, {scaleX:1, scaleY:1, rotate:0, opacity:1});
		gsap.from(bt, {duration:1, scaleX:1.2, ease:"elastic.out(1.5,.25)"});
		gsap.from(bt, {duration:1, scaleY:1.2, ease:"elastic.out(1.5,.25)"});
		
		// await Utils.promisedTimeout(250);

		// for (let i = 0; i < 3; i++) {
		// 	let bt = (this.$refs["startBt"+(i+1)] as Vue).$el;
		// 	gsap.to(bt, {duration:.5, delay:i*.1, scale:0, ease:"back.in"});
		// }

		this.loading = true;
		await Utils.promisedTimeout(250);

		let loader = new Image();
		let ctx = require.context("@/assets/images/");
		let file = ctx.keys().find(v => v.indexOf("level"+level) > -1);
		
		let url;
		try { url = ctx(file); }catch(error){};
		loader.src = url;
		loader.addEventListener("error", (e)=> {
			console.error("Loading image failed ! error");
			console.log(e);
			this.loading = false;
			this.error = true;
		})
		loader.addEventListener("abort", (e)=> {
			console.error("Loading image failed ! abort");
			console.log(e);
			this.loading = false;
			this.error = true;
		})
		loader.addEventListener("stalled", (e)=> {
			// console.error("Loading image failed ! stalled");
			// console.log(e);
		})
		loader.addEventListener("load",(e)=> {
			// console.log("IMAGE OK");
			this.play(level);
		})
	}

}

</script>

<style scoped lang="less">
.home{
	.menu {
		padding-bottom: 30px;

		&::before {
			content:"";
			position: absolute;
			top: -20px;
			left: -15px;
			width: 122px;
			height: 85px;
			transform-origin: top left;
			transform: scale(.5);
			background-image: url("../assets/images/hat.png");
		}

		.title {
			font-family: "Optima-ExtraBlack";
			// font-size: min(40px, 17vw);
			font-size: 12vh;
			text-align: center;
			color: #1da6d7;
			-webkit-text-stroke: 4px #2c2c2c;
			text-shadow: -7px 7px 0px #2c2c2c5e;
			* {
				white-space: nowrap;
			}
			.red {
				color: #e63831;
			}
		}

		.loader {
			margin-top: 20px;
			color: @mainColor_normal;
			font-weight: bold;
		}

		.error {
			margin-top: 20px;
			color: @mainColor_highlight;
			font-weight: bold;
		}

		.levels {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-evenly;
	
			.startBt {
				font-size: 1.5em;
				color: #fff;
				background-color: @mainColor_highlight;
				padding: 15px 30px;
				border-radius: 50px;
				margin-top: 20px;
				transition: background-color .5s;
				&:hover {
					background-color: @mainColor_highlight_light;
				}
			}
		}
	}

	.logo {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		@ratio: .7;
		height: 646px * @ratio;
		bottom: -515px * @ratio;
	}


	@media only screen 
	and (min-device-width : 320px) 
	and (max-device-width : 480px) {
		.menu {
			width: 90vw;
			border-width: 2px;
			.title {
				font-size: 17vw;
				-webkit-text-stroke: 3px #444444;
				text-shadow: -6px 6px 0px #2c2c2c5e;
			}

			.levels {
				.startBt {
					font-size: 1.5em;
					color: #fff;
					background-color: @mainColor_highlight;
					padding: 10px 20px;
				}
			}
		}
		.logo {
			@ratio: .45;
			height: 646px * @ratio;
			bottom: -515px * @ratio;
			// bottom: -290px;
		}
	}
}
</style>