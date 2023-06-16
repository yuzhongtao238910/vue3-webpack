import { createRouter, createWebHistory } from "vue-router"
import HomeCom from "@/views/HomeCom"
import AboutCom from "@/views/AboutCom"

const routes = [
	{ path: "/", component: HomeCom },
	{ path: "/about", component: AboutCom },
]
const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
