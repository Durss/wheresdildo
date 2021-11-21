<template>
	<div class="game">
		<ManipulableImage class="image" :zoomMin=".25" :zoomMax="2" v-if="data">
			<div>
				<div class="item" v-for="(i, index) in data.items" :key="index" :style="getStyles(i)" @click="onItemFound(i)"></div>
				<img :src="require('@/assets/images/'+data.picture)" draggable="false">

				<div ref="stars" class="stars">
					<img src="@/assets/icons/star.svg" alt="star" ref="star" v-for="i in 15" :key="i">
				</div>
			</div>
		</ManipulableImage>
		<div class="hud">
			<transition name="slide">
				<div class="timer" v-if="timeLeft > 0">{{time}}</div>
			</transition>
			
			<Button :icon="require('@/assets/icons/duck.svg')" v-if="data" :title="foundCount+'/'+data.items.length" class="infoBt" ref="infoBt" @click="onShowHints()" />
			
			<transition name="slide">
				<Hints v-if="showHints && timeLeft > 0" class="hints" :data="data" @close="showHints = false" />
			</transition>
			
			<transition name="fade">
				<div class="dimmer" v-if="showResult"></div>
			</transition>

			<div class="result" ref="result" v-if="showResult">
				<div class="label" ref="resultLabel">
					<div v-if="allFound" class="success">
						<div>ALL DILDOS FOUND IN</div>
						<strong>{{finalTimeLeftFormated}}</strong>
					</div>
					<div v-if="!allFound">
						<strong>{{foundCount}}/{{data.items.length}}</strong>
						<div>DILDO(S) FOUND</div>
					</div>
				</div>
				<Button :icon="require('@/assets/icons/back.svg')" class="backBt" ref="backBt" title="Back" @click="onBack()" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Button from "@/components/Button.vue";
import ManipulableImage from "@/components/ManipulableImage.vue";
import Hints from "@/less/components/Hints.vue";
import Utils from "@/utils/Utils";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({
	components:{
		Button,
		Hints,
		ManipulableImage,
	}
})
export default class Game extends Vue {

	@Prop()
	public level:string;

	public data:LevelData = null;
	public showHints:boolean = false;
	public allFound:boolean = false;
	public finalTimeLeft:number = 0;
	public foundCount:number = 0;

	private disposed:boolean = false;
	private timerDuration:number = 2 * 60 * 1000;
	// private timerDuration:number = 2 * 1000;
	private timeLeft:number = -1;
	private startTime:number = Date.now();

	public get finalTimeLeftFormated():string {
		return Utils.formatDuration(this.finalTimeLeft, true);
	}

	public getStyles(item:LevelDataItem):any {
		return {
			top: item.y + 'px',
			left: item.x + 'px',
			width: item.w + 'px',
			height: item.h + 'px',
		}
	}

	public get time():string {
		return Utils.formatDuration(this.timeLeft, true);
	}

	public get showResult():boolean {
		return this.allFound || this.timeLeft == 0;
	}

	public mounted():void {
		let lvl = parseInt(this.level) - 1;
		lvl = lvl > 0 && lvl < this.$store.state.levels.length? lvl : 0;
		this.data = this.$store.state.levels[ lvl ];
		this.data.items.forEach(v => v.f = false);
		this.renderFrame();
	}

	public beforeDestroy():void {
		this.disposed = true;
	}

	public renderFrame():void {
		if(this.disposed) return;
		requestAnimationFrame(_=> this.renderFrame());
		
		this.timeLeft = this.timerDuration - (Date.now() - this.startTime);
		if(this.timeLeft < 0) this.timeLeft = 0;
	}

	public onShowHints():void {
		let bt = (this.$refs.infoBt as Vue).$el;
		gsap.set(bt, {scaleX:1, scaleY:1, rotate:0, opacity:1});
		gsap.from(bt, {duration:1, scaleX:1.2, ease:"elastic.out(1.5,.25)"});
		gsap.from(bt, {duration:1, scaleY:1.2, ease:"elastic.out(1.5,.25)"});
		this.showHints = true;
	}

	public onItemFound(i:LevelDataItem):void {
		if(i.f === true) return;
		i.f = true;
		this.burstParticles(i);
		this.allFound = true;
		this.foundCount = 0;
		for (let i = 0; i < this.data.items.length; i++) {
			if(this.data.items[i].f !== true) this.allFound = false;
			else this.foundCount++;
		}
		let bt = (this.$refs.infoBt as Vue).$el;
		gsap.set(bt, {scaleX:1, scaleY:1, rotate:0, opacity:1});
		gsap.from(bt, {duration:1, scaleX:1.2, ease:"elastic.out(2.5,.25)"});
		gsap.from(bt, {duration:1, scaleY:1.2, ease:"elastic.out(2.5,.25)"});
		gsap.fromTo(bt, {filter:"brightness(2)"}, {duration:1, filter:"brightness(1)"});
	}

