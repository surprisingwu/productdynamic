summerready = function() {
    new Vue({
        el: '#app',
        data: {
            currentIndex: 0,
            horizontal: 'horizontal',
            listData: [
                {
                    url: 'img/slide1.jpg',
                    title: '用友金融助力长安汽车金融打造新一代移动HR',
                    subtitle: '新一代移动HR'
                },
                {
                    url: 'img/slide1.jpg',
                    title: '用友金融助力长安汽车金融打造新一代移动HR',
                    subtitle: '新一代移动HR'
                },
                {
                    url: 'img/slide1.jpg',
                    title: '用友金融助力长安汽车金融打造新一代移动HR',
                    subtitle: '新一代移动HR'
                },
                {
                    url: 'img/slide1.jpg',
                    title: '用友金融助力长安汽车金融打造新一代移动HR',
                    subtitle: '新一代移动HR'
                },
                {
                    url: 'img/slide1.jpg',
                    title: '用友金融助力长安汽车金融打造新一代移动HR',
                    subtitle: '新一代移动HR'
                },
                {
                    url: 'img/slide1.jpg',
                    title: '用友金融助力长安汽车金融打造新一代移动HR',
                    subtitle: '新一代移动HR'
                }
            ],
            options: {
                observeDOM: true,
                click: true,
                probeType: 1,
                scrollbar: false,
                pullDownRefresh: false,
                pullUpLoad: false
                },
            items: [{
                    image: 'img/slide1.jpg',
                    text: '用友金融助力长安汽车金融打造新一代移动HR'
                },
                {
                    image: 'img/slide2.png',
                    text: '用友金融助力长安汽车金融打造新一代移动HR'
                },
                {
                    image: 'img/slide3.jpg',
                    text: '用友金融助力长安汽车金融打造新一代移动HR'
                },
                {
                    image: 'img/slide4.jpg',
                    text: '用友金融助力长安汽车金融打造新一代移动HR'
                },
            ],
            tabs: ['全部','HR','财务与共享','交易总账与税务','哈哈','嘿嘿','嘻嘻']
        },
        mounted: function() {
            var that = this
            setTimeout(function(){
                that.caculateWidth()
            },20)
        },
        methods: {
            caculateWidth: function() {
                var navListEl = this.$refs.slideNavList,
                    scrollContent = this.$refs.navScroll.$el.querySelector('.cube-scroll-content'),
                    navList = navListEl.children,
                    height = 0
                for (var i=0,len=navList.length; i < len; i++) {
                    var navEl = navList[i]
                    height += navEl.clientWidth
                }


                // navListEl.style.width = height + 'px'
                scrollContent.style.width = height + 'px'
            },
            changeTab: function(i) {
                this.currentIndex = i
            },
            goToSearch: function() {},
            exitApp: function() {
                _.functionback()
            },
            changePage: function(current) {}
        },
        components: {
            CHeader: commonComponents.CHeader,
            GraphicList: commonComponents.graphicList
        }
    })
}