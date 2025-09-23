# 心理学概念交互式学习系统 - 技术设计文档

## 项目概述

设计一个基于卡片翻转的交互式学习系统，用户需要完成填空题才能解锁对应的心理学概念文章。系统包含5个心理学概念：习得性失助、爱情轰炸、创伤性结合、煤气灯效应、DARVO。

## 技术选型

### 前端技术栈

**核心技术：原生 HTML5 + CSS3 + JavaScript (ES6+)**

选择理由：
- **轻量化**：无需复杂框架，加载速度快，特别适合中国大陆网络环境
- **兼容性强**：支持所有现代浏览器，无需额外依赖
- **部署简单**：静态文件，可直接部署到任何静态托管平台
- **离线友好**：可添加 Service Worker 实现离线访问

### UI设计风格

**温暖治愈系设计 - 严格按照cat-bg-test.html实现**

**配色方案（完全照搬cat-bg-test.html）：**
```css
/* 背景渐变 - 与cat-bg-test.html完全一致 */
background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 50%, #fd79a8 100%);

/* 主要颜色 */
--primary-color: #d63031;     /* 标题红色，与cat-bg-test.html一致 */
--secondary-color: #e17055;   /* 副标题橙红 */  
--button-gradient: linear-gradient(135deg, #fd79a8, #e84393);
--card-bg: rgba(255, 255, 255, 0.95);  /* 调整为0.95与cat-bg-test.html一致 */
--text-color: #333;           /* 文字颜色与cat-bg-test.html一致 */
--description-color: #666;    /* 描述文字颜色与cat-bg-test.html一致 */
```

**飘浮小猫背景效果（严格按照cat-bg-test.html实现）：**
- **小猫图片引用**：使用`cat_gif_6.gif`作为背景图片
- **飘浮小猫数量**：3个飘浮小猫 + 2个角落固定小猫（共5只）
- **透明度设置**：飘浮小猫opacity: 0.3，角落小猫不透明
- **尺寸规格**：
  - 飘浮小猫：120px x 120px
  - 角落小猫：100px x 100px
- **动画时长**：飘浮动画分别为8s、6s、10s
- **位置设置**：
  - 飘浮小猫1：top: 10%, left: 10%
  - 飘浮小猫2：top: 60%, right: 15%  
  - 飘浮小猫3：bottom: 20%, left: 20%
  - 角落小猫1：top: 20px, left: 20px（固定）
  - 角落小猫2：bottom: 20px, right: 20px（带bounce动画3s）

**卡片样式（按照cat-bg-test.html设计）：**
```css
.card {
  background: rgba(255, 255, 255, 0.95);   /* 与cat-bg-test.html一致 */
  padding: 30px;                           /* 与cat-bg-test.html一致 */
  border-radius: 20px;                     /* 与cat-bg-test.html一致 */
  box-shadow: 0 10px 30px rgba(0,0,0,0.1); /* 与cat-bg-test.html一致 */
  max-width: 600px;                        /* 与cat-bg-test.html一致 */
  text-align: center;                      /* 与cat-bg-test.html一致 */
}
```

**具体动画实现（完全照搬cat-bg-test.html）：**
```css
@keyframes float1 {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(10deg); }
}

@keyframes float2 {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-30px) rotate(-10deg); }
}

@keyframes float3 {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(5deg); }
}

@keyframes bounce {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}
```

### 数据结构设计

#### 1. 问题数据结构 (data/questions.json)
```json
{
  "learningPath": [
    {
      "id": "darvo",
      "name": "DARVO",
      "order": 1,
      "htmlFile": "darvo.html",
      "icon": "🐾",
      "chapterCards": [
        {
          "id": "darvo_card_1",
          "type": "placeholder",
          "content": "练习卡片1 - 暂未开放",
          "optional": true
        },
        {
          "id": "darvo_card_2", 
          "type": "placeholder",
          "content": "练习卡片2 - 暂未开放",
          "optional": true
        },
        {
          "id": "darvo_card_3",
          "type": "placeholder", 
          "content": "练习卡片3 - 暂未开放",
          "optional": true
        }
      ]
    },
    {
      "id": "love-bombing",
      "name": "Love Bombing",
      "order": 2,
      "htmlFile": "love-bombing.html",
      "icon": "🐾",
      "chapterCards": [
        {
          "id": "love_card_1",
          "type": "placeholder",
          "content": "练习卡片1 - 暂未开放",
          "optional": true
        },
        {
          "id": "love_card_2",
          "type": "placeholder",
          "content": "练习卡片2 - 暂未开放", 
          "optional": true
        },
        {
          "id": "love_card_3",
          "type": "placeholder",
          "content": "练习卡片3 - 暂未开放",
          "optional": true
        }
      ]
    }
  ],
  "ui": {
    "gentlePrompt": "宝宝不想答题也可直接下一步哦",
    "skipButtonText": "下一步",
    "learnButtonText": "开始学习"
  }
}
```

