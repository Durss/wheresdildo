<template>
	<div class="footer">
		<a href="https://www.instagram.com/fibertooth/" target="_blank" data-tooltip="Dildos drawing <br />made by Fibertooth">
			<img src="@/assets/icons/instagram.svg" alt="logo" height="18">
		</a>
		<a href="https://github.com/Durss/wheresdildo" target="_blank" data-tooltip="Source code">
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
	box-shadow: 5px 5px 0px #25252555;
	bottom: 0;
	left: 0;
	background-color: #fff;
	padding: 5px 5px 2px 2px;
	border-top-right-radius: 15px;
	border-left: unset;
	border-bottom: unset;
	a {
		img {
			transition: height .25s;
			height: 40px;
		}
	}
	a:hover {
		img {
			height: 50px;
		}
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