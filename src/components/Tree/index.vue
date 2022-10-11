<template>
  <div class="tree">
    <div v-if="enableFilter" class="tree_filter">
      <input
        type="text"
        :value="filterValue"
        @keyup.enter="filterTree"
        placeholder="输入后按回车键搜索"
      />
    </div>
    <Loading v-if="loading" class="loading"></Loading>
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
import Loading from './Loading.vue'

const __DEV__ = process.env.NODE_ENV === 'development'

export default {
  name: 'Tree',
  components: {
    Loading
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
    // 是否启用节点过滤
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
      pool: [], // 渲染池, { item: 内容, level: 层级, visible: 是否显示, expand: 是否展开, parent: 父节点, children: 子节点 }
      defaultExpand: false, // 默认是否展开
      containerOffset: 0, // 滚动容器的Offest
      containerHeight: 0, // 滚动容器的高度
      firstRender: true, // 是否是第一次渲染
      flatterData: [], // 拍扁后的数组
      initCount: 0, // 用于permance统计第几次初始化数据
      loading: true // 数据正在初始化ing
    }
  },
  watch: {
    list: {
      immediate: true,
      handler() {
        this.enableFilter
          ? this.filterHandle(this.filterValue)
          : this.initData()
      }
    },
    filterValue: {
      handler(val) {
        this.filterHandle(val)
      }
    },
    enableFilter(val) {
      this.pool = []
      this.containerOffset = 0
      this.containerHeight = 0
      this.flatterData = []
      // this.firstRender = true
      // this.initData()
      val ? this.filterHandle(this.filterValue) : this.initData()
    }
  },
  methods: {
    filterHandle(val) {
      this.loading = true
      if ((!val && this.firstRender) || !this.enableFilter) return

      const toggleParenVisible = node => {
        if (node.parent) {
          node.parent.visible = true
          node.parent.expand = true
          toggleParenVisible(node.parent)
        }
      }

      this.$nextTick(() => {
        this.setFlatData()
        this.flatterData.forEach(node => {
          if (!val) {
            node.visible = node.level === 1
            node.expand = false
          } else {
            let visible = node.content.includes(val)
            node.visible = visible
            if (visible) {
              toggleParenVisible(node)
            }
          }
        })
        this.resetPool()
      })
    },
    initData() {
      this.loading = true
      setTimeout(() => {
        this.setFlatData()
        this.resetPool()
      })
    },
    setFlatData() {
      this.loading = true

      let count = this.initCount++
      if (__DEV__) {
        performance.mark('initStart' + count)
      }
      // let filterValue = this.filterValue
      let list = this.list
      const data = this.flat(list, 1, null)
      this.flatterData = data
      // this.resetPool()
      if (__DEV__) {
        performance.mark('initEnd' + count)
        console.log(
          '【init】 duration: %sms',
          performance.measure(
            'init' + count,
            'initStart' + count,
            'initEnd' + count
          ).duration
        )
        performance.clearMarks('initStart' + count)
        performance.clearMarks('initEnd' + count)
        performance.clearMeasures('init' + count)
      }

      // this.loading = false
    },
    // 拍扁一个数组，并添加level,parent,expand,visible属性
    flat(arr, level = 1, parent = null, expand = false) {
      let result = []
      arr.forEach(node => {
        node.level = level
        node.parent = parent
        node.expand = expand
        // 如果是首次渲染且没有启用节点过滤，则默认展开expandKeys中的节点
        if (this.firstRender && !this.enableFilter) {
          if (this.expandKeys.includes(node[this.keyField])) {
            node.expand = true
          }
        }
        // 一级节点默认显示
        node.visible = node.level === 1 || (parent?.expand && parent?.visible)

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
      if (__DEV__) {
        performance.mark('startPool')
      }
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
      // 有数据才认为已渲染
      if (this.flatterData.length) {
        this.firstRender = false
      }

      this.pool = result

      if (__DEV__) {
        performance.mark('endPool')
        console.log(
          '【pool】 duration: %sms',
          performance.measure('pool', 'startPool', 'endPool').duration
        )
        performance.clearMarks('startPool')
        performance.clearMarks('endPool')
        performance.clearMeasures('pool')
      }

      this.loading = false
    },
    toggleExpand(item, value) {
      if (__DEV__) {
        performance.mark('startToggleExpand')
      }
      value ? this.expand(item) : this.collapse(item)
      this.toggleVisible(item.children || [], value)
      this.resetPool()
      if (__DEV__) {
        performance.mark('endToggleExpand')
        console.log(
          '【toggleExpand】 duration: %sms',
          performance.measure(
            '【toggleExpand】',
            'startToggleExpand',
            'endToggleExpand'
          ).duration
        )
        performance.clearMarks('startToggleExpand')
        performance.clearMarks('endToggleExpand')
        performance.clearMeasures('【toggleExpand】')
      }
    },
    // 对外暴露使用，展开节点
    expand(item) {
      item.expand = true
      this.$emit('expand', item)
    },
    // 对外暴露使用，收起节点
    collapse(item) {
      item.expand = false
      this.$emit('collapse', item)
    },
    // 对外暴露使用，展开所有节点
    expandAll() {
      this.flatterData.forEach(node => {
        node.expand = true
        node.visible = true
      })
      // 安全起见，等到挂载完有DOM后再调用
      this.$nextTick(() => {
        this.resetPool()
      })
    },
    // 对外暴露使用，收起所有节点
    collapseAll() {
      this.flatterData.forEach(node => {
        node.expand = false
        node.visible = node.level === 1
      })
      this.$nextTick(() => {
        this.resetPool()
      })
    },
    // 递归切换节点可视性
    toggleVisible(list, value) {
      const toggleParenVisible = node => {
        if (node.parent) {
          node.parent.visible = true
          toggleParenVisible(node.parent)
        }
      }

      const recursionChildren = node => {
        if (node.children) {
          return node.children.some(
            node =>
              node.content.includes(this.filterValue) || recursionChildren(node)
          )
        }

        return false
      }

      list.forEach(node => {
        // 如果启用了节点过滤并且要显示节点
        if (this.enableFilter && value) {
          // 如果当前节点包含搜索内容
          if (node.content.includes(this.filterValue)) {
            // 是否显示要依据父节点是否展开
            node.visible = node.parent ? node.parent.expand : true
            // 如果包含了搜索内容，则应该向上显示父级
            toggleParenVisible(node)
          } else {
            // 不包含则不显示
            // 递归遍历子节点
            node.visible = recursionChildren(node)
          }
        } else {
          node.visible = value
        }

        // 如果当前节点有子节点并且已展开或者已启用节点过滤，则递归切换子节点是否显示
        if (node.children && (node.expand || node.enableFilter)) {
          this.toggleVisible(node.children, value)
        }
      })
    },
    // 对外暴露使用，切换是否选择节点
    toggleChecked(node, value) {
      this.setChecked(node, value)
      this.$emit('checked', value)
      this.resetPool()
    },
    // 设置节点选中
    setChecked(node, value) {
      node.checked = value
      // 遍历子节点选中
      this.setChildrenChecked(node, value)
      // 遍历父节点选中
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
    // 设置容器高度
    setContainerHeight() {
      const data = this.flatterData
      // 容器的高度是可显示节点的高度和
      const len = data.filter(item => item.visible).length
      this.containerHeight = len * this.itemHeight
    },
    // 搜索过滤节点，输入框内回车时调用
    filterTree(event) {
      let val = event.target.value
      // 如果两次回车时的值一样，不更新
      if (this.filterValue === val) return
      this.$emit('update:filterValue', val)
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
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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

.loading {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
</style>
