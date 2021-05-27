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
## 项目概述
### 电商项目基本业务概述
根据不同的应用场景，电商系统一般都提供了 PC 端、移动 APP、移动 Web、微信小程序等多种终端访问方式。
![电商后台管理系统的功能](https://github.com/lemon-0615/vue_shop/blob/master/image/%E7%94%B5%E5%95%86%E9%A1%B9%E7%9B%AE%E5%9F%BA%E6%9C%AC%E4%B8%9A%E5%8A%A1%E6%A6%82%E8%BF%B0.png)
### 电商后台管理系统的功能
电商后台管理系统用于管理用户账号、商品分类、商品信息、订单、数据统计等业务功能。
![电商后台管理系统的功能](https://github.com/lemon-0615/vue_shop/blob/master/image/%E7%94%B5%E5%95%86%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E7%9A%84%E5%8A%9F%E8%83%BD.png)
### 电商后台管理系统的开发模式（前后端分离）
电商后台管理系统的开发模式（前后端分离）
![电商后台管理系统的开发模式(前后端分离)](https://github.com/lemon-0615/vue_shop/blob/master/image/%E7%94%B5%E5%95%86%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E7%9A%84%E5%BC%80%E5%8F%91%E6%A8%A1%E5%BC%8F(%E5%89%8D%E5%90%8E%E7%AB%AF%E5%88%86%E7%A6%BB).png)
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
![token原理分析](https://github.com/lemon-0615/vue_shop/blob/master/image/token%E5%8E%9F%E7%90%86%E5%88%86%E6%9E%90.png)   
+ 登录界面
![登录界面](https://github.com/lemon-0615/vue_shop/blob/master/image/%E7%99%BB%E5%BD%95%E7%95%8C%E9%9D%A2.png)
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
      ```
 
      ```
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
  * 渲染分页页码条<el-pagination> </el-pagination>
  * 增加事件处理函数，handleSizeChange(newSize)来监听pagesize改变
  * 增加事件处理函数，handleCurrentChange(newPage)监听 pagenum 改变
  * 当前的页面数current-page双向绑定到querInfo.pagenum 
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
     //拿到新的页码值之后，立即给querInfo里的newPage赋值
      this.querInfo.pagenum = newPage
      this.getCateList()
    }
     
   ```
  ### 添加对话框的内容（控制添加分类的显示与隐藏->addCateDialogVisible: false)  
  ```   
    <!--添加分类的对话框-->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" >

     <!--添加分类的表单-->
     <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
  <el-form-item label="分类名称:" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
    <el-form-item label="父级名称:" >
  </el-form-item>
      </el-form>

     <span slot="footer" class="dialog-footer">
     <el-button @click="addCateDialogVisible = false">取 消</el-button>
     <el-button type="primary" @click="addCateDialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
 ```      
### 商品分类中分类数据列表
  * 为按钮绑定点击事件showAddCateDialog
     
   ```
     <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
    
   ```
     
  * 定义点击按钮事件
     
   ```
     //点击按钮，展示添加分类的对话框
    showAddCateDialog(){
       // 先获取父级分类的数据列表
      this.getParentCateList()
      // 再展示出对话框
      this.addCateDialogVisible = true
    },
   ```
  * 调用get请求，获取父级分类的列表的数据
  
```
      async getParentCateList(){
        const {data:res} = await this.$http.get('categories',
         {params: {type:2}})
         
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }
      console.log(res.data)
      this.parentCateList = res.data
    }
```
     
 ### 渲染添加分类的对话框
     使用cascader级联选择器
```
 //<el-cascader v-model="value" :options="options" :props="{ expandTrigger: 'hover' }" @change="handleChange"> </el-cascader>
<el-cascader expand-trigge ="hover" :options="parentCateList"  :props="cascaderProps" v-model="selectedKeys" @change="parentCateChanged" clearable change-on-select></el-cascader>
 ```
 * options="parentCateList"   用来指定数据源   
 * props 级联选择器的用来指定配置对象
 * v-model 绑定值选中的父级分类的Id数组，一定要是数组，双向绑定级联选择框中选中的value值
     
  ```
  //在data()中
   // 父级分类的列表
      parentCateList: [],
   //指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id', //选定的值
        label: 'cat_name',  //看到的值
        children: 'children'
      },
     // 选中的父级分类的Id数组
      selectedKeys: []
```
   * 当级联选择框变化，触发handleChange事件，就是parentCateChanged函数，可返回选中项的值，选择项发生变化触发这个函数
```     
     //选择项发生变化触发这个函数
    parentCateChanged(){
      console.log(this.selectedKeys)
      // 如果 selectedKeys 数组中的 length 大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
          if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        // 父级分类的Id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
```
     
  * 点击对话框的确定按钮，添加新的分类（要进行预验证）
  ```
    addCate() {
      //表单的预验证
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return  //失败
        // 成功就post对象
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )

        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }

        this.$message.success('添加分类成功！')
        // 刷新数据列表
        this.getCateList()
        this.addCateDialogVisible = false
      })
    }
