# high-performance

通过虚拟渲染支持百万级数据渲染的高性能树组件

## 属性 props

| 参数                | 说明                                         | 类型    | 是否必填 | 默认值     | 示例                                                 |
| ------------------- | -------------------------------------------- | ------- | -------- | ---------- | ---------------------------------------------------- |
| list                | 展示数据                                     | Array   | N        | []         | [{ content: '选项1-1-1'，id: 'asdf', children: [] }] |
| keyField            | 每个节点的唯一标识的键名                     | String  | N        | 'id'       | 'id'                                                 |
| textField           | 每个节点的文本内容的键名                     | String  | N        | 'text'     | 'text'                                               |
| childrenField       | 每个节点的子节点的键名                       | String  | N        | 'children' | 'children'                                           |
| itemHeight          | 节点固定高度，单位px                         | Number  | N        | 30         | 30                                                   |
| prev                | 虚拟列表前多渲染的个数，必须大于0            | Number  | N        | 5          | 5                                                    |
| next                | 虚拟列表后多渲染的个数，必须大于0            | Number  | N        | 5          | 5                                                    |
| enableFilter        | 是否启用节点过滤功能                         | Boolean | N        | false      | false                                                |
| filterValue/v-model | 节点过滤的内容，仅在enableFilter为true时有效 | String  | N        | ''         | '1-1'                                                |
| expandKeys          | 第一次渲染时默认展开的节点的keyField值       | Array   | N        | []         | ['asdf']                                             |
| defaultExpand       | 第一次渲染时是否默认展开所有节点             | Boolean | N        | false      | false                                                |
| defaultChecked      | 第一次渲染时是否默认选中节点                 | Boolean | N        | false      | false                                                |

## 插槽 Slot

| name      | 说明                                                         |
| --------- | ------------------------------------------------------------ |
| -/default | 默认插槽，自定义节点内容，参数为{ item }                     |
| search    | 启用节点搜索/过滤时搜索框插槽，参数是{ data: { filterValue: 当前搜索的值, onInput: 搜索框input事件处理函数 } }，建议不要对filterValue使用双向绑定，onInput事件触发时会将修改后值更新给父组件；插槽的后备内容是element的el-input组件 |

## 方法 Methods

| 方法名        | 说明             | 参数                            |
| ------------- | ---------------- | ------------------------------- |
| toggleExpand  | 展开/收起节点    | item：节点对象，value: 是否展开 |
| expandAll     | 展开所有节点     | -                               |
| collapseAll   | 收起所有节点     | -                               |
| toggleChecked | 设置节点是否选中 | item：节点对象，value: 是否选中 |

## 事件 Events

| 事件名             | 说明                                                         | 事件参数                               |
| ------------------ | ------------------------------------------------------------ | -------------------------------------- |
| update:filterValue | 可用于v-model，启用节点过滤且输入框内按下回车后触发，输入两次按下回车时的输入框内容没有发生变化，不触发 | val：输入框内容                        |
| update             | 渲染树重新渲染时触发                                         | newPool: 新的渲染池，oldPool: 旧渲染池 |
| expand             | 展开节点时触发                                               | item: 展开的节点                       |
| collapse           | 节点收起时触发                                               | item: 收起的节点                       |
| checked            | 选择节点时触发                                               | item: 选择的节点，value: 是否选中      |

 
