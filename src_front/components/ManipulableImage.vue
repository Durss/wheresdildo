<template>
	<div class="manipulableimage">
		<div ref="manipulableImage" class="manipulable" :style="manipulableStyles">
			<slot></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Inject, Model, Prop, Vue, Watch, Provide } from "vue-property-decorator";

@Component({
	components:{}
})
export default class ManipulableImage extends Vue {

	@Prop({default:1})
	public zoomMin:number;

	@Prop({default:7})
	public zoomMax:number;

	public zoom:number = 1;
	public zoom_interp:number = 1;
	public pos:{x:number, y:number} = {x:0, y:0};
	public pos_interp:{x:number, y:number} = {x:0, y:0};
	public mousePos:{x:number, y:number} = {x:0, y:0};
	public dragOffset:{x:number, y:number} = {x:0, y:0};
	public downPos:{x:number, y:number} = {x:0, y:0};
	public touches:TouchList;
	public touchesOffset:TouchList;
	public pinching:boolean = false;
	public dragging:boolean = false;
	public disposed:boolean = false;
	public isFirstBounds:boolean = true;
	private wheelHandler:any;
	private downHandler:any;
	private upHandler:any;
	private moveHandler:any;

	public get manipulableStyles():any {
		return {
			left: this.pos_interp.x+"px",
			top: this.pos_interp.y+"px",
			transform:"scale("+this.zoom_interp+")",
		}
	}

	public mounted():void {
		// this.zoom = this.zoomMin;
		this.wheelHandler = (e:MouseEvent) => this.onMouseWheel(e);
		this.downHandler = (e:MouseEvent) => this.onMouseDown(e);
		this.upHandler = (e:MouseEvent) => this.onMouseUp(e);
		this.moveHandler = (e:MouseEvent) => this.onMouseMove(e);

		let target = <HTMLDivElement>this.$el;
		target.addEventListener("touchstart", this.downHandler);
		target.addEventListener("mousedown", this.downHandler);
		target.addEventListener("mousewheel", this.wheelHandler);
		document.addEventListener("mousemove", this.moveHandler);
		target.addEventListener("touchmove", this.moveHandler);
		target.addEventListener("wheel", this.wheelHandler);
		target.addEventListener("DOMMouseScroll", this.wheelHandler);//FF
		document.addEventListener("mouseup", this.upHandler);
		document.addEventListener("touchend", this.upHandler);
			
		this.renderFrame();
	}

	public beforeDestroy():void {
		this.disposed = true;
		let target = <HTMLDivElement>this.$el;
		target.removeEventListener("touchstart", this.downHandler);
		target.removeEventListener("mousedown", this.downHandler);
		target.removeEventListener("mousewheel", this.wheelHandler);
		document.removeEventListener("mousemove", this.moveHandler);
		target.removeEventListener("touchmove", this.moveHandler);
		target.removeEventListener("wheel", this.wheelHandler);
		target.removeEventListener("DOMMouseScroll", this.wheelHandler);//FF
		document.removeEventListener("mouseup", this.upHandler);
		document.removeEventListener("touchend", this.upHandler);
	}

	private eventToPos(e:MouseEvent|TouchEvent):{x:number, y:number} {
		let x = (e instanceof MouseEvent)? e.clientX : (<TouchEvent>e).touches[0].clientX;
		let y = (e instanceof MouseEvent)? e.clientY : (<TouchEvent>e).touches[0].clientY;
		return {x,y}
	}

	private touchToPos(t:Touch):{x:number, y:number} {
		let x = t.clientX;
		let y = t.clientY;
		return {x,y}
	}

	private onMouseWheel(e:MouseEvent):void {
		e.preventDefault();
		if(!e['deltaY']) e['deltaY'] = e['wheelDelta']? -e['wheelDelta'] : e['detail'];
		let factor = e["deltaY"] > 0? .9 : 1/.9;
		this.zoom *= factor;
	}

	private onMouseDown(e:MouseEvent|TouchEvent):void {
		// e.preventDefault();
		this.dragging = true;
		this.mousePos = this.eventToPos(e);
		this.dragOffset = this.eventToPos(e);
		this.downPos = this.eventToPos(e);

		if(!(e instanceof MouseEvent)) {
			let t = <TouchEvent>e;
			if(t.touches.length == 2) {
				this.touchesOffset = t.touches;
				this.pinching = true;
			}
		}
	}

	private onMouseUp(e:MouseEvent|TouchEvent):void {
		this.dragging = false;
		if(!(e instanceof MouseEvent)) {
			let t = <TouchEvent>e;
			this.pinching = t.touches.length >= 2;
			//both mouseup and touchend are fired on mobile, stop here with touch event,
			//the mouseup will execute the rest of the function.
			//This filter is necessary otherwise we would get a behaviro similar to a
			//double click wich would select/unselect the dot
			return;
		}

		let upPos = this.mousePos;
		let dist = Math.sqrt(Math.pow(this.downPos.x-upPos.x,2) + Math.pow(this.downPos.y-upPos.y,2));

		if(dist < 5) {
			//TODO select item
		}
	}

