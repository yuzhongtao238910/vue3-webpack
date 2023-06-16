<template>
<h1>app...{{message}}</h1>
<h2>store测试: {{counterStore.count}}</h2>
<ul>
	<li>
		<router-link to="/">home</router-link>
	</li>
	<li>
		<router-link to="/about">about</router-link>
	</li>
</ul>
<hr>
<Switch v-model:checked="checked" />
<router-view></router-view>
<Button type="primary">Primary Button</Button>
<!-- <el-button type="primary">按钮</el-button>
<el-button type="success">你好</el-button> -->
<IconSvg iconName="#icon_avatar"></IconSvg>
</template>
<script setup>
import { Button, Switch } from "ant-design-vue"
import { useCounterStore } from "@/store/index"
import { ref } from "vue"
const message = ref("apple")
const counterStore = useCounterStore()
const checked = ref(false)
</script>
<style>
h1 {
	color: red;
}
</style>