#### 2. 进度数据结构 (LocalStorage)
```json
{
  "userProgress": {
    "currentConcept": "gaslighting",
    "completedConcepts": ["gaslighting"],
    "conceptProgress": {
      "gaslighting": {
        "mainCompleted": true,
        "practiceCompleted": 2,
        "practiceTotal": 3,
        "unlockedAt": "2025-09-22T10:30:00Z"
      }
    },
    "totalProgress": 20
  }
}
```

#### 3. 配置文件设计
**config/app-config.js**：
```javascript
const APP_CONFIG = {
  // 学习顺序：DARVO → Love Bombing → 煤气灯效应 → 习得性失助 → 创伤性结合
  concepts: [
    { id: "darvo", name: "DARVO", color: "#d97706", order: 1, icon: "🐾" },
    { id: "love-bombing", name: "Love Bombing", color: "#8b5cf6", order: 2, icon: "🐾" },
    { id: "gaslighting", name: "煤气灯效应", color: "#ef4444", order: 3, icon: "🐾" },
    { id: "learned-helplessness", name: "习得性失助", color: "#3b82f6", order: 4, icon: "🐾" },
    { id: "traumatic-bonding", name: "创伤性结合", color: "#059669", order: 5, icon: "🐾" }
  ],
  ui: {
    // cat-bg-test.html 配色（严格照搬）
    background: "linear-gradient(135deg, #ffeaa7 0%, #fab1a0 50%, #fd79a8 100%)",
    primaryColor: "#d63031",
    secondaryColor: "#e17055", 
    buttonGradient: "linear-gradient(135deg, #fd79a8, #e84393)",
    cardBackground: "rgba(255, 255, 255, 0.95)",  /* 调整为0.95与cat-bg-test.html一致 */
    textColor: "#333",
    descriptionColor: "#666",
    
    animationDuration: 600,
    touchThreshold: 100,
    progressAxisHeight: 60,
    
    // 温暖提示语
    gentlePrompt: "宝宝不想答题也可直接下一步哦",
    skipButtonText: "下一步",
    learnButtonText: "开始学习"
  },
  deployment: {
    githubPagesBaseUrl: "https://username.github.io/repo-name/"
  },
  // 飘浮小猫配置（严格按照cat-bg-test.html）
  floatingCats: {
    image: "cat_gif_6.gif",      /* 使用cat-bg-test.html中的图片 */
    floatingCount: 3,            /* 3个飘浮小猫 */
    cornerCount: 2,              /* 2个角落小猫 */
    floatingOpacity: 0.3,        /* 飘浮小猫透明度 */
    cornerOpacity: 1,            /* 角落小猫不透明 */
    floatingSize: "120px",       /* 飘浮小猫尺寸 */
    cornerSize: "100px",         /* 角落小猫尺寸 */
    animations: ["8s", "6s", "10s"],  /* 飘浮动画时长 */
    bounceAnimation: "3s",       /* 角落小猫bounce动画 */
    positions: {
      floating1: { top: "10%", left: "10%" },
      floating2: { top: "60%", right: "15%" },
      floating3: { bottom: "20%", left: "20%" },
      corner1: { top: "20px", left: "20px" },
      corner2: { bottom: "20px", right: "20px" }
    }
  }
}
```

## 系统架构

### 文件结构
```
/
├── index.html              # 主页面
├── css/
│   ├── main.css           # 主样式
│   ├── cards.css          # 卡片样式
│   └── responsive.css     # 响应式布局
├── js/
│   ├── app.js             # 主应用逻辑
│   ├── card-manager.js    # 卡片管理
│   ├── question-engine.js # 问题引擎
│   └── storage.js         # 数据存储
├── data/
│   ├── questions.json     # 问题数据
│   └── config.json        # 配置文件
├── resources/             # 现有HTML文件
│   ├── 习得性失助.html
│   ├── 爱情轰炸.html
│   ├── 创伤性结合.html
│   ├── 煤气灯效应.html
│   └── DARVO.html
└── assets/
    ├── icons/
    └── fonts/             # 避免Google Fonts
```

