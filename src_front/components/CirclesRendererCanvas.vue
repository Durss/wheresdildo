<template>
	<div class="circlesrenderercanvas">
		<!-- {{spectrumData}} -->
		<canvas ref="circles"></canvas>
		<canvas ref="dashes" class="dashes"></canvas>
	</div>
</template>

<script lang="ts">
import Utils from '@/utils/Utils';
import gsap, { random } from 'gsap';
import { Component, Inject, Model, Prop, Vue, Watch, Provide } from "vue-property-decorator";

@Component({
	components:{}
})
export default class CirclesRendererCanvas extends Vue {

	@Prop({default:20})
	public sizeOffset:number;

	@Prop({default:3})
	public circles:number;

	@Prop({default:0})
	public skipEvery:number;

	@Prop({default:6})
	public step:number;

	@Prop({default:2})
	public thickness:number;

	@Prop({default:0})
	public angleOffset:number;

	@Prop({default:1})
	public animSpeedRatio:number;

	@Prop({default:true})
	public animate:boolean;

	@Prop({default:false})
	public showDashes:boolean;

	@Prop({default:false})
	public noHighlight:boolean;

	@Prop({default:false})
	public noBackground:boolean;

	@Prop({default:false})
	public mirror:boolean;

	@Prop()
	public spectrumData:{s:number,a:number}[];

	@Prop({default:null})
	public highlightColor:string;

	@Prop({default:null})
	public darkColor:string;

	private cnv:HTMLCanvasElement;
	private ctx:CanvasRenderingContext2D;
	private darkColor_loc:any;
	private highlightColor_loc:any;
	private disposed:boolean;
	private localSpectrumData:{s:number,a:number}[];

	public get specData() {
		if(this.spectrumData != undefined) return this.spectrumData;
		return this.localSpectrumData;
	}

	public async mounted():Promise<void> {
		this.cnv = <HTMLCanvasElement>this.$refs.circles;
		let bounds = this.cnv.getBoundingClientRect();
		this.cnv.width = bounds.width;
		this.cnv.height = bounds.height;
		this.ctx = this.cnv.getContext("2d");
	

		if(this.animate !== false) {
			this.localSpectrumData = [];
			//Init fake data
			for (let i = 0; i < this.circles; i++) {
				let vo = {
							s:Math.random() * Math.PI * 2,
							a:Math.random() * Math.PI * 1 + Math.PI * .25
						};
				this.localSpectrumData.push(vo);
				let yoyo:boolean = Math.random() > .5;
				let sign = Math.random() > .5? 1: -1;
				let s = !yoyo? (vo.s + sign * Math.PI * 2) : vo.s + sign * Math.PI*2;
				gsap.to(vo, (Math.random()*.25 + (i+1)*.3) * this.animSpeedRatio, {s, ease:"linear", yoyo, repeat:-1})
			}
		}

		await this.$nextTick();//Wait for props to be available

		this.highlightColor_loc = this.highlightColor? this.highlightColor : Utils.getLessVars().mainColor_normal;
		this.darkColor_loc = this.darkColor? this.darkColor : Utils.getLessVars().mainColor_dark;

		this.renderFrame();

		if(this.showDashes !== false) {
			this.drawDashes();
		}
	}

	public beforeDestroy():void {
		this.disposed = true;
	}

	private renderFrame():void {
		if(this.disposed) return;
		requestAnimationFrame(_=> this.renderFrame());
		
		this.ctx.clearRect(0,0,this.cnv.width,this.cnv.height);

		let c = {x:Math.round(this.cnv.width/2), y:Math.round(this.cnv.height/2)};
		this.ctx.lineWidth = this.thickness;
		
		//Draw background
		if(this.noBackground === false) {
			this.ctx.strokeStyle = this.darkColor_loc;
			for (let i = 0; i < this.circles; i++) {
				this.ctx.beginPath();
				let d = (this.step*2 + this.thickness*2) * i + (this.sizeOffset);
				if(this.skipEvery > 0) {
					d +=  Math.floor(i/this.skipEvery) * (this.step*2 + this.thickness*2)
				}
				let r = d/2;
				this.ctx.arc(c.x, c.y,r, 0, Math.PI * 2);
				this.ctx.stroke();
				this.ctx.closePath();
			}
		}
		
		//Draw highlight
		this.ctx.lineWidth = this.thickness + .75;//+.75 makes sure the highlight properly overlaps all the background
		if(this.noHighlight === false && this.specData && this.specData.length > 0) {
			this.ctx.strokeStyle = this.highlightColor_loc;
			let len = Math.min(this.circles, this.specData.length);
			for (let i = 0; i < len; i++) {
				if(this.specData[i].a == 0) continue;
				this.ctx.beginPath();
				let d = (this.step*2 + this.thickness*2) * i + (this.sizeOffset);
				if(this.skipEvery > 0) {
					d +=  Math.floor(i/this.skipEvery) * (this.step*2 + this.thickness*2)
				}
				let r = d/2;
				let as = this.specData[i].s + this.angleOffset;
				let ae = (this.specData[i].a + as);
				this.ctx.arc(c.x, c.y, r, as, ae);
				this.ctx.stroke();
				this.ctx.closePath();
			}
		}

		//Draw a mirrored version of the image
		if(this.mirror !== false){
			this.ctx.clearRect(0, this.cnv.height*.5, this.cnv.width, this.cnv.height*.5);
			this.ctx.save();
			this.ctx.translate(this.cnv.width+1,this.cnv.height+1);
			this.ctx.rotate(Math.PI);
			this.ctx.drawImage(this.cnv, 0, 0)
			this.ctx.restore();
		}
	}

	private drawDashes():void {
		let canvas = <HTMLCanvasElement>this.$refs.dashes;
		let bounds = canvas.getBoundingClientRect();
		canvas.width = bounds.width;
		canvas.height = bounds.height;
		let ctx = canvas.getContext("2d");
		ctx.clearRect(0,0,canvas.width,canvas.height);
		let offset = Math.round(this.sizeOffset / 2);
		let px = Math.round(canvas.width * .5);
		let py = Math.round(canvas.height * .5);
		let skip = this.skipEvery;

		ctx.strokeStyle = this.highlightColor_loc.replace("rgba", "rgb").replace(/\(([0-9]+, ?[0-9]+, ?[0-9]+), ?[0-9.]+\)/gi, "($1)");//Remove alpha channel
		
		ctx.lineWidth = 1;
		for (let i = 0; i < this.circles; i++) {
		ctx.beginPath();
			ctx.moveTo(px, py - offset - 2);
			ctx.lineTo(px, py - offset + this.thickness);
			ctx.stroke();
			
			ctx.moveTo(px, py + offset + 3);
			ctx.lineTo(px, py + offset - this.thickness);
			ctx.stroke();
			
			offset += Math.round(this.step + this.thickness);
			if(i > 0 && (i+1)%skip == 0) {
				offset += Math.round(this.step + this.thickness);
			}
			ctx.closePath();
		}
	}
}
</script>

<style scoped lang="less">
.circlesrenderercanvas{
	position: relative;
	width: 100%;
	height: 100%;
	&.loader {
		width: 60px;
		height: 60px;
	}
	canvas {
		width: 100%;
		height: 100%;
		&.dashes {
			position: absolute;
			top: 0;
			left: 0;
		}
	}
}
</style>