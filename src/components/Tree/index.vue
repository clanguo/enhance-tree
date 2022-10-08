<template>
  <div class="tree">
    <div v-if="enableFilter" class="tree_filter">
      <input type="text" :value="filterValue" @keyup.enter="filterTree" />
    </div>
    <div class="tree_container" ref="container" @scroll="onScroll">
      <div :style="{ height: `${containerHeight}px` }">
        <div
          class="tree_scroll"
          :style="{
            transform: `translateY(${containerOffset}px)`
          }"
        >
          <div
            v-for="item in pool"
            :key="item[keyField]"
            class="tree_node"
            :style="{
              height: `${itemHeight}px`
            }"
          >
            <div class="tree_node--content" :style="`--level: ${item.level}`">
              <span
                v-if="item.children?.length"
                class="tree_node__expand-btn"
                :class="item.expand ? 'tree_node--expand' : 'tree_node--close'"
                @click="toggleExpand(item, !item.expand)"
              ></span>
              <span v-else class="tree_node--blank"></span>
              <input
                v-if="!enableFilter"
                type="checkbox"
                :checked="item.checked"
                @change="toggleChecked(item, !item.checked)"
              />
              <div class="tree_node--slot">
                <slot :item="item"></slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const __DEV__ = process.env.NODE_ENV === 'development'

export default {
  name: 'Tree',
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
    },
    prev: {
      // 渲染列表前多渲染的个数
      type: Number,
      default: 5
    },
    next: {
      // 渲染列表后多渲染的个数
      type: Number,
      default: 5
    },
    enableFilter: {
      type: Boolean,
      default: false
    },
    filterValue: {
      type: String,
      default: ''
    },
    expandKeys: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      pool: [], // 渲染池, { item: 内容, y: y偏移, level: 层级 }
      defaultExpand: false, // 默认是否展开
      containerOffset: 0, // 滚动容器的Offest
      containerHeight: 0,
      firstRender: true,
      flatterData: []
    }
  },
  mounted() {
    // 挂载后计算显示内容
    this.setPool()
  },
  watch: {
    list: {
      immediate: true,
      handler(value) {
        let filterValue = this.filterValue
        const data = this.flat(value, 1, null)
        this.flatterData = this.enableFilter
          ? data.filter(
              node => node.level === 1 || node.content.indexOf(filterValue) >= 0
            )
          : data
      }
    }
  },
  methods: {
    // 拍扁一个数组，并添加level和parent属性
    flat(arr, level = 1, parent = null, expand = false) {
      let result = []
      arr.forEach(node => {
        node.level = level
        node.parent = parent
        node.expand = typeof node.expand === 'boolean' ? node.expand : expand
        if (this.firstRender && !this.enableFilter) {
          if (this.expandKeys.includes(node[this.keyField])) {
            node.expand = true
          }
        }
        node.visible = level === 1 || (parent?.expand && parent?.visible)

        result.push(node)
        node?.children?.length &&
          (result = result.concat(this.flat(node.children, level + 1, node)))
      })

      return result
    },
    onScroll() {
      this.setPool()
    },
    setPool() {
      performance.mark('startPool')
      const height = this.$refs['container'].clientHeight
      const flatterData = this.flatterData
      const len = flatterData.length
      // 滚动高度
      const scrollTop = this.$refs['container'].scrollTop
      // 第一个渲染的下标
      let startIndex = Math.floor(scrollTop / this.itemHeight)
      // 最后一个渲染的下标
      let endIndex = Math.ceil((scrollTop + height) / this.itemHeight)
      // 第一个下标向前移动prev个
      startIndex = Math.max(0, startIndex - this.prev)
      // 最后一个下标向后移动next个
      endIndex = Math.min(len, endIndex + this.next)
      // let count = endIndex - startIndex
      // 滚动区域的scrollTop，即第一个元素的translateY
      const startY = startIndex * this.itemHeight
      this.containerOffset = Math.min(this.containerHeight, startY)
      let result = []
      const data = flatterData.filter(item => item.visible)
      endIndex = Math.min(endIndex, data.length)
      for (let i = startIndex; i < endIndex; i++) {
        result.push(data[i])
      }

      this.$emit('update', result, this.pool)
      if (this.flatterData.length) {
        this.firstRender = false
      }

      this.pool = result

      if (__DEV__) {
        performance.mark('endPool')
        console.log(
          'performance duration: %sms',
          performance.measure('pool', 'startPool', 'endPool').duration
        )
        performance.clearMarks()
        performance.clearMeasures()
      }
    },
    toggleExpand(item, value) {
      value ? this.expand(item) : this.collapse(item)
      this.toggleVisible(item.children || [], value)
      this.resetPool()
    },
    expand(item) {
      item.expand = true
      this.$emit('expand', item)
    },
    collapse(item) {
      item.expand = false
      this.$emit('collapse', item)
    },
    expandAll() {
      this.flatterData.forEach(node => {
        node.expand = true
        node.visible = true
      })
      this.$nextTick(() => {
        this.resetPool()
      })
    },
    collapseAll() {
      this.flatterData.forEach(node => {
        node.expand = false
        node.visible = node.level === 1
      })
      this.$nextTick(() => {
        this.resetPool()
      })
    },
    toggleVisible(list, value) {
      list.forEach(node => {
        node.visible = value
        if (node.expand && node.children) {
          this.toggleVisible(node.children, value)
        }
      })
    },
    toggleChecked(node, value) {
      this.setChecked(node, value)
      this.$emit('checked', value)
      this.resetPool()
    },
    setChecked(node, value) {
      node.checked = value
      this.setChildrenChecked(node, value)
      this.setParentChecked(node, value)
    },
    setParentChecked(node, value) {
      if (!node.parent) return
      let parentChecked
      if (value) {
        parentChecked = !node.parent.children.some(i => i.checked !== true)
      } else {
        parentChecked = false
      }
      node.parent.checked = parentChecked
      this.setParentChecked(node.parent, parentChecked)
    },
    setChildrenChecked(node, value) {
      if (!node.children) return
      node.children.forEach(i => {
        i.checked = value
        this.setChildrenChecked(i, value)
      })
    },
    setContainerHeight() {
      const data = this.flatterData
      const len = data.filter(item => {
        return item.level === 1 || (item.parent.expand && item.visible)
      }).length
      this.containerHeight = len * this.itemHeight
    },
    filterTree(event) {
      let val = event.target.value
      if (this.filterValue === val) return
      this.$emit('update:filterValue', val)
      const expand = node => {
        node.expand = !!val
        // 第一层级必定为true，其他层级需要根据val是否为空，为空不显示
        node.visible = node.level === 1 || val !== ''
      }
      this.flatterData.forEach(expand)
      // 必须要nextTick，不然会有一次延迟
      this.$nextTick(() => {
        this.resetPool()
        this.$emit(
          'filter',
          this.flatterData.filter(item => item.visible)
        )
      })
    },
    resetPool() {
      this.setContainerHeight()
      this.setPool()
    }
  }
}
</script>

