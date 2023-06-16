import { createApp } from "vue"
import App from "./App"
import router from "./router/index"
import { createPinia } from "pinia"
import IconSvg from "@/components/IconSvg/IndexCom"

const context = require.context("./icons", true, /\.svg$/)

context.keys().forEach(key => {
	return require(`./icons/${key.slice(2)}`)
})


// const context = require.context('./icons', true, /\.svg$/)

// context.keys().forEach(key => {
// 	const componentConfig = context(key)
// 	return require(`./icons/${componentConfig.default.id.slice(5)}.svg`)
// })



const pinia = createPinia()
const app = createApp(App)
app.component("IconSvg", IconSvg)

app.use(router).use(pinia)
app.mount("#app")
