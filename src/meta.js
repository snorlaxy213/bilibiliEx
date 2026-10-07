// ==UserScript==
// @name         BiliEx - B站直播间净化增强
// @namespace    https://github.com/juleschen/bilibiliEx
// @version      0.3.18
// @description  仿 DouyuEx 思路：净化 B 站直播间页面，只留播放器与右侧弹幕流；悬浮球设置面板；弹幕关键词过滤（标签式编辑）
// @author       Jules.chen
// @match        https://live.bilibili.com/*
// @run-at       document-start
// @noframes
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

/*
 * BiliEx - B站直播间净化增强
 * 项目结构参考 qianjiachun/douyuEx（MIT），净化选择器参考 festoney8/bilibili-cleaner（MIT）
 */
