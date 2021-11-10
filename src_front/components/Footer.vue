<template>
	<div class="footer">
		<a href="https://github.com/Durss/wheresdildo" target="_blank">
			<img src="@/assets/icons/github.svg" alt="logo" height="18">
		</a>
	</div>
</template>

<script lang="ts">
import { Component, Inject, Model, Prop, Vue, Watch, Provide } from "vue-property-decorator";

@Component({
	components:{}
})
export default class Footer extends Vue {

	public mounted():void {
		
	}

	public beforeDestroy():void {
		
	}

}
</script>

<style scoped lang="less">
.footer{
	position: absolute;
	border: 3px dashed #2c2c2c;
	box-shadow: -5px 5px 0px #25252555;
	bottom: 0;
	right: 0;
	background-color: #fff;
	padding: 5px 2px 2px 5px;
	border-top-left-radius: 15px;
	border-right: unset;
	border-bottom: unset;
	transition: padding .25s;
	img {
		height: 40px;
	}
	&:hover {
		padding: 10px;
	}
}
@media only screen 
and (min-device-width : 320px) 
and (max-device-width : 480px) {
	.footer {
		border-width: 2px;
	}
}
</style>