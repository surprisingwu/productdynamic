summerready = function() {
    var filterData = [
        { text: '财务共享', value: '财务共享' },
        { text: '移动平台', value: '移动平台' },
        { text: 'HR', value: 'HR' },
        { text: 'IFBP', value: 'IFBP' }
    ]
    new Vue({
        el: '#app',
        store: pdVuexStore,
        router: pdRouter,
        data: {
            isNoResult: false,
            showLoading: true,
            options: {
                click: true,
                pullUpLoad: {
                    threshold: 40,
                    txt: {
                        more: '',
                        noMore: ''
                    }
                }
            },
            data: []
        },
        mounted: function() {
            // 监听物理返回键
            var _self = this
            var reg = /\/namic/
            _.onWatchBackBtn(function() {
                    if (reg.test(location.href)) {
                        _self.$router.back()
                    } else {
                        _self.exitApp()
                    }
                })
                // 筛选picker
            this.picker = this.$createPicker({
                title: '筛选类型',
                data: [filterData],
                onSelect: function(selectedVal, selectedIndex, selectedText) {
                    _self.getData(selectedVal[0])
                    this.typeVal = selectedVal[0]
                },
                onCancel: function() {

                }
            })


        },
        created: function() {
            _.setConfig(
                'ifbpmob.yonyou.com', '8030', 'com.ifbpmob.jrpt.controller.DispatchController'
            )
            this.getData()
                // _.getUserInfo(this.storeUserInfo, this.getUserInfoErr)
        },
        methods: {
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
                    this.getData()
                }
            },
            getUserInfoErr: function(e) {
                this.showLoading = false
                mui.alert('获取用户信息失败!', '提示', '确定')
            },
            getData: function(type) {
                _.getData({
                    appid: "productdynamic",
                    action: "handler",
                    params: {
                        transtype: "getdispatch",
                        flag: "0",
                        search: "",
                        type: type || ""
                    }
                }, this.callback, this.callerr)
            },
            callback: function(data) {
                this.showLoading = false
                data = data.result.data
                if (data.length === 0 && !this.typeVal) {
                    mui.alert("返回的数据为空 !")
                    return
                }
                // typeVal存在 重置data
                if (data.length === 0 && this.typeVal) {
                    this.data = []
                    this.isNoResult = true
                }
                this.data = data
            },
            callerr: function(err) {
                this.showLoading = false
                mui.alert("网络异常,请稍候重试 !")
            },
            toDetail: function(i) {
                this.$router.push({ path: '/namic/detail' })
            },
            onPullingUp: function() {
                var that = this
                setTimeout(function() {
                    that.$refs.scroll.forceUpdate()
                    mui.toast("没有更多的数据 !")
                }, 300)
            },
            clickSearch: function() {
                this.$router.push({ path: "/namic/search" })
            },
            exitApp: function() {
                _.functionback()
            },
            filterPicker: function() {
                this.picker.show()
            }
        },
        components: {
            CHeader: commonComponents.CHeader,
            SearchBtn: commonComponents.SearchBtn,
            Loading: commonComponents.Loading,
            IndexList: commonComponents.IndexList,
            NoResult: commonComponents.NoResult
        }
    })
}