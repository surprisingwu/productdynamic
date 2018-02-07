var SET_ACCESSORY = 'SET_ACCESSORY'
var state = {
    accessoryList: []
}
var mutations = {
    SET_ACCESSORY: function(state, list){
        state.accessoryList = list
    }
}
var getters = {
    accessoryList: function(state) {
        return state.accessoryList
    }
}

var pdVuexStore = new Vuex.Store({
    state: state,
    mutations: mutations,
    getters: getters,
})