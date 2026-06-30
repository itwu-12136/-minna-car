import { Hono } from 'hono';
import { html } from 'hono/html';

const pages = new Hono();

function layout(title, content) {
  return html`<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - みんなの車部</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif; background: #f5f5f5; color: #333; line-height: 1.6; }
    a { color: inherit; text-decoration: none; }

    /* Layout */
    .app { display: flex; min-height: 100vh; }
    .sidebar { width: 240px; background: #fff; border-right: 1px solid #e5e5e5; position: fixed; top: 0; left: 0; bottom: 0; overflow-y: auto; z-index: 100; }
    .main { flex: 1; margin-left: 240px; margin-right: 320px; min-height: 100vh; }
    .right-sidebar { width: 320px; position: fixed; top: 0; right: 0; bottom: 0; overflow-y: auto; padding: 20px; background: #fff; border-left: 1px solid #e5e5e5; }

    /* Sidebar */
    .sidebar-header { padding: 24px 20px; border-bottom: 1px solid #f0f0f0; }
    .sidebar-header h1 { font-size: 22px; color: #333; font-weight: 800; }
    .sidebar-header h1 span { color: #f57c00; }
    .sidebar-header p { font-size: 12px; color: #999; margin-top: 2px; }
    .nav-menu { padding: 12px 0; }
    .nav-item { display: flex; align-items: center; padding: 12px 24px; font-size: 15px; color: #555; cursor: pointer; transition: all 0.15s; border-radius: 0 30px 30px 0; margin-right: 12px; }
    .nav-item:hover { background: #fff5ee; color: #f57c00; }
    .nav-item.active { color: #f57c00; font-weight: 700; }
    .nav-item svg { width: 22px; height: 22px; margin-right: 14px; flex-shrink: 0; }
    .nav-item .arrow { margin-left: auto; font-size: 12px; color: #ccc; }
    .post-btn { display: flex; align-items: center; justify-content: center; margin: 20px 20px; padding: 14px; background: #fff; color: #f57c00; border: 2px solid #f57c00; border-radius: 30px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .post-btn:hover { background: #f57c00; color: #fff; }
    .post-btn svg { width: 20px; height: 20px; margin-right: 8px; }
    .sidebar-user { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px 20px; border-top: 1px solid #f0f0f0; display: flex; align-items: center; background: #fff; }
    .sidebar-user img { width: 40px; height: 40px; border-radius: 50%; margin-right: 10px; }
    .sidebar-user-info { flex: 1; }
    .sidebar-user-info .name { font-weight: 700; font-size: 14px; }
    .sidebar-user-info .handle { font-size: 12px; color: #999; }
    .sidebar-user-actions { display: flex; gap: 8px; align-items: center; }
    .sidebar-user-actions button { background: none; border: none; cursor: pointer; color: #999; font-size: 16px; }

    /* Top bar */
    .topbar { background: #fff; border-bottom: 1px solid #e5e5e5; padding: 0 24px; display: flex; align-items: center; height: 56px; position: sticky; top: 0; z-index: 50; }
    .search-box { flex: 1; max-width: 500px; margin: 0 auto; position: relative; }
    .search-box input { width: 100%; padding: 10px 16px; border: 1px solid #e5e5e5; border-radius: 25px; font-size: 14px; background: #f8f8f8; outline: none; transition: border-color 0.2s; }
    .search-box input:focus { border-color: #f57c00; background: #fff; }
    .topbar-actions { display: flex; align-items: center; gap: 16px; position: absolute; right: 24px; }
    .topbar-actions button { background: none; border: none; cursor: pointer; color: #666; position: relative; }
    .topbar-actions button svg { width: 24px; height: 24px; }
    .topbar-actions .avatar { width: 36px; height: 36px; border-radius: 50%; cursor: pointer; }

    /* Feed */
    .feed { max-width: 680px; margin: 0 auto; padding: 0 16px; }

    /* Composer */
    .composer { background: #fff; border-radius: 12px; padding: 20px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .composer-top { display: flex; gap: 12px; }
    .composer-top img { width: 44px; height: 44px; border-radius: 50%; }
    .composer-input { flex: 1; }
    .composer-input textarea { width: 100%; border: none; resize: none; font-size: 15px; outline: none; min-height: 60px; font-family: inherit; color: #333; }
    .composer-input textarea::placeholder { color: #bbb; }
    .composer-bottom { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; padding-top: 12px; border-top: 1px solid #f0f0f0; }
    .composer-tools { display: flex; gap: 4px; }
    .composer-tool { display: flex; align-items: center; gap: 4px; padding: 8px 12px; border: none; background: none; color: #888; font-size: 13px; cursor: pointer; border-radius: 8px; transition: all 0.15s; }
    .composer-tool:hover { background: #f5f5f5; color: #f57c00; }
    .composer-tool svg { width: 18px; height: 18px; }
    .composer-submit { padding: 10px 28px; background: #f57c00; color: #fff; border: none; border-radius: 25px; font-size: 14px; font-weight: 700; cursor: pointer; transition: background 0.2s; }
    .composer-submit:hover { background: #e06800; }
    .composer-submit:disabled { background: #ffc896; cursor: not-allowed; }

    /* Post card */
    .post-card { background: #fff; border-radius: 12px; padding: 20px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .post-header { display: flex; align-items: center; margin-bottom: 12px; }
    .post-avatar { width: 44px; height: 44px; border-radius: 50%; margin-right: 10px; cursor: pointer; }
    .post-user-info { flex: 1; }
    .post-display-name { font-weight: 700; font-size: 15px; }
    .post-username { color: #999; font-size: 13px; margin-left: 6px; }
    .post-time { color: #999; font-size: 13px; margin-left: 6px; }
    .post-menu { background: none; border: none; cursor: pointer; color: #ccc; font-size: 20px; padding: 4px 8px; }
    .post-content { font-size: 15px; line-height: 1.7; margin-bottom: 12px; white-space: pre-wrap; }
    .post-content .hashtag { color: #f57c00; cursor: pointer; }
    .post-content .hashtag:hover { text-decoration: underline; }
    .post-image { width: 100%; border-radius: 12px; overflow: hidden; margin-bottom: 12px; }
    .post-image img { width: 100%; display: block; aspect-ratio: 16/10; object-fit: cover; }
    .post-actions { display: flex; align-items: center; gap: 0; }
    .post-action { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border: none; background: none; color: #888; font-size: 14px; cursor: pointer; border-radius: 8px; transition: all 0.15s; flex: 1; justify-content: center; }
    .post-action:hover { background: #f5f5f5; }
    .post-action.liked { color: #e74c3c; }
    .post-action.liked svg { fill: #e74c3c; }
    .post-action.bookmarked { color: #f57c00; }
    .post-action svg { width: 20px; height: 20px; }

    /* Right sidebar */
    .right-section { margin-bottom: 24px; }
    .right-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .right-section-header h3 { font-size: 16px; font-weight: 700; }
    .right-section-header a { font-size: 13px; color: #f57c00; }
    .hashtag-list { list-style: none; }
    .hashtag-item { display: flex; align-items: center; padding: 10px 0; cursor: pointer; }
    .hashtag-item:hover { opacity: 0.8; }
    .hashtag-rank { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #fff; margin-right: 12px; flex-shrink: 0; }
    .hashtag-rank.r1 { background: #e74c3c; }
    .hashtag-rank.r2 { background: #f57c00; }
    .hashtag-rank.r3 { background: #f5a623; }
    .hashtag-rank.r4 { background: #aaa; }
    .hashtag-rank.r5 { background: #aaa; }
    .hashtag-thumb { width: 44px; height: 44px; border-radius: 8px; margin-right: 12px; object-fit: cover; }
    .hashtag-info { flex: 1; }
    .hashtag-name { font-weight: 700; font-size: 14px; }
    .hashtag-count { font-size: 12px; color: #999; }

    .user-card { display: flex; align-items: center; padding: 10px 0; }
    .user-card img { width: 44px; height: 44px; border-radius: 50%; margin-right: 12px; }
    .user-card-info { flex: 1; }
    .user-card-name { font-weight: 700; font-size: 14px; }
    .user-card-handle { font-size: 12px; color: #999; }
    .follow-btn { padding: 6px 18px; border: 2px solid #f57c00; color: #f57c00; background: #fff; border-radius: 20px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .follow-btn:hover { background: #f57c00; color: #fff; }
    .follow-btn.following { background: #f57c00; color: #fff; }

    /* Modal */
    .modal-overlay { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 200; align-items: center; justify-content: center; }
    .modal-overlay.active { display: flex; }
    .modal { background: #fff; border-radius: 16px; width: 90%; max-width: 560px; max-height: 80vh; overflow-y: auto; }
    .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f0f0f0; }
    .modal-header h3 { font-size: 16px; }
    .modal-close { background: none; border: none; font-size: 24px; cursor: pointer; color: #999; }
    .modal-body { padding: 20px; }
    .comment-item { display: flex; gap: 10px; margin-bottom: 16px; }
    .comment-item img { width: 36px; height: 36px; border-radius: 50%; }
    .comment-body { flex: 1; }
    .comment-user { font-weight: 700; font-size: 13px; }
    .comment-text { font-size: 14px; margin-top: 2px; }
    .comment-time { font-size: 12px; color: #999; margin-top: 2px; }
    .comment-form { display: flex; gap: 10px; padding: 16px 20px; border-top: 1px solid #f0f0f0; }
    .comment-form input { flex: 1; padding: 10px 16px; border: 1px solid #e5e5e5; border-radius: 25px; font-size: 14px; outline: none; }
    .comment-form input:focus { border-color: #f57c00; }
    .comment-form button { padding: 10px 20px; background: #f57c00; color: #fff; border: none; border-radius: 25px; font-size: 14px; font-weight: 700; cursor: pointer; }

    /* Toast */
    .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #333; color: #fff; padding: 12px 24px; border-radius: 8px; font-size: 14px; z-index: 300; opacity: 0; transition: opacity 0.3s; pointer-events: none; }
    .toast.show { opacity: 1; }

    /* Upload preview */
    .upload-preview { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
    .upload-preview-item { position: relative; width: 80px; height: 80px; border-radius: 8px; overflow: hidden; }
    .upload-preview-item img { width: 100%; height: 100%; object-fit: cover; }
    .upload-preview-item .remove { position: absolute; top: 2px; right: 2px; width: 20px; height: 20px; background: rgba(0,0,0,0.6); color: #fff; border: none; border-radius: 50%; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; }

    /* Stats banner */
    .stats-banner { display: flex; gap: 12px; margin-bottom: 16px; }
    .stat-card { flex: 1; background: #fff; border-radius: 12px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); display: flex; align-items: center; gap: 12px; }
    .stat-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .stat-icon.discord { background: #5865F2; }
    .stat-icon.visitors { background: #f57c00; }
    .stat-icon svg { width: 24px; height: 24px; color: #fff; }
    .stat-info { flex: 1; }
    .stat-label { font-size: 12px; color: #999; }
    .stat-value { font-size: 22px; font-weight: 800; color: #333; }
    .stat-value .unit { font-size: 13px; font-weight: 500; color: #999; margin-left: 2px; }

    /* Section header for pages */
    .section-title { font-size: 18px; font-weight: 700; padding: 20px 0 12px; display: flex; align-items: center; gap: 8px; }
    .section-title svg { width: 22px; height: 22px; color: #f57c00; }
    .back-btn { background: none; border: none; cursor: pointer; color: #888; font-size: 14px; display: flex; align-items: center; gap: 4px; padding: 8px 0; }
    .back-btn:hover { color: #f57c00; }
    .back-btn svg { width: 18px; height: 18px; }

    /* Car model list */
    .car-model-list { list-style: none; }
    .car-model-item { display: flex; align-items: center; padding: 14px 16px; background: #fff; border-radius: 10px; margin-bottom: 8px; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.06); transition: all 0.15s; }
    .car-model-item:hover { background: #fff5ee; }
    .car-model-item svg { width: 20px; height: 20px; margin-right: 12px; color: #f57c00; }
    .car-model-item .model-name { flex: 1; font-weight: 600; }
    .car-model-item .model-count { color: #999; font-size: 13px; }

    /* Empty state */
    .empty-state { text-align: center; padding: 60px 20px; color: #999; }
    .empty-state svg { width: 48px; height: 48px; margin-bottom: 12px; color: #ddd; }
    .empty-state p { font-size: 15px; }

    /* Notification / Message items */
    .notif-item { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: #fff; border-radius: 10px; margin-bottom: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .notif-item img { width: 36px; height: 36px; border-radius: 50%; }
    .notif-text { flex: 1; font-size: 14px; }
    .notif-time { font-size: 12px; color: #999; }

    /* Responsive */
    @media (max-width: 1200px) {
      .right-sidebar { display: none; }
      .main { margin-right: 0; }
    }
    @media (max-width: 768px) {
      .sidebar { display: none; }
      .main { margin-left: 0; }
      .feed { padding: 0 8px; }
      .post-action { padding: 8px 8px; font-size: 13px; }
      .stats-banner { flex-direction: column; }
    }
  </style>
</head>
<body>
  <div class="app">
    <!-- Left Sidebar -->
    <nav class="sidebar">
      <div class="sidebar-header">
        <h1>みんなの<span>車</span>部</h1>
        <p>ー 車好きが集まるSNS ー</p>
      </div>
      <div class="nav-menu">
        <a href="#" class="nav-item active" data-page="home" onclick="navigateTo('home', this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          ホーム
        </a>
        <a href="#" class="nav-item" data-page="all" onclick="navigateTo('all', this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          みんなの投稿
        </a>
        <a href="#" class="nav-item" data-page="explore" onclick="navigateTo('explore', this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
          話題を探す
        </a>
        <a href="#" class="nav-item" data-page="cars" onclick="navigateTo('cars', this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          車種別
          <span class="arrow">›</span>
        </a>
        <a href="#" class="nav-item" data-page="garage" onclick="navigateTo('garage', this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v18H3z"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
          ガレージ
        </a>
        <a href="#" class="nav-item" data-page="reviews" onclick="navigateTo('reviews', this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          パーツレビュー
        </a>
        <a href="#" class="nav-item" data-page="favorites" onclick="navigateTo('favorites', this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          お気に入り
        </a>
        <a href="#" class="nav-item" data-page="messages" onclick="navigateTo('messages', this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          メッセージ
        </a>
        <a href="#" class="nav-item" data-page="notifications" onclick="navigateTo('notifications', this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          お知らせ
        </a>
      </div>
      <button class="post-btn" onclick="openComposer()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        投稿する
      </button>
      <div class="sidebar-user">
        <img src="/api/avatar/sora_car" alt="avatar">
        <div class="sidebar-user-info">
          <div class="name">SORA</div>
          <div class="handle">@sora_car</div>
        </div>
        <div class="sidebar-user-actions">
          <button>⌄</button>
          <button>⋯</button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main">
      <div class="topbar">
        <div class="search-box">
          <input type="text" placeholder="キーワードで検索" id="searchInput" onkeydown="if(event.key==='Enter')searchPosts()">
        </div>
        <div class="topbar-actions">
          <button>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </button>
          <button>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </button>
          <img src="/api/avatar/sora_car" alt="avatar" class="avatar">
        </div>
      </div>

      <div class="feed" id="feed">
        <!-- Stats Banner -->
        <div class="stats-banner">
          <div class="stat-card">
            <div class="stat-icon discord">
              <svg viewBox="0 0 24 24" fill="white"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
            </div>
            <div class="stat-info">
              <div class="stat-label">Discordメンバー</div>
              <div class="stat-value" id="discordCount">-<span class="unit">人</span></div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon visitors">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div class="stat-info">
              <div class="stat-label">サイト訪問者</div>
              <div class="stat-value" id="visitorCount">-<span class="unit">人</span></div>
            </div>
          </div>
        </div>

        <!-- Dynamic content area -->
        <div id="dynamicContent">
        <!-- Composer -->
        <div class="composer">
          <div class="composer-top">
            <img src="/api/avatar/sora_car" alt="avatar">
            <div class="composer-input">
              <textarea id="postContent" placeholder="いまどうしてる？" rows="2"></textarea>
              <div class="upload-preview" id="uploadPreview"></div>
            </div>
          </div>
          <div class="composer-bottom">
            <div class="composer-tools">
              <label class="composer-tool" for="imageUpload">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                写真・動画
              </label>
              <input type="file" id="imageUpload" accept="image/*" multiple style="display:none" onchange="handleImageSelect(event)">
              <button class="composer-tool">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                車種
              </button>
              <button class="composer-tool">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                場所
              </button>
              <button class="composer-tool">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                気分
              </button>
            </div>
            <button class="composer-submit" id="submitPost" onclick="submitPost()" disabled>投稿する</button>
          </div>
        </div>

        <!-- Posts will be loaded here -->
        <div id="postsContainer"></div>
        </div><!-- /dynamicContent -->
      </div>
    </main>

    <!-- Right Sidebar -->
    <aside class="right-sidebar">
      <div class="right-section">
        <div class="right-section-header">
          <h3>人気のハッシュタグ</h3>
          <a href="#">もっと見る ›</a>
        </div>
        <ul class="hashtag-list" id="hashtagList"></ul>
      </div>
      <div class="right-section">
        <div class="right-section-header">
          <h3>おすすめユーザー</h3>
          <a href="#">もっと見る ›</a>
        </div>
        <div id="recommendedUsers"></div>
      </div>
    </aside>
  </div>

  <!-- Comments Modal -->
  <div class="modal-overlay" id="commentsModal">
    <div class="modal">
      <div class="modal-header">
        <h3>コメント</h3>
        <button class="modal-close" onclick="closeComments()">&times;</button>
      </div>
      <div class="modal-body" id="commentsList"></div>
      <div class="comment-form">
        <input type="text" id="commentInput" placeholder="コメントを入力...">
        <button onclick="submitComment()">送信</button>
      </div>
    </div>
  </div>

  <!-- Toast -->
  <div class="toast" id="toast"></div>

  <script>
    const currentUser = { id: 1, username: 'sora_car', display_name: 'SORA' };
    let currentCommentPostId = null;
    let uploadedFiles = [];
    let currentPage = 'home';

    // Composer HTML (stored for re-insertion)
    const composerHTML = document.querySelector('.composer') ? document.querySelector('.composer').outerHTML : '';

    // Initialize
    document.addEventListener('DOMContentLoaded', async () => {
      // Init DB
      try { await fetch('/api/init', { method: 'POST' }); } catch(e) {}
      loadPosts();
      loadHashtags();
      loadRecommendedUsers();
      loadStats();

      // Track visit
      try { await fetch('/api/stats/visit', { method: 'POST' }); } catch(e) {}

      document.getElementById('postContent').addEventListener('input', function() {
        document.getElementById('submitPost').disabled = !this.value.trim();
      });
    });

    // Load stats counters
    async function loadStats() {
      // Discord
      try {
        const res = await fetch('/api/stats/discord');
        const data = await res.json();
        const el = document.getElementById('discordCount');
        if (data.members !== null) {
          el.innerHTML = data.members.toLocaleString() + '<span class="unit">人</span>';
        } else {
          el.innerHTML = '-<span class="unit">人</span>';
        }
      } catch(e) {}

      // Visitors
      try {
        const res = await fetch('/api/stats/visitors');
        const data = await res.json();
        document.getElementById('visitorCount').innerHTML = data.total.toLocaleString() + '<span class="unit">人</span>';
      } catch(e) {}
    }

    // Navigation
    function navigateTo(page, el) {
      if (el) {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        el.classList.add('active');
      }
      currentPage = page;
      const container = document.getElementById('dynamicContent');

      switch(page) {
        case 'home':
          showHomePage(container);
          break;
        case 'all':
          showAllPosts(container);
          break;
        case 'explore':
          showExplorePage(container);
          break;
        case 'cars':
          showCarsPage(container);
          break;
        case 'garage':
          showGaragePage(container);
          break;
        case 'reviews':
          showReviewsPage(container);
          break;
        case 'favorites':
          showFavoritesPage(container);
          break;
        case 'messages':
          showMessagesPage(container);
          break;
        case 'notifications':
          showNotificationsPage(container);
          break;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showHomePage(container) {
      container.innerHTML = '<div class="composer"><div class="composer-top"><img src="/api/avatar/sora_car" alt="avatar"><div class="composer-input"><textarea id="postContent" placeholder="いまどうしてる？" rows="2"></textarea><div class="upload-preview" id="uploadPreview"></div></div></div><div class="composer-bottom"><div class="composer-tools"><label class="composer-tool" for="imageUpload"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>写真・動画</label><input type="file" id="imageUpload" accept="image/*" multiple style="display:none" onchange="handleImageSelect(event)"><button class="composer-tool"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>車種</button><button class="composer-tool"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>場所</button><button class="composer-tool"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>気分</button></div><button class="composer-submit" id="submitPost" onclick="submitPost()" disabled>投稿する</button></div></div><div id="postsContainer"></div>';
      document.getElementById('postContent').addEventListener('input', function() {
        document.getElementById('submitPost').disabled = !this.value.trim();
      });
      loadPosts();
    }

    async function showAllPosts(container) {
      container.innerHTML = '<div class="section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>みんなの投稿</div><div id="postsContainer"></div>';
      loadPosts();
      showToast('最新の投稿を読み込みました');
    }

    async function showExplorePage(container) {
      container.innerHTML = '<div class="section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>話題を探す</div><div id="exploreHashtags"></div><div id="postsContainer"></div>';
      try {
        const res = await fetch('/api/hashtags/popular');
        const data = await res.json();
        const el = document.getElementById('exploreHashtags');
        el.innerHTML = '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px">' + data.hashtags.map(h =>
          '<button onclick="searchHashtag(\'' + h.name + '\')" style="padding:8px 16px;background:#fff;border:1px solid #e5e5e5;border-radius:20px;cursor:pointer;font-size:14px;transition:all 0.15s" onmouseover="this.style.borderColor=\'#f57c00\';this.style.color=\'#f57c00\'" onmouseout="this.style.borderColor=\'#e5e5e5\';this.style.color=\'#333\'">#' + h.name + ' <span style="color:#999;font-size:12px">' + h.post_count.toLocaleString() + '</span></button>'
        ).join('') + '</div>';
      } catch(e) {}
      loadPosts();
    }

    async function showCarsPage(container) {
      container.innerHTML = '<div class="section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>車種別</div><ul class="car-model-list" id="carModelList"></ul>';
      try {
        const res = await fetch('/api/cars');
        const data = await res.json();
        const list = document.getElementById('carModelList');
        const models = Object.entries(data.models).sort((a,b) => b[1] - a[1]);
        if (models.length === 0) {
          list.innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg><p>まだ車種の投稿がありません</p></div>';
        } else {
          list.innerHTML = models.map(([name, count]) =>
            '<li class="car-model-item" onclick="loadCarModel(\'' + name + '\')">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>' +
            '<span class="model-name">' + name + '</span>' +
            '<span class="model-count">' + count + '件の投稿</span></li>'
          ).join('');
        }
      } catch(e) {}
    }

    async function loadCarModel(model) {
      const container = document.getElementById('dynamicContent');
      container.innerHTML = '<button class="back-btn" onclick="navigateTo(\'cars\')">&larr; 車種別に戻る</button><div class="section-title">' + model + ' の投稿</div><div id="postsContainer"></div>';
      try {
        const res = await fetch('/api/cars/' + encodeURIComponent(model));
        const data = await res.json();
        renderPosts(data.posts);
      } catch(e) {}
    }

    async function showGaragePage(container) {
      container.innerHTML = '<div class="section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v18H3z"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>マイガレージ</div><div id="postsContainer"></div>';
      try {
        const res = await fetch('/api/garage?user_id=' + currentUser.id);
        const data = await res.json();
        if (data.posts.length === 0) {
          document.getElementById('postsContainer').innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v18H3z"/><path d="M3 9h18"/><path d="M9 21V9"/></svg><p>まだ投稿がありません<br>「投稿する」ボタンから最初の投稿をしましょう！</p></div>';
        } else {
          renderPosts(data.posts);
        }
      } catch(e) {}
    }

    function showReviewsPage(container) {
      container.innerHTML = '<div class="section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>パーツレビュー</div><div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg><p>パーツレビュー機能は近日公開予定です</p></div>';
    }

    async function showFavoritesPage(container) {
      container.innerHTML = '<div class="section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>お気に入り</div><div id="postsContainer"></div>';
      try {
        const res = await fetch('/api/bookmarks?user_id=' + currentUser.id);
        const data = await res.json();
        if (data.posts.length === 0) {
          document.getElementById('postsContainer').innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg><p>まだお気に入りがありません<br>投稿のブックマークアイコンをクリックして保存しましょう</p></div>';
        } else {
          renderPosts(data.posts);
        }
      } catch(e) {}
    }

    function showMessagesPage(container) {
      container.innerHTML = '<div class="section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>メッセージ</div><div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg><p>まだメッセージはありません</p></div>';
    }

    function showNotificationsPage(container) {
      container.innerHTML = '<div class="section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>お知らせ</div><div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg><p>新しいお知らせはありません</p></div>';
    }

    async function loadPosts() {
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        renderPosts(data.posts);
      } catch(e) {
        console.error('Failed to load posts:', e);
      }
    }

    async function loadAllPosts() {
      navigateTo('all', document.querySelector('[data-page="all"]'));
    }

    function renderPosts(posts) {
      const container = document.getElementById('postsContainer');
      container.innerHTML = posts.map(post => {
        const content = formatContent(post.content);
        const timeAgo = getTimeAgo(post.created_at);
        const images = (post.images || []).map(url =>
          '<div class="post-image"><img src="' + url + '" alt="投稿画像" loading="lazy"></div>'
        ).join('');

        return '<div class="post-card" data-id="' + post.id + '">' +
          '<div class="post-header">' +
            '<img src="/api/avatar/' + post.username + '" class="post-avatar" alt="">' +
            '<div class="post-user-info">' +
              '<span class="post-display-name">' + escapeHtml(post.display_name) + '</span>' +
              '<span class="post-username">@' + post.username + '</span>' +
              '<span class="post-time">・' + timeAgo + '</span>' +
            '</div>' +
            '<button class="post-menu">⋯</button>' +
          '</div>' +
          '<div class="post-content">' + content + '</div>' +
          images +
          '<div class="post-actions">' +
            '<button class="post-action" onclick="toggleLike(' + post.id + ', this)">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
              '<span>' + (post.like_count || 0) + '</span>' +
            '</button>' +
            '<button class="post-action" onclick="openComments(' + post.id + ')">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
              '<span>' + (post.comment_count || 0) + '</span>' +
            '</button>' +
            '<button class="post-action" onclick="sharePost(' + post.id + ')">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>' +
            '</button>' +
            '<button class="post-action" onclick="toggleBookmark(' + post.id + ', this)">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    function formatContent(text) {
      return escapeHtml(text).replace(/#([\w\u3000-\u9fff\uf900-\ufaff]+)/g,
        '<a class="hashtag" href="#" onclick="searchHashtag(\'$1\'); return false;">#$1</a>');
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    function getTimeAgo(dateStr) {
      const now = new Date();
      const date = new Date(dateStr + 'Z');
      const diff = Math.floor((now - date) / 1000);
      if (diff < 60) return diff + '秒前';
      if (diff < 3600) return Math.floor(diff / 60) + '分前';
      if (diff < 86400) return Math.floor(diff / 3600) + '時間前';
      if (diff < 604800) return Math.floor(diff / 86400) + '日前';
      return date.toLocaleDateString('ja-JP');
    }

    async function submitPost() {
      const content = document.getElementById('postContent').value.trim();
      if (!content) return;

      try {
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, user_id: currentUser.id })
        });
        if (res.ok) {
          document.getElementById('postContent').value = '';
          document.getElementById('submitPost').disabled = true;
          document.getElementById('uploadPreview').innerHTML = '';
          uploadedFiles = [];
          loadPosts();
          showToast('投稿しました！');
        }
      } catch(e) {
        showToast('投稿に失敗しました');
      }
    }

    async function toggleLike(postId, btn) {
      try {
        const res = await fetch('/api/posts/' + postId + '/like', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: currentUser.id })
        });
        const data = await res.json();
        btn.classList.toggle('liked', data.liked);
        const countSpan = btn.querySelector('span');
        const count = parseInt(countSpan.textContent);
        countSpan.textContent = data.liked ? count + 1 : count - 1;
      } catch(e) {}
    }

    async function toggleBookmark(postId, btn) {
      try {
        const res = await fetch('/api/posts/' + postId + '/bookmark', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: currentUser.id })
        });
        const data = await res.json();
        btn.classList.toggle('bookmarked', data.bookmarked);
        showToast(data.bookmarked ? 'ブックマークに追加しました' : 'ブックマークを解除しました');
      } catch(e) {}
    }

    async function openComments(postId) {
      currentCommentPostId = postId;
      document.getElementById('commentsModal').classList.add('active');
      try {
        const res = await fetch('/api/posts/' + postId + '/comments');
        const data = await res.json();
        renderComments(data.comments);
      } catch(e) {}
    }

    function closeComments() {
      document.getElementById('commentsModal').classList.remove('active');
      currentCommentPostId = null;
    }

    function renderComments(comments) {
      const container = document.getElementById('commentsList');
      if (comments.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">まだコメントはありません</p>';
        return;
      }
      container.innerHTML = comments.map(c =>
        '<div class="comment-item">' +
          '<img src="/api/avatar/' + c.username + '" alt="">' +
          '<div class="comment-body">' +
            '<div class="comment-user">' + escapeHtml(c.display_name) + ' <span style="color:#999;font-weight:400">@' + c.username + '</span></div>' +
            '<div class="comment-text">' + escapeHtml(c.content) + '</div>' +
            '<div class="comment-time">' + getTimeAgo(c.created_at) + '</div>' +
          '</div>' +
        '</div>'
      ).join('');
    }

    async function submitComment() {
      const input = document.getElementById('commentInput');
      const content = input.value.trim();
      if (!content || !currentCommentPostId) return;

      try {
        await fetch('/api/posts/' + currentCommentPostId + '/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, user_id: currentUser.id })
        });
        input.value = '';
        openComments(currentCommentPostId);
        loadPosts();
        showToast('コメントしました');
      } catch(e) {}
    }

    async function loadHashtags() {
      try {
        const res = await fetch('/api/hashtags/popular');
        const data = await res.json();
        const list = document.getElementById('hashtagList');
        list.innerHTML = data.hashtags.map((h, i) =>
          '<li class="hashtag-item" onclick="searchHashtag(\'' + h.name + '\')">' +
            '<span class="hashtag-rank r' + (i + 1) + '">' + (i + 1) + '</span>' +
            '<img src="/api/placeholder/car' + ((i % 3) + 1) + '" class="hashtag-thumb" alt="">' +
            '<div class="hashtag-info">' +
              '<div class="hashtag-name">#' + h.name + '</div>' +
              '<div class="hashtag-count">投稿数 ' + h.post_count.toLocaleString() + '件</div>' +
            '</div>' +
          '</li>'
        ).join('');
      } catch(e) {}
    }

    async function loadRecommendedUsers() {
      try {
        const res = await fetch('/api/users/recommended');
        const data = await res.json();
        const container = document.getElementById('recommendedUsers');
        container.innerHTML = data.users.map(u =>
          '<div class="user-card">' +
            '<img src="/api/avatar/' + u.username + '" alt="">' +
            '<div class="user-card-info">' +
              '<div class="user-card-name">' + escapeHtml(u.display_name) + '</div>' +
              '<div class="user-card-handle">@' + u.username + '</div>' +
            '</div>' +
            '<button class="follow-btn" onclick="toggleFollow(' + u.id + ', this)">フォロー</button>' +
          '</div>'
        ).join('');
      } catch(e) {}
    }

    async function toggleFollow(userId, btn) {
      try {
        const res = await fetch('/api/users/' + userId + '/follow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: currentUser.id })
        });
        const data = await res.json();
        btn.classList.toggle('following', data.following);
        btn.textContent = data.following ? 'フォロー中' : 'フォロー';
        showToast(data.following ? 'フォローしました' : 'フォロー解除しました');
      } catch(e) {}
    }

    async function searchPosts() {
      const query = document.getElementById('searchInput').value.trim();
      if (!query) { loadPosts(); return; }
      try {
        const res = await fetch('/api/search?q=' + encodeURIComponent(query));
        const data = await res.json();
        renderPosts(data.posts);
        showToast('"' + query + '" の検索結果: ' + data.posts.length + '件');
      } catch(e) {}
    }

    async function searchHashtag(name) {
      try {
        const res = await fetch('/api/hashtags/' + encodeURIComponent(name));
        const data = await res.json();
        renderPosts(data.posts);
        showToast('#' + name + ' の投稿: ' + data.posts.length + '件');
      } catch(e) {}
    }

    function sharePost(postId) {
      if (navigator.share) {
        navigator.share({ title: 'みんなの車部', url: window.location.origin + '/post/' + postId });
      } else {
        navigator.clipboard.writeText(window.location.origin + '/post/' + postId);
        showToast('リンクをコピーしました');
      }
    }

    function openComposer() {
      const textarea = document.getElementById('postContent');
      textarea.focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleImageSelect(event) {
      const files = event.target.files;
      const preview = document.getElementById('uploadPreview');
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const div = document.createElement('div');
          div.className = 'upload-preview-item';
          div.innerHTML = '<img src="' + e.target.result + '" alt=""><button class="remove" onclick="this.parentElement.remove()">&times;</button>';
          preview.appendChild(div);
        };
        reader.readAsDataURL(file);
        uploadedFiles.push(file);
      }
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
    }
  </script>
</body>
</html>`;
}

pages.get('/', (c) => {
  return c.html(layout('ホーム', ''));
});

pages.get('/post/:id', (c) => {
  return c.html(layout('投稿', ''));
});

export { pages as pageRoutes };
