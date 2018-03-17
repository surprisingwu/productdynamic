var commonComponents = {}
var fileType = ['doc', 'ppt', 'pdf', 'txt', 'excel', 'jpg', 'png', 'other']
    // 组件要拆分成 基础组件和业务组件  基础组件复用要强

commonComponents.CHeader = {
    template: '<header>\
      <i class="iconfont icon-arrow-left back" @click.stop="goBack"></i>\
      <h2 class="title">{{title}}</h2>\
      <span  class="filter" @click="filterPicker" v-show="rightText">{{rightText}}</span>\
  </header>',
    props: {
        title: {
            type: String,
            default: '公司动态'
        },
        rightText: {
            type: String,
            default: ''
        }
    },
    methods: {
        goBack: function() {
            this.$emit('turnback')
        },
        filterPicker: function() {
            this.$emit('clickright')
        }
    }
}
commonComponents.NoData = {
    template: '<div class="no-data-img"></div>',
}
commonComponents.Loading = {
    template: '<div class="p-loading">\
            <cube-loading :size="28"></cube-loading>\
        </div>'
}
commonComponents.graphicList = {
    template: '<div class="graphic-list-wrapper">\
    <transition name="change-tab">\
                <ul class="graphic-list">\
                    <li class="graphic-list-item" v-for="(item,i) in data" :key="i" @click="itemClick(i)">\
                        <div class="content">\
                            <h2 class="title">{{item.title}}</h2>\
                            <span class="subtitle">{{item.summary}}</span>\
                        </div>\
                        <img class="img" width="120" height="78" :src="item.pic_url"/>\
                    </li>\
                </ul>\
                </transition>\
    </div>',
    props: {
        data: {
            type: Array,
            default: function() {
                return []
            }
        }
    },
    methods: {
        formatTime: function(time) {
            if (!time) {
                return
            }
            return _.formatDate(new Date(Number(time)), 'yyyy-MM-dd hh:ss')
        },
        itemClick: function(i) {
            _.setStorage('dispatch_id', this.data[i].dispatch_id)
            this.$emit('itemclick', i)
        }
    }
}
commonComponents.NoResult = {
    template: '<div class="no-result-content"><p class="text">{{text}}</p></div>',
    props: {
        text: {
            type: String,
            default: '抱歉 ! 暂无搜索结果 !'
        }
    }
}
commonComponents.IndexList = {
    template: '<ul class="indexlist">\
      <li class="list-item" v-for="(item,index) in data" :key="index" @click.stop="itemClick(index,$event)">\
      <img :src="item.pic_url"/>\
      <div class="content">\
        <h2 class="title">{{item.title}}</h2>\
        <div class="desc">\
          <span class="abstract" v-show="item.summary">{{item.summary}}</span>\
          <span class="time" :class="{spanright: !item.abstract}">{{formatTime(item.ts.time)}}</span>\
        </div>\
      </div>\
      </li>\
  </ul>',
    props: {
        data: {
            type: Array,
            default: []
        }
    },
    methods: {
        formatTime: function(time) {
            if (!time) {
                return
            }
            return _.formatDate(new Date(Number(time)), 'yyyy-MM-dd hh:ss')
        },
        itemClick: function(i, event) {
            if (!event._constructed) {
                return
            }
            _.setStorage('dispatch_id', this.data[i].dispatch_id)
            this.$emit('itemclick', i)
        }
    }
}

