<template>
<svg>
<use :xlink:href="props.iconName"></use>
</svg>
</template>
<script setup>
const props = defineProps({
	iconName: {
		type: String,
		default: ""
	}
})
</script>
<style>
svg {
	width: 50px;
	height: 50px;
}
</style>