<style scoped>
.tree {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tree::-webkit-scrollbar {
  width: 2px;
  height: 2px;
}

.tree::-webkit-scrollbar-thumb {
  background-color: #a1a1a1;
}

.tree_filter {
  /* flex: 0 0 50px; */
  flex: 0;
  padding: 5px;
}

.tree_filter input {
  width: 100%;
  box-sizing: border-box;
  padding: 4px 8px;
  font-size: 12px;
  border: 1px solid #d7dde4;
  outline: none;
  border-radius: 4px;
  color: #495060;
  background-color: #fff;
  background-image: none;
}

.tree_filter input:focus {
  border-color: #54a4ff;
  outline: 0;
  box-shadow: 0 0 0 2px rgb(41 141 255 / 20%);
}

.tree_container {
  flex: 1;
  position: relative;
  overflow: auto;
}

.tree_scroll {
  will-change: transform;
}

.tree_node {
  overflow: hidden;
}

.tree_node--content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: calc(var(--level) * 10px);
}

.tree_node__expand-btn {
  flex: 0;
  width: 0;
  height: 0;
  margin-right: 5px;
  border: 5px solid transparent;
  cursor: pointer;
  border-left-color: #ccc;
  will-change: transform;
  transform: rotateZ(0);
}

.tree_node--expand {
  transform: rotateZ(90deg);
}

.tree_node--slot {
  flex: 1;
  width: 100%;
  overflow: hidden;
}

.tree_node--blank {
  flex: 0 0 5px;
  margin-right: 10px;
}
</style>
