---
id: 从Notion迁移笔记，及Obsidian配合OpenCode使用
aliases: []
tags:
  - Notion
  - Obsidian
  - Tools
  - AI
  - post
created: 2026-02-27 09:31
updated: 2026-02-27 09:31
---
## 前言

这次迁移其实更多的是为了尝鲜，以及本地化笔记的尝试。OpenCode 出来之后，个人认为这是最适合进行本地文件深度处理的应用了。再加上 Notion 完全封闭且各种 AI 功能都要付费，对比飞书没有优点下，我选择转向 Obsidian，虽然后者在同步和发布网页上同样收费极贵。

本文会从Notion迁移开始，讲解到Obsidian导入，添加Git及OpenCode插件，最后安装上对应的skill并实现若干功能结束。

> [!INFO] TL;DR
> - 从 Notion 导出并导入到 Obsidian，实现笔记本地化
> - 安装 OpenCode，并用 `/connect` 配置模型（例如 GitHub Copilot）
> - 安装 Skills，让 OpenCode 更擅长处理本地文件与 Obsidian 格式
> - 在 Vault 初始化 Git（配合 Obsidian Git 插件），让变更可追踪、可回滚
> - 用 BRAT 安装 OpenCode 的 Obsidian 插件，把 OpenCode 嵌进侧边栏

## 前置条件

- Obsidian Desktop（本文涉及社区插件与侧边栏）
- Git（用于 Obsidian Git 插件的版本管理）
- Node.js（用于 `npx openskills` 安装 Skills）
- OpenCode CLI（用于运行 OpenCode 本体）
- （可选）Bun（仅当你选择手动构建某些插件时）
- 建议 Vault 路径尽量使用英文（部分插件在中文路径上可能报错）

## Notion导入