### 核心功能模块

#### 1. 进度轴系统 (progress-axis.js)
- **节点状态管理**：未开始(灰色) / 进行中(蓝色) / 已完成(绿色)
- **可视化显示**：5个圆形节点 + 连接线
- **交互功能**：点击已完成节点可返回对应题目
- **动画效果**：节点激活时的过渡动画
- **响应式设计**：移动端水平滚动，桌面端固定显示

```javascript
// 进度轴数据结构示例（按学习顺序排列）
const progressData = {
  nodes: [
    { id: 1, name: "DARVO", status: "completed", concept: "darvo", icon: "🐾" },
    { id: 2, name: "Love Bombing", status: "in_progress", concept: "love-bombing", icon: "🐾" },
    { id: 3, name: "煤气灯效应", status: "locked", concept: "gaslighting", icon: "🐾" },
    { id: 4, name: "习得性失助", status: "locked", concept: "learned-helplessness", icon: "🐾" },
    { id: 5, name: "创伤性结合", status: "locked", concept: "traumatic-bonding", icon: "🐾" }
  ],
  currentNode: 2
}
```

#### 2. 卡片管理系统 (card-manager.js)
- **轻松学习模式**：无答题压力，可直接跳过
- **温暖提示设计**：卡片底部显示"宝宝不想答题也可直接下一步哦"
- **翻转动画控制**：CSS3 transform + 触摸手势
- **直接导航功能**：学习按钮直接跳转对应HTML文件

#### 3. 概念导航系统 (concept-navigation.js)
- **学习顺序管理**：DARVO → Love Bombing → 煤气灯效应 → 习得性失助 → 创伤性结合
- **HTML文件映射**：
  ```javascript
  const conceptFiles = {
    "darvo": "darvo.html",
    "love-bombing": "love-bombing.html", 
    "gaslighting": "gaslighting.html",
    "learned-helplessness": "learned-helplessness.html",
    "traumatic-bonding": "traumatic-bonding.html"
  }
  ```
- **直接跳转功能**：点击学习按钮直接打开对应文章

#### 4. 章节练习系统 (chapter-practice.js)
- **占位卡片设计**：每个章节末尾显示3个空白练习卡片
- **可选参与模式**：用户可选择答题或直接下一步
- **温暖提示语**：使用亲切的"宝宝"称呼，降低学习压力

#### 5. 导航系统 (navigation.js)
- **进度轴导航**：点击节点快速跳转
- **HTML文件路由**：重命名后的文件路径管理
- **返回机制**：多层级返回逻辑

## 用户体验流程

### 移动端优先设计
**核心原则：手机浏览器优化为主，桌面端为辅**

### 学习路径设计（移动端优化）

#### 核心界面流程（温暖治愈模式）

1. **欢迎页面**：
   - **飘浮小猫背景**：5只小猫温柔飘浮，营造治愈氛围
   - **马卡龙配色**：温暖的黄-桃-粉渐变背景
   - **温暖介绍语**：使用治愈系文案
   - 大号学习按钮，便于触摸操作

2. **主学习界面（进度轴 + 小猫背景）**：
   - **小猫爪子进度轴**：5个🐾节点，替代传统圆点
   - **学习顺序显示**：DARVO → Love Bombing → 煤气灯效应 → 习得性失助 → 创伤性结合
   - **直接学习模式**：点击概念名称直接跳转对应HTML文章
   - **飘浮小猫**：背景持续的治愈动画

3. **概念文章页面**：
   - **iframe嵌入**：全屏显示对应的HTML文章
   - **文章内容**：
     - darvo.html
     - love-bombing.html  
     - gaslighting.html
     - learned-helplessness.html
     - traumatic-bonding.html
   - **返回按钮**：温暖设计的返回导航

4. **章节末尾练习区**：
   - **3个占位卡片**：每个概念文章末尾显示
   - **可选参与**：无答题压力，纯展示用途
   - **温暖提示**："宝宝不想答题也可直接下一步哦"
   - **下一步按钮**：直接进入下一个概念

