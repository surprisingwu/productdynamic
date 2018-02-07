var pdRouter = new VueRouter({
    routes: [
        {
            path: "/namic/detail",
            component: commonComponents.MainBody,
            children: [
                {
                    path: 'accessory',
                    component: commonComponents.AccessoryPage
                }
            ]
        },
        {
            path: "/namic/search",
            component: commonComponents.SearchPage,
            children: [
                {
                    path: 'detail',
                    component: commonComponents.MainBody,
                    children: [
                        {
                            path: 'accessory',
                            component: commonComponents.AccessoryPage
                        }
                    ]
                }
            ]
        }
    ] 
}) 