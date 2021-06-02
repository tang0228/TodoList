import Vue from 'vue'
import Vuex from 'vuex'
import * as api from "../util/localstorage";
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    content: api.get()
  },
  mutations: {
    addContent(state, payload) {
      state.content.push(payload);
    },
    remContent(state, payload) {
      state.content = state.content.filter(item => item.id !== payload.id)
    },
    setContent(state, payload) {
      state.content = payload;
    }
  },
  actions: {
    addContent({ commit }, payload) {
      commit("addContent", payload);
      const res = api.get();
      res.push(payload);
      api.save(res);
      return res;
    },
    remContent({ commit }, payload) {
      commit("remContent", payload);
      let res = api.get();
      res = res.filter(item => item.id !== payload.id);
      api.save(res);
      return res;
    },
    setContent({ commit }, payload) {
      commit("setContent", payload);
      localStorage.setItem("todo", JSON.stringify(payload));
    }
  },
  modules: {
  }
})
