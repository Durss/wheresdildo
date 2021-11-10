<template>
	<div class="home">
		<div class="menu" ref="menu">
			<div class="title" ref="title">
				<div>WHERE'S</div>
				<div class="red">DILDO?</div>
			</div>
			<Button class="startBt" title="Play" @click="play()" ref="startBt" />
		</div>
		<img src="@/assets/images/logo.png" alt="logo" ref="logo" class="logo">
	</div>
</template>

<script lang="ts">
import Button from "@/components/Button.vue";
import gsap, { SplitText } from "gsap/all";
import { Component, Vue } from "vue-property-decorator";

@Component({
	components:{
		Button,
	}
})
export default class Home extends Vue {

	
	public mounted():void {
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
		let bt = (this.$refs.startBt as Vue).$el;
		gsap.from(bt, {duration:1.5, delay, scaleX:.5, ease:"elastic.out(1.5,.25)"});
		gsap.from(bt, {duration:1.5, delay:delay+.1, scaleY:.5, ease:"elastic.out(1.5,.25)"});
		gsap.from(bt, {duration:.5, delay:delay+.1, y:0, opacity:0, rotate:35, ease:"back.out"});
		gsap.to(this.$refs.logo, {duration:delay, bottom:-20, delay:2, ease:"sine.inOut"});
	}

	public beforeDestroy():void {
		
	}

	public play():void {
		let bt = (this.$refs.startBt as Vue).$el;
		gsap.killTweensOf(bt);
		gsap.killTweensOf(this.$refs.logo);
		gsap.killTweensOf(this.$refs.menu);

		gsap.set(bt, {scaleX:1, scaleY:1, rotate:0, opacity:1});
		gsap.from(bt, {duration:1, scaleX:1.2, ease:"elastic.out(1.5,.25)"});
		gsap.from(bt, {duration:1, scaleY:1.2, ease:"elastic.out(1.5,.25)"});
		
		gsap.to(this.$refs.logo, {duration:.5, bottom:-500, ease:"sine.inOut"});
		gsap.to(this.$refs.menu, {duration:.5, scale:0, ease:"back.in"});
		
		setTimeout(_=> {
			this.$router.push("/play");
		}, 500)
	}

}

</script>

<style scoped lang="less">
.home{
	width: 100vw;
	height: 100vh;
	// opacity: 0;
	overflow: hidden;

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
			font-size: 15vh;
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

		.startBt {
			font-size: 2em;
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

	.logo {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		@ratio: .75;
		height: 581px * @ratio;
		bottom: -450px * @ratio;
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

			.startBt {
				font-size: 1.5em;
				color: #fff;
				background-color: @mainColor_highlight;
				padding: 10px 20px;
			}
		}
		.logo {
			@ratio: .5;
			height: 581px * @ratio;
			bottom: -450px * @ratio;
			// bottom: -290px;
		}
	}
}
</style>