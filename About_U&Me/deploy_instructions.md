# 快速部署到Gitee Pages

## 第一步：创建Gitee仓库
1. 访问 https://gitee.com（如无账号请先注册）
2. 点击右上角"+"，选择"新建仓库"
3. 仓库名称：about-u-me
4. 设置为"公开"
5. 点击"创建"

## 第二步：推送代码（替换YOUR_USERNAME为您的用户名）
```bash
git remote add gitee https://gitee.com/YOUR_USERNAME/about-u-me.git
git push -u gitee main
```

## 第三步：启用Gitee Pages
1. 进入您的仓库页面
2. 点击"服务" -> "Gitee Pages"
3. 选择"部署目录"为 dist
4. 点击"启动"

## 部署完成后访问地址：
https://YOUR_USERNAME.gitee.io/about-u-me

