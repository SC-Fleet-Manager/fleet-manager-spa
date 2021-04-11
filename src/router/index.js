import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios';
import store from '@/store/store';
import Config from '@config/config.json';

const Home = () => import('@/views/Home');
const DefaultContainer = () => import('@/views/DefaultContainer');
const MyFleet = () => import('@/views/MyFleet/MyFleet');
const MyOrganizations = () => import('@/views/MyOrganizations/MyOrganizations');
const Profile = () => import('@/views/Profile/Profile');
const PrivacyPolicy = () => import('@/views/Pages/PrivacyPolicy');
const Page404 = () => import('@/views/Pages/Page404');

Vue.use(Router);

const router = new Router({
    mode: 'history',
    linkActiveClass: 'open active',
    scrollBehavior: () => ({y: 0}),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home,
        },
        {
            path: '/',
            name: 'App',
            component: DefaultContainer,
            children: [
                {
                    path: 'my-fleet',
                    component: MyFleet,
                    meta: {
                        requireAuth: true,
                    },
                },
                {
                    path: 'my-organizations',
                    name: 'My organizations',
                    component: MyOrganizations,
                    meta: {
                        requireAuth: true,
                    }
                },
                {
                    path: 'profile',
                    name: 'Profile',
                    component: Profile,
                    meta: {
                        requireAuth: true,
                        titleTag: 'Profile - Fleet Manager',
                        metaTags: [
                            {
                                name: 'description',
                                content: '',
                            },
                            {
                                property: 'og:description',
                                content: '',
                            },
                            {
                                property: 'og:url',
                                content: async (to) => {
                                    return `${window.location.protocol}//${window.location.host}${to.path}`;
                                },
                            },
                            {
                                property: 'og:image',
                                content: `${window.location.protocol}//${window.location.host}/icons/favicon-96x96.png`,
                            }
                        ],
                    },
                },
            ]
        },
        {
            path: '/privacy-policy',
            name: 'Privacy policy',
            component: PrivacyPolicy,
            meta: {
                titleTag: 'Privacy policy - Fleet Manager',
                metaTags: [
                    {
                        name: 'description',
                        content: 'The privacy policy of Fleet Manager.',
                    },
                    {
                        property: 'og:description',
                        content: 'The privacy policy of Fleet Manager.',
                    },
                    {
                        property: 'og:url',
                        content: async (to) => {
                            return `${window.location.protocol}//${window.location.host}${to.path}`;
                        },
                    },
                    {
                        property: 'og:image',
                        content: `${window.location.protocol}//${window.location.host}/icons/favicon-96x96.png`,
                    }
                ],
            },
        },
        {
            path: '*',
            component: Page404,
            meta: {
                titleTag: 'Page not found (404) - Fleet Manager',
                metaTags: [
                    {
                        name: 'description',
                        content: '',
                    },
                    {
                        property: 'og:description',
                        content: '',
                    },
                    {
                        property: 'og:url',
                        content: '',
                    },
                    {
                        property: 'og:image',
                        content: `${window.location.protocol}//${window.location.host}/icons/favicon-96x96.png`,
                    }
                ],
            },
        }
    ]
});

async function refreshSeoTags(to)
{
    if (to.meta.titleTag) {
        if (typeof to.meta.titleTag === 'function') {
            document.title = await to.meta.titleTag(to);
        } else {
            document.title = to.meta.titleTag;
        }
    }
    if (!to.meta.metaTags) {
        return;
    }
    for (let metaTag of to.meta.metaTags) {
        let content = '';
        if (typeof metaTag.content === 'function') {
            content = await metaTag.content(to);
        } else {
            content = metaTag.content;
        }
        if (metaTag.name) {
            let meta = document.head.querySelector(`meta[name="${metaTag.name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('name', metaTag.name);
                document.head.append(meta);
            }
            meta.content = content;
        } else if (metaTag.property) {
            let meta = document.head.querySelector(`meta[property="${metaTag.property}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('property', metaTag.property);
                document.head.append(meta);
            }
            meta.content = content;
        }
    }
}

router.afterEach((to, from) => {
    store.commit('splashScreen', false);
});
router.beforeEach((to, from, next) => {
    refreshSeoTags(to);

    if (!to.meta.requireAuth) {
        next();
        return;
    }

    if (from.name === null || from.name === 'Home') {
        store.commit('splashScreen', true);
    }

    const checkAuth = async () => {
        if (!Vue.prototype.$auth.isAuthenticated) {
            next({ path: '/', replace: true });
            return;
        }

        if (!store.state.accessToken) {
            const token = await Vue.prototype.$auth.getTokenSilently();
            store.commit('accessToken', token);
        }
        try {
            const response = await axios.get(`${Config.api_base_url}/api/profile`, {
                headers: {
                    Authorization: `Bearer ${store.state.accessToken}`,
                }
            });
            store.commit('profile', response.data);
            next();
        } catch (err) {
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                Vue.prototype.$toastr.e('Sorry you are not authorized to use the app for the moment.');
                next({ name: 'Home', replace: true });
                store.commit('splashScreen', false);
                return;
            }
            console.error(err);
            next(false);
            store.commit('splashScreen', false);
        }
    };
    if (!Vue.prototype.$auth.loading) {
        checkAuth();
    } else {
        Vue.prototype.$auth.$on('loaded', checkAuth);
    }
});

export default router;
