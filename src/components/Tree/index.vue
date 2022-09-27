<template>
  <div class="tree" ref="container">
    <div class="tree_container" :style="{ height: containerHeight + 'px' }">
      <tree-list
        v-for="item in pool"
        :key="item.item.id"
        :item="item"
        v-slot="{ listItem }"
      >
        <div
          v-if="item.item"
          :style="{
            transform: `transformY(${item.y}px)`,
            height: `${itemHeight}px`
          }"
        >
          {{ listItem.content }}
        </div>
      </tree-list>
    </div>
  </div>
</template>

<script>
import TreeList from './TreeList.vue'
export default {
  name: 'Tree',
  components: {
    TreeList
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    keyField: {
      type: String,
      default: 'id'
    },
    itemHeight: {
      type: Number,
      default: 30
    }
  },
  data() {
    return {
      pool: [], // 渲染池, { item: 内容, y: y偏移 }
      prev: 5, // 最前面多显示个数
      next: 5 // 最后面多显示个数
    }
  },
  computed: {
    renderData() {
      return this.list
    },
    containerHeight() {
      const len = this.getDeepLength(this.list)
      return len * this.itemHeight
    }
  },
  mounted() {
    this.setPool()
    window.setPool = this.setPool.bind(this)
    // this.$refs['container'].addEventListener('scroll', this.setPool)
  },
  methods: {
    setPool() {
      const height = this.$refs['container'].clientHeight
      const scrollTop = this.$refs['container'].scrollTop
      let startIndex = Math.floor(scrollTop / this.itemHeight)
      let endIndex = Math.ceil((scrollTop + height) / this.itemHeight)

      startIndex = Math.max(0, startIndex - this.prev)
      // endIndex = Math.min(this.getDeepLength, endIndex + this.next)
      endIndex += this.next
      const startY = startIndex * this.itemHeight
      this.startY = startY
      // 计算起始下标时需要连带子节点
      const result = this.getPool(this.list, startIndex, endIndex, 0, 0)
      this.pool = result.list
      // this.pool = this.list.slice(startIndex, endIndex).map((item, index) => {
      //   return {
      //     item: item,
      //     y: startY + index * this.itemHeight
      //   }
      // })
    },
    /**
     * @param arr {Array<{content: '', children?: []}>}
     * @param startIndex {Number}
     * @param endIndex {Number}
     * @param curIndex {Number}
     * @param count {Number}
     * @return{{list: [], curIndex: number, count: number}}
     */
    getPool(arr, startIndex, endIndex, curIndex, count) {
      let result = []
      debugger
      for (let i = 0; i < arr.length; i++) {
        const { children, ...item } = arr[i]
        let listItem = {}
        if (curIndex < startIndex) {
          curIndex++
          let res = this.getPool(
            children,
            startIndex,
            endIndex,
            curIndex,
            count
          )
          listItem.children = res.list
        } else if (curIndex < endIndex) {
          count++
          curIndex++

          listItem.y = curIndex * this.itemHeight
          listItem.item = item

          if (children?.length) {
            let res = this.getPool(
              children,
              startIndex,
              endIndex,
              curIndex,
              count
            )
            listItem.children = res.list
            curIndex = res.curIndex
            count = res.count
          }
        } else {
          break
        }

        result.push(listItem)
      }
      return {
        list: result,
        curIndex,
        count
      }
    },
    getDeepLength(arr) {
      return arr
        ? arr.reduce(
            (prev, cur) => prev + 1 + this.getDeepLength(cur.children),
            0
          )
        : 0
    }
  }
}
</script>

<style scoped>
.tree {
  position: relative;
  overflow: auto;
}

.tree::-webkit-scrollbar {
  width: 2px;
  height: 2px;
}

.tree::-webkit-scrollbar-thumb {
  background-color: #a1a1a1;
}

.tree_item {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
