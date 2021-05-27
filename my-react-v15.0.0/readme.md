### 读 v15.0.0 源码，简单实现主要流程

### tag

- v20210418 不考虑 transaction 和事件系统，一个最简单的 div 加文字内容 render到页面上（首次mount的情况)，所有逻辑写在一个 js 文件里
- v20210527 单一 js 按照源码目录进行拆分并用 rollup 打包跑通了



### todo 

- setState
- transaction
- 事件系统
- diff 算法
- 生命周期钩子
- 性能优化