导入并不困难，按照官方指引即可：[Obsidian 官方导入指引](https://publish.obsidian.md/help-zh/import)
注意Notion的导入可以在设置处直接下载整个工作区为Html文件，并且包含文件夹。

## 安装及导入Obsidian

安装参照：[Obsidian 官网](https://obsidian.md)

安装后，你需要指定一个文件夹作为你的笔记库的保存场所，建议指定在你的同步盘文件夹目录下新建个Obsidian文件夹（iCloud、OneDrive等）

Notion在导出成功后会发送邮件给你，按照链接下下来zip包即可。注意我使用Mac系统，出现了下下来解压成文件夹情况，重新压缩后会打包进我们不想要的__MACOSX等文件，我们后面处理。

官方核心插件开启importer这一插件，并选择zip文件导入，你的笔记就成功本地化了

### 导入相关问题

导入后存在几个问题：
1. 我们打包进入了太多无用的__MACOS X系统文件
2. 部分文件在压缩过程中由于编码问题出现了乱码

我们依次来解决这几个问题：
1. 我们直接手动删除对应文件夹下内容
2. 使用脚本[[如何修复Notion导入Obsidian笔记时出现乱码]]

### 安装OpenCode

参照官网：[OpenCode](https://opencode.ai)

```bash
curl -fsSL https://opencode.ai/install | bash
```

即可安装

以下配置参考：[OpenCode TUI 文档](https://opencode.ai/docs/zh-cn/tui/)
安装后在命令行输入`opencode`即可打开界面，输入`/connect`开始配置模型，一般建议按照指引，配置默认免费的Big Pickle进行试用。

### Github Copilot配置

ref：[GitHub Copilot Provider](https://opencode.ai/docs/zh-cn/providers/#github-copilot)

我订阅了Copilot pro，所以直接参照以上网页进行配置即可。

### 安装oh-my-opencode

ref：[oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode/tree/dev)

omo提供了一系列非常好用的插件及默认MCP等，专为opencode配置，推荐安装。

确定你按照以上配置好至少一个模型，使用免费的即可。
参照文档指引，将以下内容粘贴给opencode进行安装
```bash
curl -s https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md
```

### 安装对应Skills

ref：[openskills](https://github.com/numman-ali/openskills)

Skills与插件不同，本质是md文本文件，写好了对应的格式化Prompt指导LLM如何做，轻量且可模块化。要注意Skills分为全局和项目级，项目中可以直接配置只启用哪些Skills，默认走全局Skills。单个项目中不要使用太多重复相似Skills，会导致占用过多上下文、额外的Token使用，工具使用混乱等。

我们使用Claude Code标准的Skills，OpenCode对此通用，因此直接安装即可。

```bash
cd ~
npx openskills install anthropics/skills
npx openskills sync
```

执行完后会出现一系列Skills选项，直接回车安装到全局即可。

> [!INFO] 注意
> 如果没有进行`cd`操作，你安装的Skills会在当前目录下，如果你只想安装项目级，这个做法是可以的，如果你只想全局安装给opencode使用，请将其移动到`~/.config/opencode/skills`文件夹下

如果你看到了其他感兴趣的Skills，请参照以下形式安装：

```bash
npx openskills install your-org/your-skills
```
#### 安装Obsidian-skills

ref: [obsidian-skills](https://github.com/kepano/obsidian-skills)

对于我们的Obsidian，需要额外安装这个Skills，让我们的LLM能够更好地处理Obsidian的格式文本。

```bash
npx openskills install kepano/obsidian-skills
```

恭喜你，其实在这一步，我们的本地知识库+AI就已经搭建好了，你可以使用nvim+opencode的组合进行本地知识库操作
![[Pasted image 20260227141430.png]]

这里我们暂时跳过，继续专注在纯 Obsidian 内的整合

## Obsidian 安装插件

Obsidian 有丰富的插件生态，在 Setting - Core Plugins 处可以开启官方自带的插件，建议开启 Slash Command 插件实现类似 Notion 中新开行用"/"进行命令输入。

> [!INFO] 注意
> 以下的插件安装，都只是 **Obsidian** 本身的插件安装，它们提供了对外部功能的链接，而非直接提供功能
接下来我们来安装社区插件 Git 和 OpenCode ，在安装前，你需要开启允许社区插件功能，同样在设置处，核心插件下方，你可以看到社区插件，点进去并开启即可

### Git 安装与初始化

Git 本质上是一种版本控制系统，对于本地笔记库来说，主要作用是：
- **版本历史管理**：保留笔记的每一次修改历史，方便查看更改内容
- **修改回滚**：当 OpenCode 或其他操作不慎修改了笔记内容时，可以快速回滚到之前的版本
- **变更追踪**：清晰看到每次修改了哪些文件、修改了什么内容

#### 第一步：安装 Git

根据你的操作系统选择安装方式：

**macOS（推荐使用 Homebrew）**：
```bash
brew install git
```

如未安装 Homebrew，可先安装：
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Linux（以 Ubuntu/Debian 为例）**：
```bash
sudo apt update
sudo apt install git
```

**Windows**：
- 下载安装程序：[Git for Windows](https://git-scm.com/download/win)
- 运行安装程序，按默认配置即可（建议勾选 "Use Git Bash here" 获得更好的命令行体验）

**验证安装**：
```bash
git --version
```

#### 第二步：配置 Git 用户信息

安装完成后，需要配置 Git 的全局用户信息（这些信息会出现在每次提交记录中）：

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

例如：
```bash
git config --global user.name "张三"
git config --global user.email "zhangsan@example.com"
```

验证配置是否成功：
```bash
git config --global user.name
git config --global user.email
```

#### 第三步：初始化笔记库为 Git 仓库

在你的 Obsidian 笔记库文件夹下初始化 Git 仓库：

```bash
cd ~/your_vault   # 将 your_vault 替换为你的笔记库文件夹名
git init
```

成功后会看到类似输出：
```text
Initialized empty Git repository in /Users/yourname/your_vault/.git
```

#### 第四步：创建初始提交

初始化后建议立即创建第一次提交，这样可以建立一个参考点：

```bash
# 查看仓库当前状态
git status

# 将所有文件添加到暂存区
git add .

# 创建初始提交
git commit -m "Initial commit: Imported from Notion"
```

> [!TIP] 提示
> - 如果 Git 插件报错说找不到 git，可能需要重启 Obsidian 或设置 Git 的完整路径（在插件设置中）
> - 建议定期进行手动提交（Obsidian Git 插件有自动提交功能，可在插件设置中配置），养成保存版本的习惯
> - 如需查看提交历史，可使用命令 `git log --oneline` 查看简洁历史或 `git log` 查看详细历史
> - Obsidian Git 插件官方文档可参考：[Obsidian Git docs](https://publish.obsidian.md/git-doc)

如果后续你想要关联到远程仓库，你可以选择 Github 私有仓库（明文存储），也可以考虑 Gitea 等自建方式。

### OpenCode插件安装

#### 安装 BRAT 插件
该插件是用于安装 Beta 版测试插件，安装方式同上述 Git 插件安装方式，社区插件市场搜索并安装即可。

#### OpenCode插件安装

ref: [opencode-obsidian](https://github.com/mtymek/opencode-obsidian)

安装好 BRAT 插件后，可以通过命令面板快速安装 GitHub 上的插件：

```text
Cmd/Ctrl + P → BRAT: Add a beta plugin for testing → 输入 mtymek/opencode-obsidian
```

> [!TIP] 提示
> 如果仓库没有发布 Release（缺少 `main.js` / `manifest.json` 等构建产物），BRAT 可能会安装失败。

安装完成后，在其设置页面，选择增加新插件，并输入 `mtymek/opencode-obsidian` ，插件会自动安装。

> [!WARNING] 注意
> - Vault 路径包含中文时，可能报 `InvalidCharacterError`（btoa/Unicode）；建议使用英文路径或用符号链接指向英文路径

随后你可以看到你的 Obsidian 左侧出现了 OpenCode 插件图标，你可以按 `cmd/ctrl + shift + o` 来快速调出侧边栏

#### Opencode使用语法

你可以在聊天框处输入 "/" 和 "@" 来对应不同的输入，一般来说前者适用于各种命令及指定的Skills调用（你也可以让LLM自己调用！），后者用于切换模式及指定文件等。

一些基础常用用法：

```text
@Your_Vault/Your_Note 帮我解释下这篇笔记
```

```text
@Your_Vault/Your_Note /Skills 帮我把这篇笔记整理下，做成一个自动安装的Skills格式
```
注意要把你的Vault和Note替换成实际路径，一般来说到二级目录就可以检索到了，目前Obsidian这个Opencode插件似乎还不支持全局检索，得手动输入路径。

## 参考链接

- [Obsidian 官方导入指引](https://publish.obsidian.md/help-zh/import)
- [Obsidian 官网](https://obsidian.md)
- [OpenCode 官网](https://opencode.ai)
- [OpenCode 文档](https://opencode.ai/docs/)
- [OpenCode TUI 文档](https://opencode.ai/docs/zh-cn/tui/)
- [GitHub Copilot Provider（OpenCode）](https://opencode.ai/docs/zh-cn/providers/#github-copilot)
- [Obsidian Git docs](https://publish.obsidian.md/git-doc)
- [BRAT（GitHub）](https://github.com/TfTHacker/obsidian42-brat)
- [BRAT 文档](https://tfthacker.com/BRAT)
- [opencode-obsidian](https://github.com/mtymek/opencode-obsidian)
- [GitHub Changelog：Copilot 支持 OpenCode](https://github.blog/changelog/2026-01-16-github-copilot-now-supports-opencode/)

### （可选）其他插件推荐安装

个人不喜欢安装太多插件，但是以下几个还是十分好用的。
建议安装以下插件：

1. Focus Mode：按 `cmd/ctrl + option/alt + z` 一键进入沉浸写作模式
2. TypeWriter Mode：让你当前输入行永远屏幕居中，配合上述专注模式使用，无需手动翻页
3. Template： 将特定页面设置成模版，方便复用
