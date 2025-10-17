### feature

1. 支持配置 html template 文件 (只能配置一个)
2. 整合一个 zelpis template(zelpis app), 用户可以在这个 template 的基础上进行开发

### bug

1. build 的时候如果存在 model/index 的话会修改项目根目录的 index.html, 我们默认的 html template 就是 /index.html, 所以我们应该有恢复这个文件的方法, 否则会对后续打包产生影响 (打包的时候备份一份到 .temp 目录然后打包结束覆盖回来?)

### refactor

1. 统一一下 packages/* 的目录结构

### chore

1. 处理一下 tsdown 的 isolatedDeclarations, 不然我们开发体验有点差, 有些类型得写两遍
2. CI/CD 逻辑 (github actions)

### todo

1. dsl 模块要不要抽到 shared 或者直接作为单独包? 这块逻辑感觉跟 render 也没太大关系, 拿出来是不是更好
