<p align="center">
  <img src="icon.svg" width="120" alt="i-have-adhd for DeepSeek Harness" />
</p>

# i-have-adhd for DeepSeek Harness

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**[简体中文](#简体中文) · [English](#english)**

---

## 简体中文

把 [i-have-adhd](https://github.com/ayghri/i-have-adhd) 的 ADHD 友好输出规则带入 [DeepSeek Harness (dsh)](https://github.com/deepseek-ai/deepseek-harness)。不需要 ADHD 诊断即可使用。

**装完即生效，不需要任何命令或 tool call。** 安装后每个模型步骤的系统提示词末尾都会带上完整的 i-have-adhd 规则集（上游权威 10 条），助手的回复自动变成这个形状：行动放最前、多步骤编号、抑制跑题、每轮重述进度、给出具体耗时估计、让完成的工作可见。

### 安装

```bash
dsh plugin --profile web add git+https://github.com/gcnyin/dsh-i-have-adhd.git
```

`--profile` 必填（无默认值）。dsh 自带这些 profile，装到哪个就用哪个名字：

| Profile | 用途 |
| --- | --- |
| `web` | Web GUI（浏览器界面），本插件的主要使用场景 |
| `headless` | 一次性任务：执行完打印结果即退出，无 HTTP / 浏览器层 |
| `acp` | ACP 自动化：stdio JSON-RPC + 进程生命周期，供编辑器等客户端接入 |
| `sdk` | SDK 接入：stdio JSON-RPC，程序化驱动完整 Harness |
| `sdk-minimal` | 精简 SDK：JSON-RPC、单个 DeepSeek 适配器、持久 shell、JSONL 会话 |

重启 dsh 会话后生效。也可以在 Plugin Manager 里管理启用/禁用。

卸载：

```bash
dsh plugin --profile web remove i-have-adhd-dsh
```

本地开发安装（克隆本仓库后）：

```bash
dsh plugin --profile web add /absolute/path/to/dsh-i-have-adhd
```

### 工作方式

- 激活时读取随包发行的 [SKILL.md](SKILL.md)（上游权威规则集，去掉 YAML frontmatter），加上一段简短的 always-on 头，注册为一个 system-prompt section
- 使用最弱的扩展机制（普通 section 贡献，非 `complete`、不监听 assemble waterfall），不影响其他插件的提示词贡献
- `interpolate: false`：规则文本按字面注入，不解析 `{{variable}}`
- 零工具面占用：不注册任何 agent tool

### 配置

`cordis.patch.yml` 中该行的 `config`：

| 字段 | 默认 | 说明 |
| --- | --- | --- |
| `enabled` | `true` | `false` 时插件加载但不注入 section |
| `extraRules` | `''` | 追加在权威规则集之后的自定义文本（逐字注入） |

### 开关

- 本会话关闭：对助手说 `stop adhd mode` 或 `normal mode`
- 永久关闭：把该行 `config.enabled` 改为 `false`，或禁用 `i-have-adhd-dsh` 插件行

### 调整规则

1. 直接编辑 `SKILL.md`（与上游保持同步的最简单方式是覆盖为上游新版本），重启会话生效
2. 不动 `SKILL.md`，把补充规则写进 `config.extraRules`

### 常见问题

**需要手动开启吗？** 不需要。装上就是开的，这正是本插件与“tool 开关式”实现的区别。

**规则文本是上游原文吗？** 是，逐字内嵌上游 v0.4.1 的 `SKILL.md`（MIT 许可，见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)），因此能直接跟上游同步。

**和其他 dsh 的 ADHD 插件冲突吗？** section 名不同，技术上可共存；但同时注入两套规则没有意义，选一个即可。

### 致谢

- 规则集来自 [ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd) v0.4.1（MIT 许可）
- 上游致谢 *The Adult ADHD Tool Kit*（J. Russell Ramsay / Anthony L. Rostain）
- 本仓库的适配代码与图标为原创，MIT 许可

---

## English

Brings the [i-have-adhd](https://github.com/ayghri/i-have-adhd) ruleset to [DeepSeek Harness (dsh)](https://github.com/deepseek-ai/deepseek-harness). No ADHD diagnosis needed.

**Install once, always on — no commands, no tool calls.** After installation, every model step carries the full canonical ruleset (upstream's authoritative 10 rules) at the end of its system prompt, so replies come out shaped for an ADHD reader: action first, numbered steps, no tangents, restated progress, concrete time estimates, visible wins.

### Install

```bash
dsh plugin --profile web add git+https://github.com/gcnyin/dsh-i-have-adhd.git
```

`--profile` is required (no default). dsh ships these profiles — install into whichever one you use:

| Profile | Purpose |
| --- | --- |
| `web` | Web GUI (browser UI) — the main target of this plugin |
| `headless` | One-shot: answer one task, print the result, exit; no HTTP/browser layer |
| `acp` | ACP automation: stdio JSON-RPC + process lifecycle, for editor clients |
| `sdk` | SDK access: stdio JSON-RPC driving the full Harness programmatically |
| `sdk-minimal` | Minimal SDK: JSON-RPC, one DeepSeek adapter, persistent shell, JSONL sessions |

Restart your dsh session. Manage enable/disable in the Plugin Manager.

Remove:

```bash
dsh plugin --profile web remove i-have-adhd-dsh
```

Local development (after cloning this repo):

```bash
dsh plugin --profile web add /absolute/path/to/dsh-i-have-adhd
```

### How it works

- At activation, reads the bundled [SKILL.md](SKILL.md) (canonical upstream ruleset, YAML frontmatter stripped), prepends a short always-on header, and registers one system-prompt section
- Uses the weakest sufficient extension point (a plain section contribution — not `complete`, no `system-prompt/assemble` listener), so other plugins' prompt contributions are preserved
- `interpolate: false`: the ruleset is injected literally, never resolving `{{variable}}`
- Zero tool surface: registers no agent tools

### Configuration

Row `config` in `cordis.patch.yml`:

| Field | Default | Meaning |
| --- | --- | --- |
| `enabled` | `true` | `false` loads the plugin without contributing the section |
| `extraRules` | `''` | Extra text appended verbatim after the canonical ruleset |

### Switching it off

- For this session: say `stop adhd mode` or `normal mode`
- For good: set `config.enabled: false` on the row, or disable the `i-have-adhd-dsh` plugin row

### Tuning

1. Edit `SKILL.md` directly (overwrite with a newer upstream copy to sync), restart the session
2. Or leave `SKILL.md` alone and append your own rules via `config.extraRules`

### Credits

- Ruleset from [ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd) v0.4.1 (MIT); see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)
- Upstream credits *The Adult ADHD Tool Kit* by J. Russell Ramsay and Anthony L. Rostain
- Adapter code and icon are original to this repo, MIT licensed

---

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
