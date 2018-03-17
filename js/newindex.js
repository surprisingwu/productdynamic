summerready = function() {
    var reg = /\/namic/
    var PAGE_SIZE = 10
    var PAGE_NUM = 1
    new Vue({
        el: '#app',
        store: pdVuexStore,
        router: pdRouter,
        data: {
            isShowNoDataImg: false,
            isShowGlobalLoading: true,
            currentIndex: 0,
            isShowLoading: false,
            listData: [],
            isNoResult: false,
            options: {
                pullUpLoad: {
                    threshold: 0,
                    txt: {
                        more: '',
                        noMore: ''
                    }
                }
            },
            tabOptions: {
                observeDOM: true,
                click: false,
                probeType: 1,
                scrollbar: false,
                pullDownRefresh: false,
                pullUpLoad: false
            },
            imgData: [],
            tabs: [],
            tabType: ''
        },
        created: function() {
            // _.setConfig(
            //     'ifbpmob.yonyou.com', '8030', 'com.ifbpmob.jrpt.controller.DispatchController'
            //     // '10.4.121.25', '8030', 'com.ifbpmob.jrpt.controller.DispatchController'
            // )
            // this.getTabs()
            // this.getData()
            // this.getImgs()
            _.getUserInfo(this.storeUserInfo, this.getUserInfoErr)
        },
        mounted: function() {
            var _self = this
                // 监听物理返回键
            _.onWatchBackBtn(function() {
                if (reg.test(location.href)) {
                    _self.$router.back()
                } else {
                    _self.exitApp()
                }
            })
            setTimeout(function() {
                _self.caculateWidth()
            }, 20)
        },
        methods: {
            goToImgDetail: function(item) {
                _.setStorage('dispatch_id', item.dispatch_id)
                this.$router.push({ path: '/namic/detail' })
            },
            storeUserInfo: function(info) {
                if (typeof(info) === 'string') {
                    info = JSON.parse(info)
                }
                info = info.result
                if (typeof(info) === 'string') {
                    info = JSON.parse(info)
                }
                var ip = info.ip
                var port = info.port
                if (ip && port) {
                    _.setConfig(
                        ip,
                        port,
                        'com.ifbpmob.jrpt.controller.DispatchController'
                    )
                    this.getTabs()
                    this.getImgs()
                    this.getData()
                }
            },
            getUserInfoErr: function(e) {
                this.showLoading = false
                mui.alert('获取用户信息失败!', '提示', '确定')
            },
            getData: function() {
                _.getData({
                    appid: "productdynamic",
                    action: "handler",
                    params: {
                        transtype: "getdispatch",
                        flag: "0",
                        search: "",
                        pageSize: PAGE_SIZE,
                        pageNum: PAGE_NUM,
                        type: this.tabType
                    }
                }, this.callback, this.callerr)
            },
            getTabs: function() {
                _.getData({
                    appid: "productdynamic",
                    action: "handler",
                    params: {
                        transtype: "getdispatchType",
                    }
                }, this.tabCallBack, this.tabErr)
            },
            getImgs: function(type) {
                _.getData({
                    appid: "productdynamic",
                    action: "handler",
                    params: {
                        transtype: "getdispatchTOP5",
                        flag: "0",
                        search: "",
                        type: ""
                    }
                }, this.imgCallBack, this.imgErr)
            },
            tabCallBack: function(data) {
                data = data.result.data
                this.tabs = data
            },
            imgCallBack: function(data) {
                this.isShowGlobalLoading = false
                data = data.result.data
                if (data.length === 0 && !this.typeVal) {
                    mui.alert('暂无图片资源 !')
                }
                this.imgData = data
            },
            tabErr: function(e) {
                mui.alert('网络异常,请稍后重试 !')
            },
            imgErr: function(e) {
                this.isShowGlobalLoading = false
                mui.alert('获取图片失败 !')
            },
            onPullingUp: function() {
                if (this.listData.length >= PAGE_SIZE * PAGE_NUM) {
                    PAGE_NUM++
                    this.getData()
                    return
                }
                this.$refs.scroll.forceUpdate()
                mui.tot
            },

            callback: function(data) {
                this.isShowLoading = false
                data = data.result.data
                if (data.length === 0 && !this.typeVal && PAGE_NUM === 1) {
                    this.isShowNoDataImg = true
                }
                this.listData = this.listData.concat(data)
            },
            callerr: function(err) {
                this.isShowLoading = false
                mui.alert('网络异常,请稍后重试 !')
            },
            caculateWidth: function() {
                var navListEl = this.$refs.slideNavList,
                    scrollContent = this.$refs.navScroll.$el.querySelector('.cube-scroll-content'),
                    navList = navListEl.children,
                    width = 0
                for (var i = 0, len = navList.length; i < len; i++) {
                    var navEl = navList[i]
                    width += navEl.clientWidth
                }
                scrollContent.style.width = width + 'px'
            },
            changeTab: function(i, event) {
                if (!event._constructed) {
                    return
                }
                // 切换tab的时候, 状态重置
                this.isShowNoDataImg = false
                PAGE_NUM = 1
                this.listData = []
                this.isShowLoading = true
                this.tabType = this.tabs[i].id
                this.currentIndex = i
                this.getData()
            },
            goToSearch: function() {
                this.$router.push({ path: '/namic/search' })
            },
            exitApp: function() {
                _.functionback()
            },
            goToDetail: function(i) {
                this.$router.push({ path: '/namic/detail' })
            },
            changeImg: function(current) {}
        },
        watch: {
            tabs: function(newVal) {
                var _self = this
                setTimeout(function() {
                    _self.caculateWidth()
                }, 50)
            }
        },
        components: {
            CHeader: commonComponents.CHeader,
            GraphicList: commonComponents.graphicList,
            Loading: commonComponents.Loading,
            NoResult: commonComponents.NoResult,
            TabChange: commonComponents.TabChange,
            NoData: commonComponents.NoData
        }
    })
}