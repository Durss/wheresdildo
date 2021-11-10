<template>
	<div class="hints">
		<Button :icon="require('@/assets/icons/cross_white.svg')" class="closeBt" ref="closeBt" @click="onClose()" />
		<div class="items">
			<div class="title">Items to find</div>
			<div v-for="item in data.items" :key="item.i" :class="getClasses(item)">
				<img :src="require('@/assets/images/objects/'+item.i+'.png')" class="image">
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Button from "@/components/Button.vue";
import { LevelData, LevelDataItem } from "@/views/Game.vue";
import gsap from "gsap";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
	components:{
		Button,
	}
})
export default class Hints extends Vue {

	@Prop()
	public data:LevelData;

	public getClasses(item:LevelDataItem):string[] {
		let res = ["item"];
		if(item.f == true) res.push("found");
		return res;
	}

	public mounted():void {
		
	}

	public beforeDestroy():void {
		
	}

	public onClose():void {
		let bt = (this.$refs.closeBt as Vue).$el;
		gsap.set(bt, {scaleX:1, scaleY:1, rotate:0, opacity:1});
		gsap.from(bt, {duration:1, scaleX:1.2, ease:"elastic.out(1.5,.25)"});
		gsap.from(bt, {duration:1, scaleY:1.2, ease:"elastic.out(1.5,.25)"});
		this.$emit("close");
	}

}
</script>

<style scoped lang="less">
.hints{
	.menu;
	max-height: 100vh;
	height: 100%;
	width: 300px;
	padding-top: 16px;

	.closeBt {
		position: fixed;
		top: 10px;
		right: 10px;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		z-index: 1;
	}

	.items {
		overflow-x: hidden;
		overflow-y: auto;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		max-height: 100%;
		.title {
			flex-grow: 1;
			width: 100%;
			margin-bottom: 20px;
			font-weight: bold;
			font-size: 1.25em;
			color: @mainColor_normal;
			text-decoration: underline;
			padding-right: 40px;
		}
		.item {
			@size:125px;
			width: @size;
			height: @size;
			margin-bottom: 10px;
			filter: saturate(0%);
			opacity: .7;
			.image {
				max-width:@size;
				max-height:@size;
			}

			&.found {
				opacity: 1;
				filter: unset;
			}
		}
	}
}
</style>