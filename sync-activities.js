#!/usr/bin/env node
/**
 * sync-activities.js
 *
 * 让 waytoagi-activities.html 的活动数据保持新鲜。
 *
 * 两种模式：
 *   node sync-activities.js               # 默认：刷新 meta.generated_at（秒级，安全）
 *   node sync-activities.js --discover    # 默认 + 扫描活动父目录，发现尚未收录的新节点
 *
 * 工作机制：
 *   - 默认模式：只更新 meta.generated_at 为当前时间。页面"最后更新"徽章会变化，
 *     表示同步任务在正常运行。
 *   - 发现模式：调用 lark-cli wiki +node-list 扫描 6 个活动父目录，按白/黑名单
 *     过滤后，把真正的新活动追加到对应分类，并标记 NEW。
 *
 * 身份：默认 --as user；CI 设环境变量 LARK_AS=bot（已验证 bot 可读 WaytoAGI 公开库）
 *
 * 用法：
 *   node sync-activities.js                         # 本地快速刷新
 *   node sync-activities.js --discover              # 本地发现新活动
 *   LARK_AS=bot node sync-activities.js --discover  # CI 自动同步
 */

"use strict";

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Windows 用 git bash（单引号 JSON 才能正确传递），Linux/mac 用默认 shell
const IS_WIN = process.platform === "win32";
const SHELL = IS_WIN ? (process.env.SHELL || "bash") : "/bin/bash";

const SPACE_ID = "7226178700923011075";
const AS = process.env.LARK_AS || "user";
const DATA_FILE = path.join(__dirname, "activities.json");
const DISCOVER = process.argv.includes("--discover");

// 各分类 → 飞书父节点 token（用于发现新节点）
const PARENT_NODES = {
  camp: ["J9p1w8WLtiuEj3kUsQdcuHDOnCe"], // AI 训练营
  learn: ["UKqNw8Un0iaCsXkECfCcNkl0nGc"], // 晚 8 点共学
  contest: ["BK95wQC4git7mPkSNXAcBLZSnzb"], // AI 创作大赛
  brand: ["ABFtws0kTi5oWok7hxFcZbnDnNe"], // 社区孵化栏目
  coop: ["MVeHwsPzaiVOuBk1RWJcoOmTnVd"], // 重点活动与合作
  highlight: ["ALI2wySQBik5RakoWdac1MV9nde"], // 近期活动汇总
};

// 黑名单：标题命中这些词的节点跳过（管理类、过期、汇总、动态日志等）
const SKIP_KEYWORDS = [
  "管理规范", "实用指北", "学员须知", "比赛列表", "活动介绍",
  "汇总", "速览", "动态", "Black Friday", "已结束", "管理",
  "规范", "介绍说明", "说明", "每日社区",
];

// 黑名单正则：社区动态速览、往期回放等
const SKIP_REGEX = [
  /20\d{2}年\d+月\d+日\s*社区动态/,
  /^\d+月\d+日\s*社区动态/,
  /【已结束】/,
  /^\d{4}年$/, // 年份归档目录（2024/2025/2026）
];

// 白名单：标题至少命中一个活动类关键词，才视为活动
const ACTIVITY_KEYWORDS = [
  "活动", "训练营", "大会", "黑客松", "切磋", "共学", "直播",
  "比赛", "大赛", "挑战", "悬赏", "征集", "沙龙", "工作坊",
  "报名", "IVS", "WAIC", "OPC", "Adventure", "分享会", "Vol",
  "启事", "招募", "聚会", "After Party", "DemoDay", "快闪",
];

function lark(cmdSuffix) {
  return execSync(`lark-cli ${cmdSuffix}`, {
    encoding: "utf-8",
    shell: SHELL,
    maxBuffer: 64 * 1024 * 1024,
    env: {
      ...process.env,
      LARKSUITE_CLI_NO_UPDATE_NOTIFIER: "1",
      LARKSUITE_CLI_NO_SKILLS_NOTIFIER: "1",
    },
  });
}

function larkJSON(cmdSuffix) {
  return JSON.parse(lark(cmdSuffix));
}

function tokenFromUrl(url) {
  const m = String(url || "").match(/\/wiki\/([A-Za-z0-9]+)/);
  return m ? m[1] : null;
}

function listChildren(parentToken) {
  try {
    const r = larkJSON(
      `wiki +node-list --as ${AS} --space-id ${SPACE_ID} --parent-node-token ${parentToken} --page-size 50 --format json`
    );
    return (r.data && r.data.nodes) || [];
  } catch (e) {
    console.warn(`[warn] list ${parentToken} failed: ${e.message}`);
    return [];
  }
}

function isActivityTitle(title) {
  if (!title) return false;
  if (SKIP_KEYWORDS.some((k) => title.includes(k))) return false;
  if (SKIP_REGEX.some((re) => re.test(title))) return false;
  const lower = title.toLowerCase();
  return ACTIVITY_KEYWORDS.some((k) => lower.includes(k.toLowerCase()));
}

function main() {
  if (!fs.existsSync(DATA_FILE)) {
    console.error(`[error] ${DATA_FILE} not found.`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));

  // 收集所有已收录的 token（含 refs）与标题，用于双重去重
  const knownTokens = new Set();
  const knownTitles = new Set();
  data.categories.forEach((cat) => {
    (cat.items || []).forEach((item) => {
      (item.links || []).forEach((l) => {
        const t = tokenFromUrl(l.url);
        if (t) knownTokens.add(t);
      });
      if (item.title) knownTitles.add(item.title.trim());
    });
  });
  (data.refs || []).forEach((r) => {
    const t = tokenFromUrl(r.url);
    if (t) knownTokens.add(t);
  });

  console.log(`[info] known tokens: ${knownTokens.size}, titles: ${knownTitles.size}, identity: ${AS}, discover: ${DISCOVER}`);

  // 自动发现（仅 --discover 模式）
  let discovered = 0;
  if (DISCOVER) {
    Object.entries(PARENT_NODES).forEach(([catId, parents]) => {
      const cat = data.categories.find((c) => c.id === catId);
      if (!cat) return;
      parents.forEach((pt) => {
        listChildren(pt).forEach((n) => {
          if (knownTokens.has(n.node_token)) return;
          if (n.title && knownTitles.has(n.title.trim())) return; // 标题去重
          if (!isActivityTitle(n.title)) return;

          cat.items.push({
            tag: "自动发现",
            new: true,
            title: n.title,
            date: "",
            desc: "由 sync-activities.js 自动发现，建议人工补充日期与描述。",
            links: [
              {
                label: "查看详情",
                url: `https://waytoagi.feishu.cn/wiki/${n.node_token}`,
                primary: true,
              },
            ],
          });
          knownTokens.add(n.node_token);
          discovered++;
          console.log(`[new] ${catId}: ${n.title}`);
        });
      });
    });
    console.log(`[info] discovered ${discovered} new items`);
  }

  // 更新生成时间
  data.meta = data.meta || {};
  data.meta.generated_at = new Date().toISOString();

  // 写回（UTF-8 无 BOM，2 空格缩进）
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  console.log(`[done] ${DATA_FILE} updated at ${data.meta.generated_at}`);
}

main();
