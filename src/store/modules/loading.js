export default {
  state: {
    text: "[Loading Javascipt]",
    perc: 0
  },
  mutations: {
    loadingText (state, txt) {
      state.text = txt
    },
    loadingPerc (state, perc) {
      state.perc = perc
    }
  }
}