	private onMouseMove(e:MouseEvent|TouchEvent):void {
		this.mousePos = this.eventToPos(e);
		this.touches = (<TouchEvent>e).touches;
	}

	private async renderFrame():Promise<void> {
		if(this.disposed) return;
		requestAnimationFrame(_=> this.renderFrame());

		let manipulableImage:HTMLDivElement = <HTMLDivElement>this.$refs.manipulableImage;
		if(!manipulableImage) return;
		let vw = document.body.clientWidth;
		let vh = document.body.clientHeight;

		//Dragging manipulableImage
		if(this.dragging) {
			let diffX = this.mousePos.x - this.dragOffset.x;
			let diffY = this.mousePos.y - this.dragOffset.y;
			this.dragOffset = JSON.parse(JSON.stringify(this.mousePos));
			this.pos.x += diffX;
			this.pos.y += diffY;
		}

		//Zoom via finger pinching
		if(this.pinching) {
			let p1 = this.touchToPos(this.touches[0]);
			let p2 = this.touchToPos(this.touches[1]);
			let p1_offset = this.touchToPos(this.touchesOffset[0]);
			let p2_offset = this.touchToPos(this.touchesOffset[1]);
			let dist = Math.sqrt(Math.pow(p1.x-p2.x, 2) + Math.pow(p1.y-p2.y, 2));
			let dist_offset = Math.sqrt(Math.pow(p1_offset.x-p2_offset.x, 2) + Math.pow(p1_offset.y-p2_offset.y, 2));
			let diff = dist - dist_offset;
			this.zoom += diff * .0025;
			this.touchesOffset = this.touches;
		}

		//Clamp zoom's value
		this.zoom = Math.min(Math.max(this.zoomMin, this.zoom), this.zoomMax);

		//Interpolate zoom and pos
		this.zoom_interp += (this.zoom - this.zoom_interp) * .25;
		this.pos_interp.x += (this.pos.x - this.pos_interp.x) * .25;
		this.pos_interp.y += (this.pos.y - this.pos_interp.y) * .25;

		if(Math.abs(this.zoom - this.zoom_interp) < .001) this.zoom_interp = this.zoom;
		if(Math.abs(this.pos.x - this.pos_interp.x) < 1) this.pos_interp.x = this.pos.x;
		if(Math.abs(this.pos.y - this.pos_interp.y) < 1) this.pos_interp.y = this.pos.y;
		
		//Translate position after zooming depending on the mouse position over the manipulable
		//image to zoom around the cursor
		let prevBounds = manipulableImage.getBoundingClientRect();
		let holder:HTMLDivElement = <HTMLDivElement>this.$el;
		let holderBounds = holder.getBoundingClientRect();
		await this.$nextTick();
		let bounds = manipulableImage.getBoundingClientRect();
		if(bounds.width == 0 || bounds.height == 0) return;
		if(this.isFirstBounds) {
			this.zoom_interp = this.zoom;
			this.pos.x = this.pos_interp.x = (vw - bounds.width)/2;
			this.pos.y = this.pos_interp.y = (vh - bounds.height)/2;
			this.isFirstBounds = false;
		}
		let diffX = bounds.width - prevBounds.width;
		let diffY = bounds.height - prevBounds.height;
		let deltaX:number = (this.mousePos.x - holderBounds.left - this.pos.x)/bounds.width;
		let deltaY:number = (this.mousePos.y - holderBounds.top - this.pos.y)/bounds.height;

		this.pos.x -= diffX*deltaX;
		this.pos.y -= diffY*deltaY;

		//Limit position of the manipulable
		if(bounds.width > vw) {
			if(this.pos.x > 0) this.pos.x = 0;
			if(this.pos.x < vw - bounds.width) this.pos.x = vw - bounds.width;
			if(this.pos.y > 0) this.pos.y = 0;
			if(this.pos.y < vh - bounds.height) this.pos.y = vh - bounds.height;
		}else{
			//Center on screen
			this.pos.x = (vw - bounds.width)/2;
			this.pos.y = (vh - bounds.height)/2;
		}

		this.pos_interp.x -= diffX*deltaX;
		this.pos_interp.y -= diffY*deltaY;
	}
}
</script>

<style scoped lang="less">
.manipulableimage{
	overflow: hidden;
	.manipulable {
		touch-action: none;
		position: absolute;
		transform-origin: top left;
		will-change: all;
		// cursor: all-scroll;
		* {
			user-select: none;
			touch-action: none;
		}
	}
}
</style>