	@Watch("showResult")
	public async onShowResult():Promise<void> {
		if(!this.showResult) return;
		this.finalTimeLeft = this.timerDuration - this.timeLeft;
		this.startTime = 0;
		this.timeLeft = 0;
		await this.$nextTick();

		let mySplitText = new SplitText(this.$refs.resultLabel, { type: "chars,words" });
		gsap.from(this.$refs.result, {duration:.5, scale:0, opacity:0, ease:"back.out"});
		let delay = .25;
		for(let i = 0; i < mySplitText.chars.length; i++) {
			const c = mySplitText.chars[i];
			// gsap.from(c, {duration:2, delay:i*.05, scale:0, rotate:Math.random()*180-90, ease:"elastic.out(2,.5)"});
			let rotate = Math.random()*10 + 30;
			if(Math.random() > .5) rotate *= -1;
			delay += .05
			gsap.from(c, {duration:1, scale:.8, rotate, opacity:0, delay, y:50, ease:"elastic.out"});
		}
		let bt = (this.$refs.backBt as Vue).$el;
		gsap.from(bt, {duration:1.5, delay, scaleX:.5, ease:"elastic.out(1.5,.25)"});
		gsap.from(bt, {duration:1.5, delay:delay+.1, scaleY:.5, ease:"elastic.out(1.5,.25)"});
		gsap.from(bt, {duration:.5, delay:delay+.1, y:0, opacity:0, rotate:35, ease:"back.out"});
		setTimeout(_=> {
			mySplitText.revert();
		}, (delay+1)*1000);
	}

	public onBack():void {
		this.$router.push("/");
	}

	public burstParticles(item:LevelDataItem):void {
		let stars = <Element[]>this.$refs.star;
		for (let i = 0; i < stars.length; i++) {
			const s = stars[i];
			gsap.killTweensOf(s);
			let px = Math.random() * item.w + item.x - 30;
			let py = Math.random() * item.h + item.y - 30;
			gsap.set(s, {opacity:1, x:px, y:py, scale:Math.random()*1 + .5});
			gsap.to(s, {opacity:0,
						rotation:(Math.random()-Math.random()) * Math.PI * 2.5+"rad",
						x:px + (Math.random()-Math.random()) * 200,
						y:py + (Math.random()-Math.random()) * 100,
						scale:0,
						duration:1.25});
		}
		setTimeout(_=> {
			//Reset stars to avoid page overflow on small screens
			for (let i = 0; i < stars.length; i++) {
				const s = stars[i];
				gsap.set(s, {opacity:1, x:0, y:0, scale:0});
			}
		},1500)
	}

}

export interface LevelData {
	items:LevelDataItem[];
	picture:string;
}

export interface LevelDataItem {
	i:number;//Item type
	f:boolean;//Found?
	x:number;
	y:number;
	w:number;
	h:number;
}

</script>

<style scoped lang="less">
.game{
	.image {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		position: absolute;
		top: 0;
		left: 0;
		.item {
			position: absolute;
			// background-color: rgba(0, 0, 0, .8);
		}
	}

	.hud {
		.timer {
			.fatText;
			.menu;
			position: absolute;
			top: -15px;
			width: min-content;
			border-top-left-radius: 0;
			border-top-right-radius: 0;
			padding: 20px 30px;
			transition: transform .5s ease-out;
			transform: translate(-50%, 0);
			font-size: 3em;

			&.slide-enter-active, &.slide-leave-active {
				transform: translate(-50%, 0px);
			}
			&.slide-enter, &.slide-leave-to {
				transition: transform .5s ease-in;
				transform: translate(-50%, -100%);
			}
		}

		.infoBt {
			position: absolute;
			top: 10px;
			left: 10px;
			box-shadow: -4px 4px 0px #252525;
			padding-right: 15px;
			/deep/ img {
				margin-right: 2px;
			}
		}

		.hints {
			top:0;
			left:0;
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
			transition: transform .25s ease-out;
			transform: translate(0, 0);

			&.slide-enter-active, &.slide-leave-active {
				transform: translate(0px, 0px);
			}
			&.slide-enter, &.slide-leave-to {
				transition: transform .25s ease-in;
				transform: translate(-100%, 0px);
			}
		}

		.dimmer {
			background-color: #000;
			position: absolute;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			z-index: 1;
			opacity: .75;
			transition: opacity .5s;

			&.fade-enter-active, &.fade-leave-active {
				opacity: .75;
			}
			&.fade-enter, &.fade-leave-to {
				opacity: 0;
			}
		}

		.result {
			.menu;
			.center();
			z-index: 2;

			.label{
				.fatText;
				strong {
					color: @mainColor_highlight;
				}
				.success {
					strong {
						color: #73db2e;
					}
				}
			}
			.backBt {
				margin-top: 20px;
				padding-right: 20px;
			}
		}
	}

	.stars {
		position: absolute;
		top: 0;
		left: 0;
		pointer-events: none;
		img {
			opacity: 0;
			position: absolute;
			width: 35px;
			height: 35px;
			transform-origin: center center;
		}
	}

}

@media only screen 
and (min-device-width : 320px) 
and (max-device-width : 480px) {
	.game{
		.hud {
			.timer {
				top: -10px;
				padding: 10px 15px;
				border-bottom-left-radius: 20px;
				border-bottom-right-radius: 20px;
			}
		}
	}
}


@media only screen 
and (min-device-width : 320px) {
	.game{
		.infoBt {
			font-size: .8em;
			top: 50px !important;
			left: 50% !important;
			transform: translate(-50%,0) !important;
		}
	}
}
</style>