export default function (url = '/data.json') {
  return {
    data() {
      return {
        loading: false,
        list: []
      }
    },
    created() {
      this.loading = true
      performance.mark('initJson')
      fetch(url)
        .then(r => {
          return r.json()
        })
        .then(d => {
          performance.mark('endJson')
          console.log(
            '【加载json文件】 duration: %sms',
            performance.measure('json', 'initJson', 'endJson').duration
          )
          this.list = Object.freeze(d)
          // this.list = d
          this.loading = false
          performance.mark('endCreated')
          console.log(
            '【数据响应式】 duration: %sms',
            performance.measure('created', 'endJson', 'endCreated').duration
          )
        })
    },
    methods: {
      expandTree() {
        this.$nextTick(() => {
          if (this.$refs.tree) this.$refs.tree.expandAll()
        })
      },
      collapseTree() {
        this.$nextTick(() => {
          if (this.$refs.tree) this.$refs.tree.collapseAll()
        })
      }
    }
  }
}