```  
   * 监听对话框的关闭事件，重置表单数据
```
    <!--添加分类的对话框-->
  <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%"  @close="addCateDialogClosed">
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
 ```
### 分类参数  
* el-tabs 组件页签，el-tab-pane 组件面板
   
   ```
     <!-- tab 页签区域 -->
      // v-model => 将激活的页签name名称动态地绑定到对应的值身上；点击事件@tab-click，点击页签后触发的函数
      <el-tabs v-model="activeName" @tab-click="handleTabClick"> 
           <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many"> //label来指定显示的标题，name是页签的唯一名称
         <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
    ```
         
*  级联选择框选中项变化，会触发handleChange函数，tab 页签点击事件会触发handleTabClick函数 
*  在展开行下添加tag标签，用v-for循环遍历渲染
*  在获取数据的函数中，用gor循环将attr_vals字符串变数组         
```
       // 动态参数的数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: [],
  // 级联选择框选中项变化，会触发这个函数
    handleChange() {
     this.getParamsData()
    },
     // tab 页签点击事件的处理函数
    handleTabClick() {
      this.getParamsData()
    },
        // 获取参数的列表数据
    async getParamsData() {
      // 证明选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        // 清空表格数据
        this.manyTableData = []
        this.onlyTableData = []
        return
      }

      // 证明选中的是三级分类
      console.log(this.selectedCateKeys)
      // 根据所选分类的Id，和当前所处的面板，获取对应的参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败！')
      }

      console.log(res.data)
      //用forEach循环，字符串变数组
      res.data.forEach(item=>{
        item.attr_vals = item.attr_vals ?
        item.attr_vals=item.attr_vals.split('') : [] //字符串变数组
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框的输入值
        item.inputValue = ''

      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
   
   //在前面<template>组件里
  <!-- 循环渲染tag标签 -->
    <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable  @close="handleClose(i, scope.row)">{{item}}</el-tag>
 ```
  
* 输入文本框和按钮切换通过v-if和v-else用布尔值inputvisible
* v-model双向绑定文本框内的值
* ref: saveTagInput引用对象
* 事件绑定:键盘弹起，失去焦点时触发函数handleInputConfirm(scope.row)        
 ```
<!-- 输入文本框 -->
 <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
  </el-input>
   <!-- 添加按钮 -->
  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
 ```
         
*  将对attr_vals（Tag）的操作保存到数据库
  ```
  async saveAttrVals (row) {
      const { data: res } = await this.$http.put(
        `categories/${this.getCateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }
      this.$message.success('修改参数项成功！')
    }
   ```
* 点击按钮显示输入框
   ```
      showInput (row) {
        row.inputVisible = true
        //   让输入框自动获取焦点
        // $nextTick方法的作用：当页面元素被重新渲染之后，才会至指定回调函数中的代码
        this.$nextTick(_ => {
         this.$refs.saveTagInput.$refs.input.focus()
       })
       },
   ```
* 删除对应的参数可选项
```
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
  // 提交数据库，保存修改
      this.saveAttrVals(row)
    }
 ```
 ### 商品列表GoodsList
   + 自定义格式化时间的全局过滤器，在mian.js中定义全局过滤器，这样定义完成之后每个组件都可以调用它了
         
```
  Vue.filter('dateFormat', function(originVal) {
    //dateFormat是名字，function是过滤器处理函数
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
         
```
 + input搜索与清空的功能,绑定queryInfo信息的query属性，在按钮点击搜索和点击x是都要调用getGoodsList函数，取对应的商品列表       
 ```
  <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
    <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
  </el-input>       
 ```
  + 通过编程式导航跳转到商品添加页面，为添加按钮绑定事件，跳转的添加页面
 ```
   <el-button type="primary" @click="goAddpage">添加商品</el-button>   
   goAddpage() {
      this.$router.push('/goods/add')
    }
   ```
### 商品添加组件区域
 + 步骤条区域<el-steps></el-steps>
 + 用于激活哪一个步骤条，属性active="activeIndex - 0"控制激活项，activeIndex是在data里定义的属性，保存数据的联动
```
<el-steps :space="200" :active="activeIndex - 0"  finish-status="success" align-center>
  <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
</el-steps>
```
 + tab栏区域的渲染 ，其中'left'在左侧展示tab栏标题
 + 实现步骤条和tab栏数据的联动，将el-steps的active属性和el-tabs的v-model属性绑定到同一个值上，el-tab-pane的name会自动绑定到el-tabs的v-model的值上
 + 将tab栏放入到form表单里，form组件里用v-model绑定addForm.goods_cat的值；级联选择器选中项变化，handleChange会触发这个函数
 + 加入级联选择器，用v-model绑定addForm的值        
 ```
    //添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: []
      },
      //校验规则
      addFormRules:{
           goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
    // 商品分类列表
      catelist: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
 <!--tab栏区域-->
 <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
<el-tabs v-model = "activeIndex" :tab-position="'left'" >
    <el-tab-pane label="基本信息" name="0"> 
      <el-form-item label="商品名称" prop="goods_name">
         <el-input v-model="addForm.goods_name"></el-input>
      </el-form-item>
      <el-form-item label="商品价格" prop="goods_price">
         <el-input v-model="addForm.goods_price" type="number"></el-input>
      </el-form-item>
      <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="addForm.goods_weight" type="number"></el-input>
      </el-form-item>
      <el-form-item label="商品数量" prop="goods_number">
         <el-input v-model="addForm.goods_number" type="number"></el-input>
       </el-form-item>
      <el-form-item label="商品分类" prop="goods_cat">
          <el-cascader expand-trigger="hover" :options="catelist" :props="cateProps" v-model="addForm.goods_cat" @change="handleChange">
         </el-cascader>
        </el-form-item>
     </el-tab-pane>
    <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
    <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
    <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
    <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
  </el-tabs>
 </el-form>
         
 // 级联选择器选中项变化，会触发这个函数
    handleChange() {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    }
```
- 阻止页签切换之步骤         
 * 为el-tabs绑定一个属性before-leave；
 * 指定事件处理函数beforeTabLeave；         
 *  在函数形参中得到即将离开和进入的名字，oldActiveName，activeName，在函数里进行判断是否可以切换         
   ```
    <el-tabs v-model = "activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave">     
    beforeTabLeave(activeName, oldActiveName) {
      // console.log('即将离开的标签页名字是：' + oldActiveName)
      // console.log('即将进入的标签页名字是：' + activeName)
      // return false
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
   ```
- tab被选中时触发的事件，tab-click, @绑定一个事件，事件处理函数为tabClicked
- 处理函数，tabClicked(),发起get请求，获取动态参数列表数据，同时向服务器发送参数sel
- 请求路径中的:id较为复杂，在computed里定义一个计算属性cateId，得到id值
- 请求成功，将数据保存在相应数组里用forEach循环，将字符串转换为数组
- 渲染表单的Item项，用v-for遍历数组，绑定item的attr_name到label里
- Item项里放入复选框，<el-checkbox>，用v-for遍历数组item的attr_vals
- this.activeIndex为1证明访问的是静态属性面板
     ```
     <el-tab-pane label="商品参数" name="1">
         <!-- 渲染表单的Item项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
    </el-tab-pane>
      <el-tab-pane label="商品属性" name="2">
       //用v-for遍历数组，绑定item的attr_name到label里，input输入框绑定item的attr_vals
        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
    </el-tab-pane>
       async tabClicked() {
      // 证明访问的是动态参数面板
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }  //用get向服务器发送一个参数sel
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败！')
        }

        console.log(res.data)
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' } //用get向服务器发送一个参数sel
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性失败！')
        }

        console.log(res.data)
        this.onlyTableData = res.data
      }
    }
    },
    // 定义一个计算属性cateId，得到id值
    computed: {
           cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
    }
     ```
### 商品添加组件区域中上传图片的功能 el-upload 
 * action 表示图片要上传到的后台API地址  
 * 图片预览，监听on-preview事件，事件处理图片预览效果函数handlePreview()里接受到了图片处理信息，得到路径，放置一个预览窗口，动态绑定图片
 * 处理移除图片的操作函数handleRemove()，获取要删除的图片file的临时路径；从 pics 数组中，找到这个图片对应的索引值，调用数组的 findIndex方法找到后用splice 方法从 pics 数组中移除
 * 指定预览组件的呈现方式,list-type，指定upload的渲染效果
 * 通过axios的request拦截器为每一个请求都挂载了一个Authorization的字段，字段的值就是token，每一次用axios发请求时候都会自动追加一个token，但是在调用upload组件时候，在发送ajax请求是没有用到axios，故是会产生无效token，这个组件自己封装了一套ajax，没用到axios
 * upload组件的属性有一个headers的属性，可以用来这是上传的请求头部。在每一次上传图片期间，都要手动指定headers指定头
 * 上传图片之后，监听图片上传成功的事件，绑定on-success属性，处理函数handleSuccess()
```
// 图片上传组件的headers请求头对象
  headerObj: {
     Authorization: window.sessionStorage.getItem('token')
     },
  <!-- action 表示图片要上传到的后台API地址 -->
<el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headerObj" :on-success="handleSuccess">
 <el-button size="small" type="primary">点击上传</el-button>
    <div slot = "tip" class = "el-upload_tip">只能上传jpg/png文件，且不超过500kb</div>
 </el-upload>
 // 处理图片预览效果
 handlePreview(file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
  // 处理移除图片的操作
    handleRemove(file) {
      // console.log(file)
      // 1. 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2. 从 pics 数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 3. 调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
// 监听图片上传成功的事件
    handleSuccess(response) {
      console.log(response)
      // 1. 拼接得到一个图片信息对象,pic的值为response.data.tmp_path
      const picInfo = { pic: response.data.tmp_path }
      // 2. 将图片信息对象，push 到pics数组中，addForm是添加商品的表单数据对象，里面增加了图片的数组pics:[]
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
      
 ```
### 富文本编辑器 VueQuillEditor（在main.js文件里导入）
* 安装并导入富文本编辑器 
* 用Vue.use来注册为全局可用的组件 
* 使用富文本编辑器组件，内容双向绑定到data中，将输入的内容保存在addForm的goods_introduce中
* 添加商品的按钮，绑定点击事件add处理函数进行添加商品
```
 // 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
 //将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)
 <!--富文本编辑器组件-->
  <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
```
### 添加商品的按钮，绑定点击事件add进行添加商品
+ 添加商品前进行表单预验证，调用表单引用对象的addFormRef的validate函数进行判断
+ 执行添加的业务逻辑，在真正发起请求之前，用深拷贝，把对象原封不动拷贝一份，和原对象无关，这样就不会影响级联选择器里绑定的addForm.goods_cat的字符串形式
+ 在add函数里,循环遍历处理动态参数列表和静态参数列表,得到新对象，将新对象push到attrs里
+ 用http的post方法发起请求添加商品，注意商品的名称，必须是唯一的
```
 <!-- 添加商品的按钮 -->
 <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
      // 添加商品
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项！')
        }
        // 执行添加的业务逻辑
        // 用深拷贝，把对象原封不动拷贝一份，和原对象无关，这样就不会影响级联选择器里绑定的addForm.goods_cat的字符串形式
        // lodash   cloneDeep(obj)
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数,遍历manyTableData，将attr_vals转为数组
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)

        // 发起请求添加商品
        // 商品的名称，必须是唯一的
        const { data: res } = await this.$http.post('goods', form)

        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败！')
        }
        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      })
    }
```
### 订单列表
+ 用http的get请求获取订单数据列表
```     
     async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败！')
      }

      console.log(res)
      this.total = res.data.total
      this.orderlist = res.data.goods
    },
```
+ 渲染tab表格
+ 在表格栏组件中的prop属性进行一一对应，订单编号-prop:order_number，订单价格-prop:order_price，是否付款-prop:pay_status
+ 在是否付款的表格栏内，利用作用域插槽渲染，用if-else判断pay_status的值来觉得渲染已付款的tag还是未付款的tag
+ 在下单时间的表格栏内，利用作用域插槽渲染
+ 在操作的表格栏内利用作用域插槽渲染不同的结构，获取dateFormat
     
 ```
     <!-- 订单列表数据 -->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
            <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
         <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
 ```
+ 添加修改地址的对话框，对话框内加入表单组件，表单组件内加入级联选择器（其options绑定cityData）和iput输入框
+ 在点击location按钮时候触发showProgressBox函数，在函数中触发展示物流进度的对话框
+ 物流进度的数据获取在showProgressBox函数中通过http的get请求获取物流进度
  ```
     //按钮
      <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox">
   <!-- 修改地址的对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClosed">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
       
   <!-- 展示物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
   async showProgressBox() {
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败！')
      }
      this.progressInfo = res.data
      this.progressVisible = true
      console.log(this.progressInfo)
    }
  ```
### 使用Timeline时间线组件（在element2.6.0版本后才可以使用，现在是可以用的)
   *  时间线容器组件<el-timeline>，时间线项组件<el-timeline-item>，通过for循环创建出来的，数据在progressInfo数组里
   *  通过timestamp指定时间轴上的时间，将内容放在内容节点activity.context
 ```      
  <!-- 展示物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
```
### echarts的使用
* 导入echarts对应的包
* 准备一个echarts的DOM区域
* 调用echarts的init函数，将div区域初始化为echarts的图表实例myChart
* 准备数据和配置项
* 用option指定图表的配置项和数据 var option={}
* 将myChart实例调用一个setOption函数，把对应的数据放置进去，展示数据
* 用http的get请求获取数据，将服务器返回的数据和options进行合并才可以得到完整的数据
   ```
  data() {
         return{
     // 需要合并的数据
        options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
         }
     },
     async  mounted() {
      // 3. 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'))
      const {data: res} = await this.$http.get('reports/type/1')
      if(res.meta.status!==200){
          return this.$message.error('获取折线图数据失败')
      }
      // 4.准备数据和配置项
      const result = _.merge(res.data,this.options)
      //5.展示数据
      myChart.setOption(result)

     },
   ```
