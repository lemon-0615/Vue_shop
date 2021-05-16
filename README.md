# vue_shop
E-commerce management system
## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Build Setup setup
```
# clone the project
git clone https://github.com/lemon-0615/vue_shop.git

# enter the project directory
cd vue_shop

# install dependency
npm install

# develop
npm run serve
```
## 过程笔记
### 登录成功之后的操作：

+ 把服务器给颁发的token信息记录到客户端的seisionStorage中，因为项目中除了登录之外的其他API接口，必须在登录之后才能访问，即给其他接口提供了身份验证信息 </li>
 ```
window.sessionStorage.setItem("token", res.data.token)
```
+ 通过编程式导航跳转到后台主页，路由地址是/home

```
this.$router.push('/home')
```
### 路由导航守卫控制访问权限

```
router.beforeEach((to,from,next) => {
  // to 将要访问的路径
  // from 代表从哪一个路径跳转而来
  // next 是一个函数， 表示放行
  //   next()  放行     next('/login') 强制跳转
  if(to.path === '/login') return next();
  // 获取 token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('./login')
  next()
})

```
### 获取左侧菜单数据
```
data() {
    return {
      // 左侧菜单数据
      menulist: []
    }
  },
  created() {
    this.getMenuList()
  },
// 获取左侧所有的菜单
    async getMenuList() {
      const {data: res} = await this.$http.get('menus')
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
     console.log(res)
```
### 用双层for循环渲染左侧菜单
```
<el-submenu :index="item.id+''"  v-for = "item in menulist" :key="item.id">
         <!--一级菜单的模板区域-->
        <template slot="title">
           <!--图表-->
          <i class="el-icon-location"></i>
           <!--文本-->
          <span>{{item.authName}}</span>
        </template>
         <!--二级菜单-->
           <el-menu-item :index="subItem.id+''" v-for="subItem in item.children" :key="subItem.id">
               <!--一级菜单的模板区域-->
          <template slot="title">
           <!--图表-->
          <i class="el-icon-location"></i>
           <!--文本-->
          <span>{{subItem.authName}}</span>
           </template>
           </el-menu-item>
      </el-submenu>
      
  ```
  
  ### 侧边栏选中项的高亮
  点击的菜单值的index保存在sessionStorage中，即保存左侧边栏菜单的激活状态
  
```
 saveNavState(activePath) {
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  ```
  
   ### 用户列表-实现搜索功能
   + 监听switch开关状态的change事件
   + 拿到状态后立即发起ajax请求，调用接口把状态同步到服务器
   ```
   // 监听 switch 开关状态的改变
    async userStateChanged(userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
    }
   ```
