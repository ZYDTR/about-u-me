# 本地HTML文件部署到GitHub Pages手机访问完整教程

## 📖 目标
将本地HTML文件部署到GitHub Pages，使其能在手机端正常访问，保持原始样式和内容。

## ⚙️ 前置条件
- ✅ 已有GitHub账号
- ✅ 本地安装git
- ✅ 有需要部署的HTML文件

## 🚀 步骤1：准备GitHub仓库

```bash
# 1. 初始化或进入git仓库
git init
# 或进入已有仓库目录

# 2. 确保有远程仓库连接
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

## 📝 步骤2：处理HTML文件名（⚠️ 关键！）

**❌ 问题**：中文文件名在URL中会导致移动端404错误

**✅ 解决方案**：复制文件并重命名为简单英文名

```bash
# 复制原文件到简单英文文件名
cp "原始中文文件名.html" simple-filename.html

# 🌰 示例：
cp "爱情轰炸 - 维基百科.html" love-bombing-wiki.html
```

## 📤 步骤3：添加并提交文件

```bash
# 添加文件到git
git add simple-filename.html

# 提交文件
git commit -m "feat: 添加HTML文件供移动端访问

- 使用简单英文文件名避免URL编码问题
- 保持原始样式和内容
- 方便手机端访问测试"

# 推送到GitHub
git push origin main
```

## ⚙️ 步骤4：启用GitHub Pages

1. 🌐 访问GitHub仓库页面
2. 🔧 点击 **Settings**
3. 📜 滚动到 **Pages** 部分
4. 📂 在 **Source** 下拉菜单中选择：
   - **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
5. 💾 点击 **Save**

## 🔗 步骤5：获取访问URL

GitHub Pages URL格式：
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/path/to/simple-filename.html
```

🌰 **示例**：
```
https://zydtr.github.io/about-u-me/self_paced/love-bombing-wiki.html
```

## 🧪 步骤6：测试访问

1. ⏱️ **等待部署**：通常需要1-3分钟
2. 💻 **桌面端测试**：先在电脑浏览器中验证
3. 📱 **移动端测试**：复制URL到手机浏览器

## 🛠️ 常见问题与解决方案

### ❌ 问题1：手机端404，桌面端正常
**🔍 原因**：文件名包含中文或特殊字符  
**✅ 解决**：重命名为简单英文文件名

### ❌ 问题2：页面显示不正确
**🔍 原因**：相对路径资源无法加载  
**✅ 解决**：确保HTML文件是自包含的（内嵌CSS/JS）

### ❌ 问题3：页面未更新
**🔍 原因**：GitHub Pages缓存  
**✅ 解决**：等待几分钟或强制刷新（Ctrl+F5）

## ✅ 验证清单

- [ ] 文件名使用简单英文字符
- [ ] 文件已成功推送到GitHub
- [ ] GitHub Pages已启用
- [ ] 桌面端可以访问
- [ ] 移动端可以访问
- [ ] 页面样式和功能正常

## 🚀 命令模板

```bash
# 一键部署脚本
cp "原始文件名.html" "simple-name.html"
git add "simple-name.html"
git commit -m "feat: 添加HTML文件供移动端访问"
git push origin main

# 生成访问URL（替换YOUR_USERNAME和YOUR_REPO）
echo "访问URL: https://YOUR_USERNAME.github.io/YOUR_REPO/simple-name.html"
```

## ⚠️ 注意事项

1. **📝 文件名规范**：只使用英文字母、数字、连字符和下划线
2. **📁 路径结构**：保持简单的目录结构
3. **📏 文件大小**：单个文件建议不超过25MB
4. **📜 内容限制**：确保内容符合GitHub使用条款

## 🎉 完成

完成以上步骤后，任何人都可以通过URL在任何设备上访问你的HTML文件。

---

**📅 创建时间**：2025年9月22日  
**🔄 最后更新**：2025年9月22日  
**👨‍💻 作者**：Claude Code Assistant  
**🏷️ 标签**：GitHub Pages, 移动端部署, HTML文件, 教程