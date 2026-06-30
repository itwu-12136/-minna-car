import { Hono } from 'hono';

const api = new Hono();

// Initialize database schema
api.post('/init', async (c) => {
  const db = c.env.DB;
  const schema = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT DEFAULT '/api/avatar/default',
  bio TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  car_model TEXT DEFAULT '',
  location TEXT DEFAULT '',
  mood TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS post_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  post_id INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, post_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  post_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS hashtags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  post_count INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS post_hashtags (
  post_id INTEGER NOT NULL,
  hashtag_id INTEGER NOT NULL,
  PRIMARY KEY (post_id, hashtag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (hashtag_id) REFERENCES hashtags(id)
);
CREATE TABLE IF NOT EXISTS follows (
  follower_id INTEGER NOT NULL,
  following_id INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (follower_id, following_id),
  FOREIGN KEY (follower_id) REFERENCES users(id),
  FOREIGN KEY (following_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS bookmarks (
  user_id INTEGER NOT NULL,
  post_id INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, post_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  from_user_id INTEGER,
  type TEXT NOT NULL,
  post_id INTEGER,
  read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (from_user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_user_id INTEGER NOT NULL,
  to_user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (from_user_id) REFERENCES users(id),
  FOREIGN KEY (to_user_id) REFERENCES users(id)
);`;

  const statements = schema.split(';').filter(s => s.trim());
  for (const stmt of statements) {
    await db.prepare(stmt).run();
  }

  // Seed data
  const seeds = [
    `INSERT OR IGNORE INTO users (id, username, display_name, bio) VALUES (1, 'sora_car', 'SORA', '車が大好き！GR86オーナー')`,
    `INSERT OR IGNORE INTO users (id, username, display_name, bio) VALUES (2, 'cart_kun', 'カートくん', 'カスタムカー愛好家')`,
    `INSERT OR IGNORE INTO users (id, username, display_name, bio) VALUES (3, 'drive_diary', 'ドライブ日記', '週末ドライバー🚗')`,
    `INSERT OR IGNORE INTO users (id, username, display_name, bio) VALUES (4, 'maintenance_note', '整備記録簿', 'DIY整備が趣味です')`,
    `INSERT OR IGNORE INTO users (id, username, display_name, bio) VALUES (5, 'takumi_car', '車好きのたくみ', '峠を攻める！')`,
    `INSERT OR IGNORE INTO users (id, username, display_name, bio) VALUES (6, 'garage_life', 'ガレージライフ', 'ガレージでの時間が至福')`,
    `INSERT OR IGNORE INTO users (id, username, display_name, bio) VALUES (7, 'car_trip', '車と旅する人', '愛車と日本一周中')`,
    `INSERT OR IGNORE INTO posts (id, user_id, content, car_model, created_at) VALUES (1, 2, '新しいホイールに交換！やっぱりBBSは最高…\n#GR86 #BBS #カスタム', 'GR86', datetime('now', '-2 hours'))`,
    `INSERT OR IGNORE INTO posts (id, user_id, content, car_model, created_at) VALUES (2, 3, '海沿いのワインディング最高だった～\nやっぱりドライブはやめられない！\n#ドライブ #景色 #ロードスター', 'ロードスター', datetime('now', '-5 hours'))`,
    `INSERT OR IGNORE INTO posts (id, user_id, content, car_model, created_at) VALUES (3, 4, 'エンジンオイルとフィルター交換完了 🔧\nこれでまた気持ちよく走れるぞ！', '', datetime('now', '-1 day'))`,
    `INSERT OR IGNORE INTO hashtags (id, name, post_count) VALUES (1, 'みんなの愛車', 12345)`,
    `INSERT OR IGNORE INTO hashtags (id, name, post_count) VALUES (2, 'JDM', 8765)`,
    `INSERT OR IGNORE INTO hashtags (id, name, post_count) VALUES (3, '愛車紹介', 7890)`,
    `INSERT OR IGNORE INTO hashtags (id, name, post_count) VALUES (4, 'カスタムカー', 6543)`,
    `INSERT OR IGNORE INTO hashtags (id, name, post_count) VALUES (5, 'ドライブスポット', 5678)`,
    `INSERT OR IGNORE INTO hashtags (id, name, post_count) VALUES (6, 'GR86', 3210)`,
    `INSERT OR IGNORE INTO hashtags (id, name, post_count) VALUES (7, 'BBS', 1234)`,
    `INSERT OR IGNORE INTO hashtags (id, name, post_count) VALUES (8, 'カスタム', 4567)`,
    `INSERT OR IGNORE INTO hashtags (id, name, post_count) VALUES (9, 'ドライブ', 5432)`,
    `INSERT OR IGNORE INTO hashtags (id, name, post_count) VALUES (10, '景色', 2345)`,
    `INSERT OR IGNORE INTO hashtags (id, name, post_count) VALUES (11, 'ロードスター', 1890)`,
    `INSERT OR IGNORE INTO post_hashtags (post_id, hashtag_id) VALUES (1, 6)`,
    `INSERT OR IGNORE INTO post_hashtags (post_id, hashtag_id) VALUES (1, 7)`,
    `INSERT OR IGNORE INTO post_hashtags (post_id, hashtag_id) VALUES (1, 8)`,
    `INSERT OR IGNORE INTO post_hashtags (post_id, hashtag_id) VALUES (2, 9)`,
    `INSERT OR IGNORE INTO post_hashtags (post_id, hashtag_id) VALUES (2, 10)`,
    `INSERT OR IGNORE INTO post_hashtags (post_id, hashtag_id) VALUES (2, 11)`,
  ];

  for (const seed of seeds) {
    try { await db.prepare(seed).run(); } catch(e) { /* ignore duplicates */ }
  }

  return c.json({ success: true, message: 'Database initialized' });
});

// Get timeline posts
api.get('/posts', async (c) => {
  const db = c.env.DB;
  const page = parseInt(c.req.query('page') || '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  const posts = await db.prepare(`
    SELECT p.*, u.username, u.display_name, u.avatar_url,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
    FROM posts p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
  `).bind(limit, offset).all();

  // Get images and hashtags for each post
  for (const post of posts.results) {
    const images = await db.prepare(
      'SELECT image_url FROM post_images WHERE post_id = ? ORDER BY sort_order'
    ).bind(post.id).all();
    post.images = images.results.map(i => i.image_url);

    const hashtags = await db.prepare(`
      SELECT h.name FROM hashtags h
      JOIN post_hashtags ph ON h.id = ph.hashtag_id
      WHERE ph.post_id = ?
    `).bind(post.id).all();
    post.hashtags = hashtags.results.map(h => h.name);
  }

  return c.json({ posts: posts.results, page });
});

// Create post
api.post('/posts', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json();
  const { content, car_model, location, mood, user_id } = body;
  const userId = user_id || 1;

  const result = await db.prepare(
    'INSERT INTO posts (user_id, content, car_model, location, mood) VALUES (?, ?, ?, ?, ?)'
  ).bind(userId, content, car_model || '', location || '', mood || '').run();

  const postId = result.meta.last_row_id;

  // Extract and store hashtags
  const hashtagRegex = /#([\w\u3000-\u9fff\uf900-\ufaff]+)/g;
  let match;
  while ((match = hashtagRegex.exec(content)) !== null) {
    const tagName = match[1];
    await db.prepare(
      'INSERT OR IGNORE INTO hashtags (name, post_count) VALUES (?, 0)'
    ).bind(tagName).run();
    await db.prepare(
      'UPDATE hashtags SET post_count = post_count + 1 WHERE name = ?'
    ).bind(tagName).run();
    const tag = await db.prepare('SELECT id FROM hashtags WHERE name = ?').bind(tagName).first();
    if (tag) {
      await db.prepare(
        'INSERT OR IGNORE INTO post_hashtags (post_id, hashtag_id) VALUES (?, ?)'
      ).bind(postId, tag.id).run();
    }
  }

  return c.json({ success: true, post_id: postId });
});

// Like/unlike post
api.post('/posts/:id/like', async (c) => {
  const db = c.env.DB;
  const postId = parseInt(c.req.param('id'));
  const body = await c.req.json();
  const userId = body.user_id || 1;

  const existing = await db.prepare(
    'SELECT id FROM likes WHERE user_id = ? AND post_id = ?'
  ).bind(userId, postId).first();

  if (existing) {
    await db.prepare('DELETE FROM likes WHERE user_id = ? AND post_id = ?')
      .bind(userId, postId).run();
    return c.json({ liked: false });
  } else {
    await db.prepare('INSERT INTO likes (user_id, post_id) VALUES (?, ?)')
      .bind(userId, postId).run();
    return c.json({ liked: true });
  }
});

// Bookmark/unbookmark post
api.post('/posts/:id/bookmark', async (c) => {
  const db = c.env.DB;
  const postId = parseInt(c.req.param('id'));
  const body = await c.req.json();
  const userId = body.user_id || 1;

  const existing = await db.prepare(
    'SELECT user_id FROM bookmarks WHERE user_id = ? AND post_id = ?'
  ).bind(userId, postId).first();

  if (existing) {
    await db.prepare('DELETE FROM bookmarks WHERE user_id = ? AND post_id = ?')
      .bind(userId, postId).run();
    return c.json({ bookmarked: false });
  } else {
    await db.prepare('INSERT INTO bookmarks (user_id, post_id) VALUES (?, ?)')
      .bind(userId, postId).run();
    return c.json({ bookmarked: true });
  }
});

// Get comments for a post
api.get('/posts/:id/comments', async (c) => {
  const db = c.env.DB;
  const postId = parseInt(c.req.param('id'));

  const comments = await db.prepare(`
    SELECT c.*, u.username, u.display_name, u.avatar_url
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = ?
    ORDER BY c.created_at ASC
  `).bind(postId).all();

  return c.json({ comments: comments.results });
});

// Add comment
api.post('/posts/:id/comments', async (c) => {
  const db = c.env.DB;
  const postId = parseInt(c.req.param('id'));
  const body = await c.req.json();
  const userId = body.user_id || 1;

  await db.prepare(
    'INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)'
  ).bind(userId, postId, body.content).run();

  return c.json({ success: true });
});

// Get popular hashtags
api.get('/hashtags/popular', async (c) => {
  const db = c.env.DB;
  const hashtags = await db.prepare(
    'SELECT * FROM hashtags ORDER BY post_count DESC LIMIT 5'
  ).all();
  return c.json({ hashtags: hashtags.results });
});

// Search posts by hashtag
api.get('/hashtags/:name', async (c) => {
  const db = c.env.DB;
  const name = c.req.param('name');

  const posts = await db.prepare(`
    SELECT p.*, u.username, u.display_name, u.avatar_url,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
    FROM posts p
    JOIN users u ON p.user_id = u.id
    JOIN post_hashtags ph ON p.id = ph.post_id
    JOIN hashtags h ON ph.hashtag_id = h.id
    WHERE h.name = ?
    ORDER BY p.created_at DESC
  `).bind(name).all();

  for (const post of posts.results) {
    const images = await db.prepare(
      'SELECT image_url FROM post_images WHERE post_id = ? ORDER BY sort_order'
    ).bind(post.id).all();
    post.images = images.results.map(i => i.image_url);
  }

  return c.json({ posts: posts.results, hashtag: name });
});

// Get recommended users
api.get('/users/recommended', async (c) => {
  const db = c.env.DB;
  const users = await db.prepare(
    'SELECT id, username, display_name, avatar_url, bio FROM users WHERE id > 1 ORDER BY RANDOM() LIMIT 3'
  ).all();
  return c.json({ users: users.results });
});

// Get user profile
api.get('/users/:username', async (c) => {
  const db = c.env.DB;
  const username = c.req.param('username');

  const user = await db.prepare(
    'SELECT * FROM users WHERE username = ?'
  ).bind(username).first();

  if (!user) return c.json({ error: 'User not found' }, 404);

  const postCount = await db.prepare(
    'SELECT COUNT(*) as count FROM posts WHERE user_id = ?'
  ).bind(user.id).first();

  const followerCount = await db.prepare(
    'SELECT COUNT(*) as count FROM follows WHERE following_id = ?'
  ).bind(user.id).first();

  const followingCount = await db.prepare(
    'SELECT COUNT(*) as count FROM follows WHERE follower_id = ?'
  ).bind(user.id).first();

  return c.json({
    ...user,
    post_count: postCount.count,
    follower_count: followerCount.count,
    following_count: followingCount.count
  });
});

// Follow/unfollow user
api.post('/users/:id/follow', async (c) => {
  const db = c.env.DB;
  const targetId = parseInt(c.req.param('id'));
  const body = await c.req.json();
  const userId = body.user_id || 1;

  const existing = await db.prepare(
    'SELECT follower_id FROM follows WHERE follower_id = ? AND following_id = ?'
  ).bind(userId, targetId).first();

  if (existing) {
    await db.prepare('DELETE FROM follows WHERE follower_id = ? AND following_id = ?')
      .bind(userId, targetId).run();
    return c.json({ following: false });
  } else {
    await db.prepare('INSERT INTO follows (follower_id, following_id) VALUES (?, ?)')
      .bind(userId, targetId).run();
    return c.json({ following: true });
  }
});

// Search posts
api.get('/search', async (c) => {
  const db = c.env.DB;
  const query = c.req.query('q') || '';

  const posts = await db.prepare(`
    SELECT p.*, u.username, u.display_name, u.avatar_url,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.content LIKE ? OR u.display_name LIKE ? OR p.car_model LIKE ?
    ORDER BY p.created_at DESC
    LIMIT 20
  `).bind(`%${query}%`, `%${query}%`, `%${query}%`).all();

  for (const post of posts.results) {
    const images = await db.prepare(
      'SELECT image_url FROM post_images WHERE post_id = ? ORDER BY sort_order'
    ).bind(post.id).all();
    post.images = images.results.map(i => i.image_url);
  }

  return c.json({ posts: posts.results, query });
});

// Upload image to R2
api.post('/upload', async (c) => {
  const bucket = c.env.BUCKET;
  const formData = await c.req.formData();
  const file = formData.get('file');

  if (!file) return c.json({ error: 'No file provided' }, 400);

  const key = `images/${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
  await bucket.put(key, file.stream(), {
    httpMetadata: { contentType: file.type }
  });

  return c.json({ url: `/api/images/${key}` });
});

// Serve images from R2
api.get('/images/*', async (c) => {
  const bucket = c.env.BUCKET;
  const key = c.req.path.replace('/api/images/', '');
  const object = await bucket.get(key);

  if (!object) return c.notFound();

  const headers = new Headers();
  headers.set('Content-Type', object.httpMetadata?.contentType || 'image/jpeg');
  headers.set('Cache-Control', 'public, max-age=31536000');

  return new Response(object.body, { headers });
});

// Generate placeholder car images (SVG)
api.get('/placeholder/:name', async (c) => {
  const name = c.req.param('name');
  const colors = {
    car1: { bg: '#1a1a2e', car: '#e94560', text: 'GR86' },
    car2: { bg: '#ff6b35', car: '#004e89', text: 'Roadster' },
    car3: { bg: '#2d3436', car: '#00b894', text: 'Car' }
  };
  const color = colors[name] || colors.car1;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
    <rect width="800" height="500" fill="${color.bg}"/>
    <g transform="translate(400,250)">
      <ellipse cx="0" cy="60" rx="200" ry="30" fill="rgba(0,0,0,0.3)"/>
      <rect x="-180" y="-20" width="360" height="80" rx="20" fill="${color.car}"/>
      <rect x="-120" y="-70" width="220" height="60" rx="15" fill="${color.car}" opacity="0.9"/>
      <rect x="-100" y="-60" width="80" height="40" rx="5" fill="rgba(200,230,255,0.6)"/>
      <rect x="0" y="-60" width="90" height="40" rx="5" fill="rgba(200,230,255,0.6)"/>
      <circle cx="-120" cy="60" r="30" fill="#333"/>
      <circle cx="-120" cy="60" r="18" fill="#888"/>
      <circle cx="-120" cy="60" r="6" fill="#333"/>
      <circle cx="120" cy="60" r="30" fill="#333"/>
      <circle cx="120" cy="60" r="18" fill="#888"/>
      <circle cx="120" cy="60" r="6" fill="#333"/>
      <rect x="140" y="-10" width="50" height="20" rx="5" fill="rgba(255,255,200,0.8)"/>
      <rect x="-190" y="-10" width="50" height="20" rx="5" fill="rgba(255,100,100,0.8)"/>
    </g>
    <text x="400" y="450" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-size="24" font-family="sans-serif">${color.text}</text>
  </svg>`;

  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=31536000' }
  });
});

// Generate avatar SVGs
api.get('/avatar/:username', async (c) => {
  const username = c.req.param('username');
  const hash = [...username].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const hue = hash % 360;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
    <rect width="100" height="100" fill="hsl(${hue}, 60%, 80%)"/>
    <circle cx="50" cy="38" r="18" fill="hsl(${hue}, 60%, 40%)"/>
    <ellipse cx="50" cy="85" rx="30" ry="22" fill="hsl(${hue}, 60%, 40%)"/>
    <text x="50" y="45" text-anchor="middle" fill="white" font-size="16" font-family="sans-serif" font-weight="bold">${username.charAt(0).toUpperCase()}</text>
  </svg>`;

  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=3600' }
  });
});

export { api as apiRoutes };