commonComponents.MainBody = {
    template: '<div class="main-body-wrapper">\
              <c-header @turnback="turnback" title="正文" :rightText="rightText" @clickright="openAccessory">\
              </c-header>\
              <div class="iframe-wrapper"><iframe class="iframe-content" :src="getSrc"></iframe></div>\
              <transition name="slide">\
               <router-view></router-view>\
              </transition>\
        </div>',
    created: function() {
        var dispatch_id = _.getStorage('dispatch_id')
        this.getData(dispatch_id)
    },
    computed: {
        getSrc: function() {
            if (this.data && this.data[0]) {
                return this.data[0].text
            }
        },
        rightText: function() {
            if (this.data.length) {
                if (this.data[0].enclosure.length) {
                    return '附件' + '(' + this.data[0].enclosure.length + ')'
                }
                return '附件'
            }
        }
    },
    data: function() {
        return {
            data: []
        }
    },
    methods: {
        getData: function(id) {
            _.getData({
                    appid: 'productdynamic',
                    action: 'handler',
                    params: {
                        transtype: 'getdispatchinfo',
                        dispatch_id: id
                    }
                },
                this.callback,
                this.callerr
            )
        },
        callback: function(data) {
            data = data.result.data
            if (data.length === 0) {
                mui.alert('返回的数据为空 !')
            }
            this.data = data
        },
        callerr: function(err) {
            mui.alert('网络异常,请稍候重试 !')
        },
        turnback: function() {
            this.$router.back()
        },
        openAccessory: function() {
            this.$store.commit(SET_ACCESSORY, this.data[0].enclosure)
            var currentRouter = this.$router.currentRoute.path
            currentRouter += '/accessory'
            this.$router.push({ path: currentRouter })
        }
    },
    components: {
        CHeader: commonComponents.CHeader
    }
}
commonComponents.AccessoryPage = {
    template: '<div class="accessory-apge-wrapper">' +
        '<c-header @turnback="turnback" title="附件列表"></c-header>' +
        '<div class="scroll-wrapper">' +
        '<cube-scroll :data="accessoryList" :options="options" ref="scroll">' +
        '<ul class="accessoryList">' +
        '<li class="accessory-item" v-for="(item,index) in accessoryList" @click.stop="openAccessory(index)">' +
        '<div class="icon-wrapper" :class="getIconCls(index)"></div>' +
        '<div class="content">' +
        '<h2 class="title">{{item.enclosure_name}}</h2>' +
        '<span class="size">5.8M</span>' +
        '</div>' +
        '<i class="iconfont icon-arrow-right icon"></i>' +
        '</li>' +
        '</ul>' +
        '</cube-scroll>' +
        '<div class="null-file-wrapper" v-show="!accessoryList.length>0"><div class="content"></div></div>' +
        '</div></div>',
    data: function() {
        return {
            options: {
                click: true
            },
            data: []
        }
    },
    computed: {
        accessoryList: function() {
            return this.$store.getters.accessoryList ? this.$store.getters.accessoryList : []
        }
    },
    methods: {
        openAccessory: function(i) {
            var currentAccessory = this.accessoryList[i]
            var url = currentAccessory.enclosure
            var fileName = currentAccessory.enclosure_name
            var currentFileType = fileType[currentAccessory.type]
            debugger
            _.openAttachment({
                    url: url,
                    fileName: fileName,
                    fileType: currentFileType
                },
                function(data) {
                    alert(JSON.stringify(data))
                },
                function(err) {
                    alert(JSON.stringify(err))
                })
        },
        getIconCls: function(i) {
            debugger
            var prefix = 'type-'
            return prefix + fileType[this.accessoryList[i].type]
        },
        turnback: function() {
            this.$router.back()
        }
    },
    components: {
        CHeader: commonComponents.CHeader
    }
}

commonComponents.SearchPage = {
    template: '<div class="search-page-wrapper">\
    <div class="search-inpt-wrapper">\
    <div class="input-wrapper">\
    <div class="input-content">\
      <input placeholder="请输入关键字" type="text" @click.stop="clickInpt" v-model="inpt" ref="inpt"/>\
      <i class="search-icon iconfont icon-search"></i>\
      <i class="iconfont icon-delete delete" @click.stop="deleteHandler"></i>\
      </div></div>\
   <span class="cancel-btn" @click.stop="turnBack">取消</span>\
    </div>\
    <div class="scroll-wrapper">\
      <cube-scroll :data="data" :options="options" @pulling-up="onPullingUp" ref="scroll">\
        <index-list :data="data" @itemclick="toDetail"></index-list>\
      </cube-scroll>\
    </div>\
    <div class="noresultwrapper" v-show="isNoResult"><no-result></no-result></div>\
    <div class="search-loading-wrapepr" v-show="isShowLoading"><loading></loading></div>\
    <router-view></router-view>\
  </div>',
    data: function() {
        return {
            inpt: '',
            data: [],
            isShowLoading: false,
            isNoResult: false,
            pageIndex: 1,
            options: {
                click: true,
                pullUpLoad: {
                    threshold: 40,
                    txt: {
                        more: '',
                        noMore: ''
                    }
                }
            }
        }
    },
    mounted: function() {
        var _self = this
        setTimeout(function() {
            _self.$refs.inpt.click()
        }, 20)
    },
    methods: {
        clickInpt: function() {
            this.$refs.inpt.focus()
        },
        deleteHandler: function() {
            this.inpt = ''
            this.data = []
        },
        getData: function(inpt) {
            _.getData({
                    appid: 'productdynamic',
                    action: 'handler',
                    params: {
                        transtype: 'getdispatch',
                        flag: '1',
                        search: inpt,
                        type: ''
                    }
                },
                this.callback,
                this.callerr
            )
        },
        callback: function(data) {
            this.isShowLoading = false
            data = data.result.data
            if (data.length === 0) {
                this.isNoResult = true
                return
            }
            this.data = data
            if (data.length < 15) {
                this.$refs.scroll.forceUpdate(false)
            }
        },
        callerr: function(err) {
            this.isShowLoading = false
            mui.alert('网络异常,请稍候重试 !')
        },
        toDetail: function(i) {
            this.$refs.inpt.blur()
            var currentRouter = this.$router.currentRoute.path
            currentRouter += '/detail'
            this.$router.push({ path: currentRouter })
        },
        onPullingUp: function() {
            // 上拉加载
            var that = this
            setTimeout(function() {
                that.$refs.scroll.forceUpdate(false)
                mui.toast("没有更多的数据 !")
            }, 300)
        },
        turnBack: function() {
            this.$router.back()
        }
    },
    watch: {
        inpt: function(newVal) {
            // 函数节流
            this.isNoResult = false
            this.data = []

            if (this.timer) {
                clearTimeout(this.timer)
            }
            if (!newVal) {
                return
            }
            var that = this
            this.timer = setTimeout(function() {
                that.isShowLoading = true
                that.getData(newVal)
            }, 300)
        }
    },
    components: {
        IndexList: commonComponents.IndexList,
        NoResult: commonComponents.NoResult,
        Loading: commonComponents.Loading,
    }
}