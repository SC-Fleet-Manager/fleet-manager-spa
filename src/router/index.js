import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios';
import store from '@/store/store';

// Views
const Home = () => import('@/views/Home');
const DefaultContainer = () => import('@/views/DefaultContainer');
const MyFleet = () => import('@/views/MyFleet/MyFleet');
const EditShipsAndFleet = () => import('@/views/MyFleet/EditShipsAndFleet');
const AddNewShip = () => import('@/views/MyFleet/AddNewShip');
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
                    path: 'my-organizations',
                    name: 'My organizations',
                    component: MyOrganizations,
                    meta: {
                        requireAuth: true,
                    }
                },
                {
                    path: 'my-fleet',
                    component: {
                        // Inline declaration of a component that renders our <router-view>
                        render: (c) => c('router-view'),
                      },
                    children: [
                        {
                            path: '',
                            name: 'My fleet',
                            component: MyFleet,
                            meta: {
                                requireAuth: true,
                            },
                        },
                        {
                            path: 'edit-ships-and-fleet',
                            component: {
                                render: (c) => c('router-view'),
                            },
                            children: [
                                {
                                    path: '',
                                    name: 'Edit ships and fleet',
                                    component: EditShipsAndFleet,
                                    meta: {
                                        requireAuth: true,
                                    },
                                },
                                {
                                    path: 'add-new-ship',
                                    name: 'Add new ships',
                                    component: AddNewShip,
                                    meta: {
                                        requireAuth: true,
                                    }
                                }
                            ]
                        }
                    ]
                },
                // {
                //     path: 'my-fleet',
                //     component: {
                //         // Inline declaration of a component that renders our <router-view>
                //         render: (c) => c('router-view'),
                //       },
                //     children: [
                //         {
                //             path: '',
                //             name: 'My fleet',
                //             component: MyFleet,
                //             meta: {
                //                 requireAuth: true,
                //             },
                //         },
                //         {
                //             path: 'edit-ships-and-fleet',
                //             name: 'Edit ships and fleet',
                //             component: EditShipsAndFleet,
                //             meta: {
                //                 requireAuth: true,
                //             },
                //         }
                //     ]
                // },
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

router.beforeEach((to, from, next) => {
    refreshSeoTags(to);
    next();
});

export default router;
