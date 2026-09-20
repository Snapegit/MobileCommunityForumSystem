	import {
		createRouter,
		createWebHashHistory
	} from 'vue-router'
	import news from '@/views/news/list'
	import youqingxinxi from '@/views/youqingxinxi/list'
	import forum from '@/views/forum/list'
	import discussyouqingxinxi from '@/views/discussyouqingxinxi/list'
	import yonghu from '@/views/yonghu/list'
	import discussshequxinwen from '@/views/discussshequxinwen/list'
	import shequxinwen from '@/views/shequxinwen/list'
	import storeup from '@/views/storeup/list'
	import config from '@/views/config/list'
	import users from '@/views/users/list'

export const routes = [{
		path: '/login',
		name: 'login',
		component: () => import('../views/login.vue')
	},{
		path: '/',
		name: '首页',
		component: () => import('../views/index'),
		children: [{
			path: '/',
			name: '首页Home',
			component: () => import('../views/HomeView.vue'),
			meta: {
				affix: true
			}
		}, {
			path: '/updatepassword',
			name: '修改密码',
			component: () => import('../views/updatepassword.vue')
		}
		
		,{
			path: '/news',
			name: '新闻资讯',
			component: news
		}
		,{
			path: '/youqingxinxi',
			name: '友情信息',
			component: youqingxinxi
		}
		,{
			path: '/forum',
			name: '我的发布',
			component: forum
		}
		,{
			path: '/discussyouqingxinxi',
			name: '友情信息评论',
			component: discussyouqingxinxi
		}
		,{
			path: '/yonghu',
			name: '用户',
			component: yonghu
		}
		,{
			path: '/discussshequxinwen',
			name: '社区新闻评论',
			component: discussshequxinwen
		}
		,{
			path: '/shequxinwen',
			name: '社区新闻',
			component: shequxinwen
		}
		,{
			path: '/storeup',
			name: '我的收藏',
			component: storeup
		}
		,{
			path: '/config',
			name: '轮播图',
			component: config
		}
		,{
			path: '/users',
			name: '管理员',
			component: users
		}
		]
	},
]

const router = createRouter({
	history: createWebHashHistory(process.env.BASE_URL),
	routes
})

export default router
