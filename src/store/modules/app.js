export default {
  state: {
    state: 0,
    session: 0
  },
  mutations: {
    appSetLoading (state) {
      state.state = 0
    },
    appSetPreUpload (state) {
      state.state = 1
    },
    appSetPostUpload (state) {
      state.state = 2
    }
  }
}
