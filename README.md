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
### 前端项目初试化步骤
 1. 安装Vue脚手架
 2. 通过Vue脚手架创建项目
 3. 配置Vue路由
 4. 配置Element-UI项目
 5. 配置axios库
 6. 初始化git远程仓库

### 登录/退出功能
 1. 登录业务流程
    + 在登录页面输入用户名和密码
    + 调用后台接口进行验证
    + 通过验证后，根据后台的响应状态跳转到项目页面
 2. 登录页面的相关技术点
    + http是无状态
    + 通过cookie在客户端记录
    + 通过seeion在服务器端记录状态
    + 通过token方式维持状态
    
### 表单内容数据验证
+ 为<el-form>通过属性绑定指定一个rules校验对象
+ 在data数据中定义校验对象rules，每一个属性对应一个规则
+ 为不同表单项，通过prop指定不同验证规则进行验证

```
  <!--登录表单区域-->
  <el-form  ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
  
data () {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
       // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
   ```
   
### 重置表单(resetFields) 
通过ref定义引用，拿到表单实例对象：
 + 为表单添加ref引用，值为组件实例对象
 + 通过this.$refs.引用对象.resetFields();
  ```
  <el-form  ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
  resetLoginForm() {
      // console.log(this);
      this.$refs.loginFormRef.resetFields()
    },
   ```
 ### 登录前表单数据的预验证
 通过ref定义引用，拿到表单实例对象：
 + 为表单添加ref引用，值为组件实例对象
 + 通过this.$refs.引用对象.valiadate()进行预校验
 + 在validate 中接收回调函数，返回验证结果
  ```
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败！')
        this.$message.success('登录成功')
        // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
        //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
        //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
        window.sessionStorage.setItem('token', res.data.token)
        // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
      })
    }
 ```
### 登录成功之后的操作

+ 把服务器给颁发的token信息记录到客户端的seisionStorage中，因为项目中除了登录之外的其他API接口，必须在登录之后才能访问，即给其他接口提供了身份验证信息 </li>
 ```
window.sessionStorage.setItem("token", res.data.token)
```
+ 通过编程式导航跳转到后台主页，路由地址是/home

```
this.$router.push('/home')
```
### 登录成功之后退出
+ 通过销毁本地的token
```
//清空token
window.sessionStorge.clear()
//跳转到登录页
this.$router.push('/login')
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
   
   ### 修改用户，根据id查询用户信息
  （通过作用域插槽接受到了scope数据对象)
  
   外侧　
   ```
    <template slot-scope="scope">
   ```
   里侧
  ```
    // 用scope.row拿到这一行数据
    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">　　</el-button> 
   ```
   拿到id后，调用相应接口获取信息，其路径是users/:id

  ```
  // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败！')
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUserList()
        // 提示修改成功
        this.$message.success('更新用户信息成功！')
      })
    },
   ```
 
 
  ### 修改表单的渲染
   // 查询到的用户信息对象 <br/>
  editForm: {}, 
  
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
    :model 数据绑定　:rules 验证规则对象　ref 表单的引用
 
 ### 提交表单完成用信息的修改
   1. 在验证通过之后发起put请求，将需要提交的数据放在请求上
   2. 若修改成功，状态码为200
  
       * 关闭对话框
       * 刷新数据列表 
       * 提示修改成功
  


  ``` 
       // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败！')
        }

        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUserList()
        // 提示修改成功
        this.$message.success('更新用户信息成功！')
      })
    },
    
   ```
   
   ### 调用API获取权限列表的数据
   * 请求路径：rights/:type
   * 请求方法： get
```
<el-table :data="rightsList">

export default {
  data() {
    return {
      // 权限列表
      rightsList: []
    }
  },
  created() {
    // 获取所有的权限
    this.getRightsList()
  },
  methods: {
    // 获取权限列表
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败！')
      }

      this.rightsList = res.data
      console.log(this.rightsList)
    }
  }
}
```
 
### 权限管理业务分析
* 通过权限管理模块控制不同的用户可以进行哪些操作，具体可以通过角色的方式进行控制，即每个用户分配一个特定的角色，角色包括不同的功能权限。

### 删除指定权限的功能
```
 <template slot-scope="scope">
   <el-row v-for="(item1) in scope.row.children" :key="item1.id">
      <!-- 渲染一级权限 -->
         <el-col :span="5">
           <el-tag>{{item1.authName}}</el-tag>
         </el-col>
      <!-- 渲染二级和三级权限 -->
          <el-col :span="19"> </el-col>
       </el-row>
          <pre>
           {{scope.row}}
           </pre>
   </template>
  ```
### for循环渲染一级权限（角色列表)
* 为了防止每一次删除之后表格合起，把服务器返回的最新权限直接赋值给childern属性
 ```
<el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
async removeRightById(role, rightId){
            //弹框提示用户是否删除
            const confirmResult = await this.$confirm('此操作将永久删除该文件，是否继续？',
                '提示',
                {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
            ).catch(err => err)
            if(confirmResult!=='confirm'){
                return this.$message.info('取消了删除!')
            }
            const {data: res}=await this.$http.delete(`roles/${role.id}/rights/${role.id}`)
            if(res.meta.status!==200){
                return this.$message.error('删除权限数据失败！')
            }
            role.children = res.data
        }
   ```
   ### el-tree树形结构
   * 全局注册tree组件，在页面上进行引用
   *  通过:data绑定数据源
   *  通过:props指定属性绑定对象
   *  复选框show-checkbox
   *  为每个结点绑定了选中后的值id-><h4>node-key="id"</h4>
   *  已有权限默认勾选,在点击分配权限按钮后立即获取角色中已有的三级权限下的id，把所有id添加到数组defKeys中，将这个数组通过属性绑定交给default-checked-keys
   
   ```
    <!--树形控件-->
    <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
       treeProps: {
                label: 'authName',
                children: 'children'
            }
   ```
   
   ### 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    
   ```
     getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => this.getLeafKeys(item, arr))
    },   
```
### 通过setRightDialogClosed函数绑定到组件属性上的形式，监听分配权限对话框的关闭事件
```
<!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @click="setRightDialogClosed">
  setRightDialogClosed(){
     this.defKeys = []
    },
  ```
 
  ### 通过使用vue-table-with-grid树形表格组件（利用作用域插槽和模板形式渲染结构)
   * 用自定义模板渲染表格数据，为table指定列的定义
   * 渲染分类是否有效对应的UI结构
   * 渲染排序，操作对应的UI结构
  ```
  // 为table指定列的定义
      columns:[{
          label: '分类名称',
          prop: 'cat_name'
          },
          {
          label: '是否有效',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'opt'
        }    
      ]
   <!--表格-->
     <tree-table class="treeTable" :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text='#'  border :show-row-  hover="false">
          <!--是否有效-->
         <template slot="isok" slot-scope="scope">
             <i class="el-icon-success" v-if="scope.row.cat_deleted===false"  style="color: lightgreen;"></i>
             <i class="el-icon-error" v-else  style="color: red;"></i>
             <!--排序-->
         </template>
            <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
         </template>
         <!--操作-->
           <template slot="opt" slot-scope="">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
         </template>
     </tree-table>
    ```
     
     
  ### 分页功能实现
     * 渲染分页页码条
  ```
     
     <!--分页区域-->
     <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="querInfo.pagenum" :page-sizes="[3, 5, 10,15]" :page-               size="querInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
      // 监听pagesize改变
    handleSizeChange(newSize){
          this.querInfo.pagesize = newSize
          this.getCateList()
    },
     // 监听 pagenum 改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    }
     
   ```
