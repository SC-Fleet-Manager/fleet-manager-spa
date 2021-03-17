import { createWebHistory, createRouter, RouteLocationNormalized } from "vue-router";
import axios from 'axios';
import store from '@/store/store';

// Containers
const DefaultContainer = () => import('@/containers/DefaultContainer.vue');

// Views
const Home = () => import('@/views/Home.vue');
const MyFleet = () => import('@/views/MyFleet.vue');
const CorpoFleets = () => import('@/views/CorpoFleets.vue');
const Profile = () => import('@/views/Profile.vue');
const Supporter = () => import('@/views/Supporter.vue');
const MyBackings = () => import('@/views/MyBackings.vue');

// Views - Pages
const PrivacyPolicy = () => import('@/views/PrivacyPolicy.vue');
const Page404 = () => import('@/views/Page404.vue');

const router = createRouter({
    history: createWebHistory(),
    linkActiveClass: 'open active',
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
                    path: 'my-organizations',
                    name: 'My organizations',
                    component: CorpoFleets,
                    meta: {
                        requireAuth: true,
                    }
                },
                {
                    path: 'my-fleet',
                    name: 'My fleet',
                    component: MyFleet,
                    meta: {
                        requireAuth: true,
                    },
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
                                content: async (to: RouteLocationNormalized) => {
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
                    path: 'supporters',
                    name: 'Supporters',
                    component: Supporter,
                    meta: {
                        titleTag: 'Supporters - Fleet Manager',
                        metaTags: [
                            {
                                name: 'description',
                                content: 'Follows the great supporters of Fleet Manager. Big thanks for all of them!',
                            },
                            {
                                property: 'og:description',
                                content: 'Follows the great supporters of Fleet Manager. Big thanks for all of them!',
                            },
                            {
                                property: 'og:url',
                                content: async (to: RouteLocationNormalized) => {
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
                    path: 'my-backings',
                    name: 'My Backings',
                    component: MyBackings,
                    meta: {
                        requireAuth: true,
                        titleTag: 'My Backings - Fleet Manager',
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
                                content: async (to: RouteLocationNormalized) => {
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
                        content: async (to: RouteLocationNormalized) => {
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
            path: '/404',
            component: Page404,
            meta: {
                titleTag: '404 - Fleet Manager',
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
        },
        {
            path: '*',
            component: Page404,
            meta: {
                titleTag: '404 - Fleet Manager',
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

type MetaTag = {content: string|((to: RouteLocationNormalized) => string), name?: string, property?: string};

async function refreshSeoTags(to: RouteLocationNormalized)
{
    if (to.meta.titleTag) {
        if (typeof to.meta.titleTag === 'function') {
            document.title = await to.meta.titleTag(to);
        } else {
            document.title = to.meta.titleTag as string;
        }
    }
    if (!to.meta.metaTags) {
        return;
    }
    for (let metaTag of to.meta.metaTags as MetaTag[]) {
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
            meta.setAttribute('content', content);
        } else if (metaTag.property) {
            let meta = document.head.querySelector(`meta[property="${metaTag.property}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('property', metaTag.property);
                document.head.append(meta);
            }
            meta.setAttribute('content', content);
        }
    }
}

router.beforeEach(async (to, from, next) => {
    refreshSeoTags(to);

    if (!to.meta.requireAuth) {
        // no need auth
        next();
        return;
    }

    // need auth
    axios.get('/api/me').then(_ => {
        next();
    }).catch(err => {
        const status = err.response.status;
        const data = err.response.data;
        if ((status === 401 && data.error === 'no_auth')
            || (status === 403 && data.error === 'forbidden')) {
            window.location = data.loginUrl;
        }
    });
});

export default router;