5. **无压力导航**：
   - **自由跳转**：用户可随时点击进度轴回到任意概念
   - **无答题门槛**：所有内容都可直接访问
   - **治愈式体验**：始终有小猫陪伴，无学习压力

### 移动端交互优化
- **触摸友好**：最小44px触摸目标
- **手势支持**：滑动翻转卡片、双击缩放
- **性能优化**：懒加载、图片压缩
- **网络适配**：离线缓存、慢速网络优化
- **电池优化**：减少动画、降低CPU使用

### 屏幕适配策略
- **主要目标**：375px-414px 宽度（主流手机）
- **次要目标**：768px+ （平板/桌面）
- **断点设计**：
  - 小屏手机：320px-414px
  - 大屏手机：414px-768px
  - 平板：768px-1024px
  - 桌面：1024px+

## 部署方案

### GitHub Pages（确定方案）

**部署优势：**
- 完全免费，长期稳定
- 与Git版本控制天然集成
- 中国大陆访问稳定
- 支持自定义域名
- 自动HTTPS证书

**HTML文件移动端展示策略：**

#### 文件名处理（关键）
- **问题**：中文文件名在移动端URL中会导致404错误
- **解决方案**：复制并重命名为简单英文文件名

```bash
# 文件重命名示例
cp "习得性失助 - 维基百科.html" "learned-helplessness.html"
cp "爱情轰炸 - 维基百科.html" "love-bombing.html"
cp "创伤性结合 - 维基百科.html" "traumatic-bonding.html"
cp "煤气灯效应 - 维基百科.html" "gaslighting.html"
cp "DARVO - 维基百科.html" "darvo.html"
```

#### 部署流程
1. **文件准备**：重命名HTML文件为简单英文名
2. **Git操作**：
   ```bash
   git add *.html
   git commit -m "feat: 添加HTML文件供移动端访问"
   git push origin main
   ```
3. **GitHub Pages设置**：
   - Settings → Pages → Deploy from branch → main → / (root)
4. **访问URL格式**：
   ```
   https://USERNAME.github.io/REPO_NAME/learned-helplessness.html
   ```

#### 移动端优化
- 文件名只使用英文字母、数字、连字符
- 确保HTML文件自包含（内嵌CSS/JS）
- 保持简单的目录结构
- 单个文件不超过25MB

### 中国大陆移动端优化

#### 资源优化
- **字体**：使用系统字体，避免Google Fonts
- **图标**：内嵌SVG或本地图标文件
- **依赖管理**：避免外部API调用
- **文件自包含**：CSS/JS内嵌到HTML中

#### 移动端性能优化
- **加载速度**：文件压缩，减少HTTP请求
- **网络适配**：支持慢速网络加载
- **电池优化**：减少动画和CPU密集操作
- **缓存策略**：利用浏览器缓存机制

## 开发计划 (Milestone划分)

### Milestone 1: 温暖治愈系基础框架 ⏱️ 预计2-3天
**目标**：搭建治愈系UI架构，实现飘浮小猫和进度轴

**具体任务**：
- [x] 项目目录结构创建
- [ ] **飘浮小猫背景系统** (floating-cats.js)
  - 严格按照cat-bg-test.html实现小猫飘浮效果
  - 使用cat_gif_6.gif作为小猫背景图片
  - 3个飘浮小猫（120px，opacity: 0.3）+ 2个角落小猫（100px，不透明）
  - 马卡龙渐变背景：#ffeaa7 → #fab1a0 → #fd79a8
  - 飘浮动画：8s、6s、10s，角落小猫bounce: 3s
  - 响应式适配移动端
- [ ] **小猫爪子进度轴** (progress-axis.js)
  - 5个🐾节点替代传统圆点
  - 学习顺序：DARVO → Love Bombing → 煤气灯效应 → 习得性失助 → 创伤性结合
  - 点击导航功能（无门槛访问）
  - 温暖色彩设计
