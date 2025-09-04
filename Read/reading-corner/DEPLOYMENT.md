# 腾讯云 CloudBase 部署指南

## 🚀 完整部署流程

### 第一步：创建腾讯云 CloudBase 环境

1. **访问腾讯云控制台**
   - 登录：https://console.cloud.tencent.com/
   - 搜索"云开发 CloudBase"

2. **创建环境**
   - 点击"新建环境"
   - 环境名称：`reading-corner`
   - 计费方式：按量付费（开发测试用）
   - 地域：选择就近地域（如：广州、上海）

3. **开启必需服务**
   - ✅ **数据库**：云数据库（存储标注数据）
   - ✅ **存储**：云存储（存储语音文件）
   - ✅ **托管**：静态网站托管（部署前端）

### 第二步：配置数据库

1. **创建集合**
   - 进入"数据库" → "集合管理"
   - 新建集合：`annotations`

2. **设置索引**（可选，提升查询性能）
   ```javascript
   // 在集合上创建索引
   {
     "chapterId": 1,
     "createdAt": 1
   }
   ```

3. **设置安全规则**
   ```javascript
   // 允许匿名用户读写（开发测试用）
   {
     "read": true,
     "write": true
   }
   ```

### 第三步：配置本地环境

1. **复制环境配置**
   - 在 CloudBase 控制台 → "设置" → "环境总览"
   - 复制"环境 ID"

2. **修改环境变量**
   ```bash
   # 编辑 .env 文件
   VITE_CLOUDBASE_ENV_ID=your-actual-env-id
   VITE_CLOUDBASE_ANONYMOUS_LOGIN=true
   ```

### 第四步：本地测试

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 第五步：部署到云端

#### 方案一：CloudBase 静态托管

```bash
# 构建项目
npm run build

# 安装 CloudBase CLI
npm install -g @cloudbase/cli

# 登录（首次使用）
cloudbase login

# 初始化部署
cloudbase init

# 部署静态网站
cloudbase hosting deploy dist -e your-env-id
```

#### 方案二：Netlify 部署

1. 构建项目：`npm run build`
2. 访问：https://app.netlify.com/drop
3. 拖拽 `dist` 文件夹上传
4. 获得永久访问链接

## 📱 移动端访问优化

### 域名配置（推荐）

1. **CloudBase 自定义域名**
   - 控制台 → "静态网站托管" → "域名管理"
   - 添加自定义域名
   - 配置 HTTPS 证书

2. **移动端测试**
   - 使用 HTTPS 域名访问
   - 确保语音权限正常

## 🔧 高级配置

### 安全规则优化

```javascript
// 生产环境安全规则示例
{
  "read": "auth != null", 
  "write": "auth != null && resource.author == auth.uid"
}
```

### 性能优化

1. **CDN 加速**
   - 开启 CloudBase CDN
   - 配置缓存策略

2. **数据库优化**
   - 添加复合索引
   - 启用数据库触发器

## 🎯 最终效果

部署完成后，你将拥有：

- ✅ **持久化存储** - 刷新不丢失数据
- ✅ **实时同步** - 双方标注即时可见
- ✅ **语音云存储** - 语音文件永久保存
- ✅ **移动端优化** - 完美的手机体验
- ✅ **高可用性** - 腾讯云基础设施保障

## 🚨 注意事项

1. **匿名登录限制**
   - 开发测试用，生产环境建议使用微信登录
   
2. **成本控制**
   - 按量计费，注意用量监控
   - 可设置用量告警

3. **数据安全**
   - 生产环境需要配置安全规则
   - 定期备份重要数据

## 📞 技术支持

如遇问题：
1. 查看浏览器控制台错误信息
2. 检查 CloudBase 控制台监控数据
3. 参考腾讯云官方文档

---

**现在你可以拥有真正的实时共读体验了！** 🎉