- [ ] **治愈系样式系统** (CSS)
  - cat-bg-test.html配色方案（严格照搬）
  - 半透明卡片（rgba(255, 255, 255, 0.95)，无backdrop-filter）
  - 卡片圆角：20px，padding: 30px，max-width: 600px
  - 温暖按钮设计：linear-gradient(135deg, #fd79a8, #e84393)

**验收标准**：
- 小猫在移动端正确飘浮，不干扰阅读
- 🐾进度轴显示正确，点击可导航
- 整体视觉风格温暖治愈

### Milestone 2: 无压力学习模式和占位卡片 ⏱️ 预计2-3天
**目标**：实现温暖无压力的学习体验，创建章节末尾占位卡片

**具体任务**：
- [ ] **概念导航系统** (concept-navigation.js)
  - 直接学习模式：点击概念名跳转HTML文件
  - HTML文件映射配置
  - 学习顺序管理（DARVO开始）
- [ ] **占位卡片系统** (placeholder-cards.js)
  - 每个章节末尾3个空白练习卡片
  - 温暖提示语："宝宝不想答题也可直接下一步哦"
  - 可选参与设计，无答题压力
  - 美观的占位符设计
- [ ] **温暖提示系统** (gentle-prompts.js)
  - 治愈系文案配置
  - 鼓励性语言使用
  - 无压力用户引导

**验收标准**：
- 点击概念可直接跳转对应HTML文件
- 章节末尾卡片显示正确，提示语温暖
- 用户可自由选择是否参与练习

### Milestone 3: HTML文件集成和移动端优化 ⏱️ 预计2-3天
**目标**：集成5个心理学概念HTML文件，优化移动端访问

**具体任务**：
- [ ] **HTML文件重命名处理**
  - 重命名为简单英文名避免移动端404：
    - DARVO相关 → darvo.html
    - 爱情轰炸相关 → love-bombing.html
    - 煤气灯效应相关 → gaslighting.html
    - 习得性失助相关 → learned-helplessness.html
    - 创伤性结合相关 → traumatic-bonding.html
- [ ] **iframe嵌入系统** (iframe-manager.js)
  - 全屏iframe显示HTML文章
  - 移动端滚动优化
  - 加载状态和错误处理
- [ ] **返回导航系统** (back-navigation.js)
  - 温暖设计的返回按钮
  - 从文章返回到进度轴
  - 保持用户学习状态

**验收标准**：
- 5个HTML文件在手机端正确显示
- iframe嵌入流畅，滚动体验良好  
- 返回导航功能正常，体验温暖

### Milestone 4: GitHub Pages部署和治愈体验优化 ⏱️ 预计1-2天
**目标**：部署到GitHub Pages，确保温暖治愈的移动端学习体验

**具体任务**：
- [ ] **GitHub Pages部署**
  - 仓库设置：main分支根目录部署
  - 确保重命名后的HTML文件正确访问
  - URL格式验证：https://username.github.io/repo/darvo.html
- [ ] **治愈体验优化**
  - 小猫飘浮动画性能优化
  - 温暖配色在不同设备的一致性
  - 加载速度优化（压缩图片、CSS）
- [ ] **中国大陆移动端测试**
  - 主流手机浏览器兼容性（微信、Chrome、Safari）
  - 不同屏幕尺寸的小猫显示效果
  - HTML文件访问速度和稳定性
- [ ] **用户体验验收**
  - 整体学习流程无障碍
  - 温暖提示语显示正确
  - 🐾进度轴交互流畅

**验收标准**：
- GitHub Pages稳定访问，所有HTML文件可正常打开
- 飘浮小猫在移动端表现良好，治愈感强
- 学习体验温暖无压力，符合设计理念

### 开发顺序建议
1. **先做飘浮小猫背景**：奠定温暖治愈的视觉基调
2. **再做🐾进度轴**：核心导航组件，无压力访问
3. **然后直接跳转功能**：点击概念名直接访问HTML文件
4. **接着做占位卡片**：章节末尾的温暖提示
5. **最后部署优化**：确保移动端治愈体验

### 关键设计重点
- **治愈系视觉**：飘浮小猫 + 马卡龙配色营造温暖氛围
- **无压力学习**：所有内容可直接访问，无答题门槛
- **移动端优先**：专为手机浏览器优化的触摸体验
- **温暖提示语**：使用"宝宝"等亲切称呼，降低学习焦虑
- **HTML文件重命名**：解决中文URL在移动端的404问题

## 技术要点总结

### 移动端优先
- 以手机浏览器为主要目标平台
- 响应式设计，触摸友好的交互
- 性能优化，适配慢速网络

### 部署策略
- GitHub Pages免费托管
- HTML文件重命名解决移动端访问问题
- 文件自包含，减少外部依赖

### 用户体验
- 卡片式学习流程，循序渐进
- 填空题验证机制
- 原始HTML文章无缝集成