import { Hono } from 'hono';

const api = new Hono();

// Seed data
const SEED_USERS = [
  { id: 1, username: 'sora_car', display_name: 'SORA', bio: '車が大好き！GR86オーナー' },
  { id: 2, username: 'cart_kun', display_name: 'カートくん', bio: 'カスタムカー愛好家' },
  { id: 3, username: 'drive_diary', display_name: 'ドライブ日記', bio: '週末ドライバー' },
  { id: 4, username: 'maintenance_note', display_name: '整備記録簿', bio: 'DIY整備が趣味です' },
  { id: 5, username: 'takumi_car', display_name: '車好きのたくみ', bio: '峠を攻める！' },
  { id: 6, username: 'garage_life', display_name: 'ガレージライフ', bio: 'ガレージでの時間が至福' },
  { id: 7, username: 'car_trip', display_name: '車と旅する人', bio: '愛車と日本一周中' },
];

const SEED_POSTS = [
  {
    id: 1, user_id: 2,
    content: '新しいホイールに交換！やっぱりBBSは最高…\n#GR86 #BBS #カスタム',
    car_model: 'GR86', location: '', mood: '',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    images: ['/api/placeholder/car1'],
    hashtags: ['GR86', 'BBS', 'カスタム'],
  },
  {
    id: 2, user_id: 3,
    content: '海沿いのワインディング最高だった～\nやっぱりドライブはやめられない！\n#ドライブ #景色 #ロードスター',
    car_model: 'ロードスター', location: '', mood: '',
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    images: ['/api/placeholder/car2'],
    hashtags: ['ドライブ', '景色', 'ロードスター'],
  },
  {
    id: 3, user_id: 4,
    content: 'エンジンオイルとフィルター交換完了\nこれでまた気持ちよく走れるぞ！',
    car_model: '', location: '', mood: '',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    images: [],
    hashtags: [],
  },
];

const SEED_HASHTAGS = [
  { id: 1, name: 'みんなの愛車', post_count: 12345 },
  { id: 2, name: 'JDM', post_count: 8765 },
  { id: 3, name: '愛車紹介', post_count: 7890 },
  { id: 4, name: 'カスタムカー', post_count: 6543 },
  { id: 5, name: 'ドライブスポット', post_count: 5678 },
  { id: 6, name: 'GR86', post_count: 3210 },
  { id: 7, name: 'BBS', post_count: 1234 },
  { id: 8, name: 'カスタム', post_count: 4567 },
  { id: 9, name: 'ドライブ', post_count: 5432 },
  { id: 10, name: '景色', post_count: 2345 },
  { id: 11, name: 'ロードスター', post_count: 1890 },
];

const SEED_LIKES = { '1': [1,3,4,5,6,7], '2': [1,2,4,5], '3': [1,2,3] };
const SEED_COMMENTS = [
  { id: 1, user_id: 1, post_id: 1, content: 'かっこいい！', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, user_id: 5, post_id: 1, content: 'BBS似合ってますね！', created_at: new Date(Date.now() - 1800000).toISOString() },
  { id: 3, user_id: 1, post_id: 2, content: '最高のドライブですね！', created_at: new Date(Date.now() - 3600000).toISOString() },
];

const SEED_REVIEWS = [
  { id: 1, user_id: 2, part_name: 'BBS RF 18インチ', category: 'ホイール', car_model: 'GR86', rating: 5, content: '軽量で剛性も高く、見た目も最高。走りが変わりました！', pros: '軽量、高剛性、デザイン◎', cons: '価格が高い', created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 2, user_id: 4, part_name: 'CUSCO ストラットバー', category: 'サスペンション', car_model: 'GR86', rating: 4, content: 'コーナリングの安定感が増しました。取り付けも簡単。', pros: '剛性アップ、取付簡単', cons: '効果は体感しにくい場合も', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 3, user_id: 5, part_name: 'HKS マフラー Hi-Power', category: 'マフラー', car_model: 'GR86', rating: 5, content: '音が最高！低音の効いた良い音です。抜けも良くなった。', pros: '音質◎、排気効率アップ', cons: '車検対応要確認', created_at: new Date(Date.now() - 172800000).toISOString() },
];

const SEED_NOTIFICATIONS = [
  { id: 1, type: 'like', from_user_id: 3, target_user_id: 1, post_id: 1, read: false, created_at: new Date(Date.now() - 1800000).toISOString() },
  { id: 2, type: 'comment', from_user_id: 5, target_user_id: 2, post_id: 1, content: 'BBS似合ってますね！', read: false, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 3, type: 'follow', from_user_id: 7, target_user_id: 1, read: false, created_at: new Date(Date.now() - 7200000).toISOString() },
];

const SEED_MESSAGES = [
  { id: 1, from_user_id: 2, to_user_id: 1, content: 'SORAさん、今度ドライブ行きませんか？', read: false, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, from_user_id: 1, to_user_id: 2, content: 'いいですね！どこ行きます？', read: true, created_at: new Date(Date.now() - 3000000).toISOString() },
  { id: 3, from_user_id: 2, to_user_id: 1, content: '箱根ターンパイクとかどうですか？', read: false, created_at: new Date(Date.now() - 2400000).toISOString() },
  { id: 4, from_user_id: 5, to_user_id: 1, content: '峠の走行会、参加しませんか？', read: false, created_at: new Date(Date.now() - 7200000).toISOString() },
];

// Helper: get/set KV data with fallback to seed
async function getData(kv, key, seedData) {
  const val = await kv.get(key, 'json');
  if (val !== null) return val;
  await kv.put(key, JSON.stringify(seedData));
  return seedData;
}

async function hashString(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}

// Helper: add notification
async function addNotification(kv, type, fromUserId, targetUserId, extra = {}) {
  if (fromUserId === targetUserId) return;
  const notifications = await getData(kv, 'notifications', SEED_NOTIFICATIONS);
  let nextId = parseInt(await kv.get('next_notif_id') || String(SEED_NOTIFICATIONS.length + 1));
  notifications.unshift({
    id: nextId,
    type,
    from_user_id: fromUserId,
    target_user_id: targetUserId,
    read: false,
    created_at: new Date().toISOString(),
    ...extra,
  });
  await kv.put('notifications', JSON.stringify(notifications));
  await kv.put('next_notif_id', String(nextId + 1));
}

// Initialize with seed data
api.post('/init', async (c) => {
  const kv = c.env.KV;
  await kv.put('users', JSON.stringify(SEED_USERS));
  await kv.put('posts', JSON.stringify(SEED_POSTS));
  await kv.put('hashtags', JSON.stringify(SEED_HASHTAGS));
  await kv.put('likes', JSON.stringify(SEED_LIKES));
  await kv.put('comments', JSON.stringify(SEED_COMMENTS));
  await kv.put('follows', JSON.stringify({}));
  await kv.put('bookmarks', JSON.stringify({}));
  await kv.put('reviews', JSON.stringify(SEED_REVIEWS));
  await kv.put('notifications', JSON.stringify(SEED_NOTIFICATIONS));
  await kv.put('messages', JSON.stringify(SEED_MESSAGES));
  await kv.put('next_post_id', '4');
  await kv.put('next_comment_id', '4');
  await kv.put('next_review_id', '4');
  await kv.put('next_notif_id', '4');
  await kv.put('next_message_id', '5');
  return c.json({ success: true, message: 'Data initialized' });
});

// Get timeline posts
api.get('/posts', async (c) => {
  const kv = c.env.KV;
  const posts = await getData(kv, 'posts', SEED_POSTS);
  const users = await getData(kv, 'users', SEED_USERS);
  const likes = await getData(kv, 'likes', SEED_LIKES);
  const comments = await getData(kv, 'comments', SEED_COMMENTS);

  const userMap = {};
  for (const u of users) userMap[u.id] = u;

  const enriched = posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map(p => ({
    ...p,
    username: userMap[p.user_id]?.username || 'unknown',
    display_name: userMap[p.user_id]?.display_name || 'Unknown',
    avatar_url: '/api/avatar/' + (userMap[p.user_id]?.username || 'default'),
    like_count: (likes[p.id] || []).length,
    comment_count: comments.filter(cm => cm.post_id === p.id).length,
  }));

  return c.json({ posts: enriched });
});

// Get single post
api.get('/posts/:id', async (c) => {
  const kv = c.env.KV;
  const postId = parseInt(c.req.param('id'));
  const posts = await getData(kv, 'posts', SEED_POSTS);
  const users = await getData(kv, 'users', SEED_USERS);
  const likes = await getData(kv, 'likes', SEED_LIKES);
  const comments = await getData(kv, 'comments', SEED_COMMENTS);
  const userMap = {};
  for (const u of users) userMap[u.id] = u;

  const post = posts.find(p => p.id === postId);
  if (!post) return c.json({ error: 'Post not found' }, 404);

  return c.json({
    post: {
      ...post,
      username: userMap[post.user_id]?.username || 'unknown',
      display_name: userMap[post.user_id]?.display_name || 'Unknown',
      avatar_url: '/api/avatar/' + (userMap[post.user_id]?.username || 'default'),
      like_count: (likes[post.id] || []).length,
      comment_count: comments.filter(cm => cm.post_id === post.id).length,
    }
  });
});

// Create post
api.post('/posts', async (c) => {
  const kv = c.env.KV;
  const body = await c.req.json();
  const { content, car_model, location, mood, user_id } = body;
  const userId = user_id || 1;

  const posts = await getData(kv, 'posts', SEED_POSTS);
  const hashtags = await getData(kv, 'hashtags', SEED_HASHTAGS);
  let nextId = parseInt(await kv.get('next_post_id') || '4');

  const postHashtags = [];
  const hashtagRegex = /#([\w\u3000-\u9fff\uf900-\ufaff]+)/g;
  let match;
  while ((match = hashtagRegex.exec(content)) !== null) {
    postHashtags.push(match[1]);
    const existing = hashtags.find(h => h.name === match[1]);
    if (existing) {
      existing.post_count++;
    } else {
      hashtags.push({ id: hashtags.length + 1, name: match[1], post_count: 1 });
    }
  }

  const newPost = {
    id: nextId,
    user_id: userId,
    content,
    car_model: car_model || '',
    location: location || '',
    mood: mood || '',
    created_at: new Date().toISOString(),
    images: body.images || [],
    hashtags: postHashtags,
  };

  posts.unshift(newPost);
  await kv.put('posts', JSON.stringify(posts));
  await kv.put('hashtags', JSON.stringify(hashtags));
  await kv.put('next_post_id', String(nextId + 1));

  return c.json({ success: true, post_id: nextId });
});

// Delete post
api.delete('/posts/:id', async (c) => {
  const kv = c.env.KV;
  const postId = parseInt(c.req.param('id'));
  const body = await c.req.json();
  const userId = body.user_id || 1;

  const posts = await getData(kv, 'posts', SEED_POSTS);
  const idx = posts.findIndex(p => p.id === postId && p.user_id === userId);
  if (idx < 0) return c.json({ error: 'Not found or not owner' }, 403);

  posts.splice(idx, 1);
  await kv.put('posts', JSON.stringify(posts));

  // Clean up related data
  const likes = await getData(kv, 'likes', SEED_LIKES);
  delete likes[postId];
  await kv.put('likes', JSON.stringify(likes));

  const comments = await getData(kv, 'comments', SEED_COMMENTS);
  const filtered = comments.filter(cm => cm.post_id !== postId);
  await kv.put('comments', JSON.stringify(filtered));

  return c.json({ success: true });
});

// Like/unlike post
api.post('/posts/:id/like', async (c) => {
  const kv = c.env.KV;
  const postId = c.req.param('id');
  const body = await c.req.json();
  const userId = body.user_id || 1;

  const likes = await getData(kv, 'likes', SEED_LIKES);
  if (!likes[postId]) likes[postId] = [];

  const idx = likes[postId].indexOf(userId);
  if (idx >= 0) {
    likes[postId].splice(idx, 1);
    await kv.put('likes', JSON.stringify(likes));
    return c.json({ liked: false });
  } else {
    likes[postId].push(userId);
    await kv.put('likes', JSON.stringify(likes));
    // Get post owner for notification
    const posts = await getData(kv, 'posts', SEED_POSTS);
    const post = posts.find(p => p.id === parseInt(postId));
    if (post) await addNotification(kv, 'like', userId, post.user_id, { post_id: parseInt(postId) });
    return c.json({ liked: true });
  }
});

// Bookmark/unbookmark post
api.post('/posts/:id/bookmark', async (c) => {
  const kv = c.env.KV;
  const postId = c.req.param('id');
  const body = await c.req.json();
  const userId = body.user_id || 1;

  const bookmarks = await getData(kv, 'bookmarks', {});
  const key = `${userId}`;
  if (!bookmarks[key]) bookmarks[key] = [];

  const idx = bookmarks[key].indexOf(parseInt(postId));
  if (idx >= 0) {
    bookmarks[key].splice(idx, 1);
    await kv.put('bookmarks', JSON.stringify(bookmarks));
    return c.json({ bookmarked: false });
  } else {
    bookmarks[key].push(parseInt(postId));
    await kv.put('bookmarks', JSON.stringify(bookmarks));
    return c.json({ bookmarked: true });
  }
});

// Get comments for a post
api.get('/posts/:id/comments', async (c) => {
  const kv = c.env.KV;
  const postId = parseInt(c.req.param('id'));
  const comments = await getData(kv, 'comments', SEED_COMMENTS);
  const users = await getData(kv, 'users', SEED_USERS);
  const userMap = {};
  for (const u of users) userMap[u.id] = u;

  const postComments = comments
    .filter(cm => cm.post_id === postId)
    .map(cm => ({
      ...cm,
      username: userMap[cm.user_id]?.username || 'unknown',
      display_name: userMap[cm.user_id]?.display_name || 'Unknown',
    }));

  return c.json({ comments: postComments });
});

// Add comment
api.post('/posts/:id/comments', async (c) => {
  const kv = c.env.KV;
  const postId = parseInt(c.req.param('id'));
  const body = await c.req.json();
  const userId = body.user_id || 1;

  const comments = await getData(kv, 'comments', SEED_COMMENTS);
  let nextId = parseInt(await kv.get('next_comment_id') || '4');

  comments.push({
    id: nextId,
    user_id: userId,
    post_id: postId,
    content: body.content,
    created_at: new Date().toISOString(),
  });

  await kv.put('comments', JSON.stringify(comments));
  await kv.put('next_comment_id', String(nextId + 1));

  // Notification to post owner
  const posts = await getData(kv, 'posts', SEED_POSTS);
  const post = posts.find(p => p.id === postId);
  if (post) await addNotification(kv, 'comment', userId, post.user_id, { post_id: postId, content: body.content });

  return c.json({ success: true });
});

// Get popular hashtags
api.get('/hashtags/popular', async (c) => {
  const kv = c.env.KV;
  const hashtags = await getData(kv, 'hashtags', SEED_HASHTAGS);
  const sorted = [...hashtags].sort((a, b) => b.post_count - a.post_count).slice(0, 5);
  return c.json({ hashtags: sorted });
});

// Search posts by hashtag
api.get('/hashtags/:name', async (c) => {
  const kv = c.env.KV;
  const name = decodeURIComponent(c.req.param('name'));
  const posts = await getData(kv, 'posts', SEED_POSTS);
  const users = await getData(kv, 'users', SEED_USERS);
  const likes = await getData(kv, 'likes', SEED_LIKES);
  const comments = await getData(kv, 'comments', SEED_COMMENTS);
  const userMap = {};
  for (const u of users) userMap[u.id] = u;

  const filtered = posts.filter(p => (p.hashtags || []).includes(name) || p.content.includes('#' + name));
  const enriched = filtered.map(p => ({
    ...p,
    username: userMap[p.user_id]?.username || 'unknown',
    display_name: userMap[p.user_id]?.display_name || 'Unknown',
    like_count: (likes[p.id] || []).length,
    comment_count: comments.filter(cm => cm.post_id === p.id).length,
  }));

  return c.json({ posts: enriched, hashtag: name });
});

// Get recommended users
api.get('/users/recommended', async (c) => {
  const kv = c.env.KV;
  const users = await getData(kv, 'users', SEED_USERS);
  const recommended = users.filter(u => u.id > 1).sort(() => Math.random() - 0.5).slice(0, 3);
  return c.json({ users: recommended });
});

// Get user profile
api.get('/users/:username', async (c) => {
  const kv = c.env.KV;
  const username = c.req.param('username');
  const users = await getData(kv, 'users', SEED_USERS);
  const user = users.find(u => u.username === username);
  if (!user) return c.json({ error: 'User not found' }, 404);

  const posts = await getData(kv, 'posts', SEED_POSTS);
  const follows = await getData(kv, 'follows', {});
  const likes = await getData(kv, 'likes', SEED_LIKES);
  const comments = await getData(kv, 'comments', SEED_COMMENTS);
  const userMap = {};
  for (const u of users) userMap[u.id] = u;

  const userPosts = posts.filter(p => p.user_id === user.id).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map(p => ({
    ...p,
    username: userMap[p.user_id]?.username || 'unknown',
    display_name: userMap[p.user_id]?.display_name || 'Unknown',
    like_count: (likes[p.id] || []).length,
    comment_count: comments.filter(cm => cm.post_id === p.id).length,
  }));

  return c.json({
    ...user,
    post_count: userPosts.length,
    follower_count: Object.values(follows).filter(arr => arr.includes(user.id)).length,
    following_count: (follows[user.id] || []).length,
    posts: userPosts,
  });
});

// Follow/unfollow user
api.post('/users/:id/follow', async (c) => {
  const kv = c.env.KV;
  const targetId = parseInt(c.req.param('id'));
  const body = await c.req.json();
  const userId = body.user_id || 1;

  const follows = await getData(kv, 'follows', {});
  if (!follows[userId]) follows[userId] = [];

  const idx = follows[userId].indexOf(targetId);
  if (idx >= 0) {
    follows[userId].splice(idx, 1);
    await kv.put('follows', JSON.stringify(follows));
    return c.json({ following: false });
  } else {
    follows[userId].push(targetId);
    await kv.put('follows', JSON.stringify(follows));
    await addNotification(kv, 'follow', userId, targetId);
    return c.json({ following: true });
  }
});

// Search posts
api.get('/search', async (c) => {
  const kv = c.env.KV;
  const query = c.req.query('q') || '';
  const posts = await getData(kv, 'posts', SEED_POSTS);
  const users = await getData(kv, 'users', SEED_USERS);
  const likes = await getData(kv, 'likes', SEED_LIKES);
  const comments = await getData(kv, 'comments', SEED_COMMENTS);
  const userMap = {};
  for (const u of users) userMap[u.id] = u;

  const filtered = posts.filter(p => {
    const user = userMap[p.user_id];
    return p.content.includes(query) ||
      (user && user.display_name.includes(query)) ||
      (p.car_model && p.car_model.includes(query));
  });

  const enriched = filtered.map(p => ({
    ...p,
    username: userMap[p.user_id]?.username || 'unknown',
    display_name: userMap[p.user_id]?.display_name || 'Unknown',
    like_count: (likes[p.id] || []).length,
    comment_count: comments.filter(cm => cm.post_id === p.id).length,
  }));

  return c.json({ posts: enriched, query });
});

// Upload image to R2
api.post('/upload', async (c) => {
  const bucket = c.env.BUCKET;
  if (!bucket) return c.json({ error: 'Storage not available' }, 500);

  const formData = await c.req.formData();
  const file = formData.get('file');
  if (!file) return c.json({ error: 'No file provided' }, 400);

  const key = `images/${Date.now()}-${Math.random().toString(36).substring(7)}`;
  await bucket.put(key, file.stream(), {
    httpMetadata: { contentType: file.type }
  });

  return c.json({ url: `/api/images/${key}` });
});

// Serve images from R2
api.get('/images/*', async (c) => {
  const bucket = c.env.BUCKET;
  if (!bucket) return c.notFound();

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
  const configs = {
    car1: { bg: '#1a1a2e', accent: '#e94560', label: 'GR86', sky: '#16213e' },
    car2: { bg: '#0f3460', accent: '#e94560', label: 'Roadster', sky: '#533483' },
    car3: { bg: '#2d3436', accent: '#00b894', label: 'Car', sky: '#636e72' },
  };
  const cfg = configs[name] || configs.car1;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${cfg.sky}"/>
        <stop offset="100%" stop-color="${cfg.bg}"/>
      </linearGradient>
      <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2c2c2c"/>
        <stop offset="100%" stop-color="#1a1a1a"/>
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#sky)"/>
    <rect y="320" width="800" height="180" fill="url(#ground)"/>
    <line x1="0" y1="320" x2="800" y2="320" stroke="#444" stroke-width="2"/>
    <g transform="translate(400,300)">
      <ellipse cx="0" cy="50" rx="170" ry="20" fill="rgba(0,0,0,0.4)"/>
      <path d="M-160,0 L-140,-50 L-60,-80 L80,-80 L130,-50 L160,0 L160,20 L-160,20 Z" fill="${cfg.accent}"/>
      <path d="M-120,-50 L-60,-80 L80,-80 L130,-50 Z" fill="${cfg.accent}" opacity="0.85"/>
      <rect x="-110" y="-72" width="70" height="35" rx="4" fill="rgba(180,220,255,0.5)"/>
      <rect x="-20" y="-72" width="85" height="35" rx="4" fill="rgba(180,220,255,0.5)"/>
      <circle cx="-105" cy="20" r="24" fill="#222"/>
      <circle cx="-105" cy="20" r="16" fill="#666"/>
      <circle cx="-105" cy="20" r="5" fill="#222"/>
      <circle cx="105" cy="20" r="24" fill="#222"/>
      <circle cx="105" cy="20" r="16" fill="#666"/>
      <circle cx="105" cy="20" r="5" fill="#222"/>
      <rect x="130" y="-15" width="35" height="16" rx="4" fill="rgba(255,220,150,0.9)"/>
      <rect x="-165" y="-15" width="35" height="16" rx="4" fill="rgba(255,80,80,0.9)"/>
    </g>
    <text x="400" y="460" text-anchor="middle" fill="rgba(255,255,255,0.15)" font-size="28" font-family="sans-serif" font-weight="bold">${cfg.label}</text>
  </svg>`;

  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=31536000' }
  });
});

// Generate avatar SVGs
api.get('/avatar/:username', async (c) => {
  const username = c.req.param('username');
  const hash = [...username].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const hue = hash % 360;
  const initial = username.charAt(0).toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="50" fill="hsl(${hue}, 55%, 65%)"/>
    <text x="50" y="56" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="40" font-family="sans-serif" font-weight="bold">${initial}</text>
  </svg>`;

  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=3600' }
  });
});

// Discord server member count (no bots) via widget API
api.get('/stats/discord', async (c) => {
  const guildId = '1456636959123443898';
  try {
    const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/widget.json`);
    if (!res.ok) {
      return c.json({ members: null, error: 'Widget disabled' });
    }
    const data = await res.json();
    return c.json({
      members: data.presence_count || data.members?.length || 0,
      name: data.name || 'Discord',
    });
  } catch (e) {
    return c.json({ members: null, error: 'Failed to fetch' });
  }
});

// Site visitor tracking
api.post('/stats/visit', async (c) => {
  const kv = c.env.KV;
  const today = new Date().toISOString().slice(0, 10);

  const totalStr = await kv.get('stats_total_visitors');
  const total = parseInt(totalStr || '0') + 1;
  await kv.put('stats_total_visitors', String(total));

  const ip = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown';
  const dailyKey = `stats_daily_${today}`;
  const dailyData = await kv.get(dailyKey, 'json') || { count: 0, ips: [] };
  const ipHash = await hashString(ip);
  if (!dailyData.ips.includes(ipHash)) {
    dailyData.ips.push(ipHash);
    dailyData.count++;
    await kv.put(dailyKey, JSON.stringify(dailyData), { expirationTtl: 86400 * 7 });
  }

  return c.json({ total, today: dailyData.count });
});

api.get('/stats/visitors', async (c) => {
  const kv = c.env.KV;
  const totalStr = await kv.get('stats_total_visitors');
  const today = new Date().toISOString().slice(0, 10);
  const dailyData = await kv.get(`stats_daily_${today}`, 'json') || { count: 0 };
  return c.json({ total: parseInt(totalStr || '0'), today: dailyData.count });
});

// Get user's bookmarked posts
api.get('/bookmarks', async (c) => {
  const kv = c.env.KV;
  const userId = c.req.query('user_id') || '1';
  const bookmarks = await getData(kv, 'bookmarks', {});
  const postIds = bookmarks[userId] || [];
  const posts = await getData(kv, 'posts', SEED_POSTS);
  const users = await getData(kv, 'users', SEED_USERS);
  const likes = await getData(kv, 'likes', SEED_LIKES);
  const comments = await getData(kv, 'comments', SEED_COMMENTS);
  const userMap = {};
  for (const u of users) userMap[u.id] = u;

  const filtered = posts.filter(p => postIds.includes(p.id));
  const enriched = filtered.map(p => ({
    ...p,
    username: userMap[p.user_id]?.username || 'unknown',
    display_name: userMap[p.user_id]?.display_name || 'Unknown',
    like_count: (likes[p.id] || []).length,
    comment_count: comments.filter(cm => cm.post_id === p.id).length,
  }));

  return c.json({ posts: enriched });
});

// Get posts by car model
api.get('/cars', async (c) => {
  const kv = c.env.KV;
  const posts = await getData(kv, 'posts', SEED_POSTS);
  const models = {};
  for (const p of posts) {
    if (p.car_model) {
      models[p.car_model] = (models[p.car_model] || 0) + 1;
    }
  }
  return c.json({ models });
});

api.get('/cars/:model', async (c) => {
  const kv = c.env.KV;
  const model = decodeURIComponent(c.req.param('model'));
  const posts = await getData(kv, 'posts', SEED_POSTS);
  const users = await getData(kv, 'users', SEED_USERS);
  const likes = await getData(kv, 'likes', SEED_LIKES);
  const comments = await getData(kv, 'comments', SEED_COMMENTS);
  const userMap = {};
  for (const u of users) userMap[u.id] = u;

  const filtered = posts.filter(p => p.car_model === model);
  const enriched = filtered.map(p => ({
    ...p,
    username: userMap[p.user_id]?.username || 'unknown',
    display_name: userMap[p.user_id]?.display_name || 'Unknown',
    like_count: (likes[p.id] || []).length,
    comment_count: comments.filter(cm => cm.post_id === p.id).length,
  }));

  return c.json({ posts: enriched, model });
});

// Get user's own posts (garage)
api.get('/garage', async (c) => {
  const kv = c.env.KV;
  const userId = parseInt(c.req.query('user_id') || '1');
  const posts = await getData(kv, 'posts', SEED_POSTS);
  const users = await getData(kv, 'users', SEED_USERS);
  const likes = await getData(kv, 'likes', SEED_LIKES);
  const comments = await getData(kv, 'comments', SEED_COMMENTS);
  const userMap = {};
  for (const u of users) userMap[u.id] = u;

  const filtered = posts.filter(p => p.user_id === userId);
  const enriched = filtered.map(p => ({
    ...p,
    username: userMap[p.user_id]?.username || 'unknown',
    display_name: userMap[p.user_id]?.display_name || 'Unknown',
    like_count: (likes[p.id] || []).length,
    comment_count: comments.filter(cm => cm.post_id === p.id).length,
  }));

  return c.json({ posts: enriched });
});

// ===== NOTIFICATIONS =====
api.get('/notifications', async (c) => {
  const kv = c.env.KV;
  const userId = parseInt(c.req.query('user_id') || '1');
  const notifications = await getData(kv, 'notifications', SEED_NOTIFICATIONS);
  const users = await getData(kv, 'users', SEED_USERS);
  const userMap = {};
  for (const u of users) userMap[u.id] = u;

  const userNotifs = notifications
    .filter(n => n.target_user_id === userId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 50)
    .map(n => ({
      ...n,
      from_username: userMap[n.from_user_id]?.username || 'unknown',
      from_display_name: userMap[n.from_user_id]?.display_name || 'Unknown',
    }));

  return c.json({ notifications: userNotifs });
});

api.post('/notifications/read', async (c) => {
  const kv = c.env.KV;
  const body = await c.req.json();
  const userId = body.user_id || 1;
  const notifications = await getData(kv, 'notifications', SEED_NOTIFICATIONS);
  for (const n of notifications) {
    if (n.target_user_id === userId) n.read = true;
  }
  await kv.put('notifications', JSON.stringify(notifications));
  return c.json({ success: true });
});

api.get('/notifications/unread', async (c) => {
  const kv = c.env.KV;
  const userId = parseInt(c.req.query('user_id') || '1');
  const notifications = await getData(kv, 'notifications', SEED_NOTIFICATIONS);
  const count = notifications.filter(n => n.target_user_id === userId && !n.read).length;
  return c.json({ count });
});

// ===== MESSAGES =====
api.get('/messages/conversations', async (c) => {
  const kv = c.env.KV;
  const userId = parseInt(c.req.query('user_id') || '1');
  const messages = await getData(kv, 'messages', SEED_MESSAGES);
  const users = await getData(kv, 'users', SEED_USERS);
  const userMap = {};
  for (const u of users) userMap[u.id] = u;

  // Group by other user
  const convMap = {};
  for (const m of messages) {
    if (m.from_user_id !== userId && m.to_user_id !== userId) continue;
    const otherId = m.from_user_id === userId ? m.to_user_id : m.from_user_id;
    if (!convMap[otherId] || new Date(m.created_at) > new Date(convMap[otherId].created_at)) {
      convMap[otherId] = m;
    }
  }

  const conversations = Object.entries(convMap).map(([otherId, lastMsg]) => {
    const other = userMap[parseInt(otherId)];
    const unread = messages.filter(m => m.from_user_id === parseInt(otherId) && m.to_user_id === userId && !m.read).length;
    return {
      user_id: parseInt(otherId),
      username: other?.username || 'unknown',
      display_name: other?.display_name || 'Unknown',
      last_message: lastMsg.content,
      last_time: lastMsg.created_at,
      unread,
    };
  }).sort((a, b) => new Date(b.last_time) - new Date(a.last_time));

  return c.json({ conversations });
});

api.get('/messages/thread/:userId', async (c) => {
  const kv = c.env.KV;
  const currentUserId = parseInt(c.req.query('user_id') || '1');
  const otherUserId = parseInt(c.req.param('userId'));
  const messages = await getData(kv, 'messages', SEED_MESSAGES);
  const users = await getData(kv, 'users', SEED_USERS);
  const userMap = {};
  for (const u of users) userMap[u.id] = u;

  const thread = messages
    .filter(m => (m.from_user_id === currentUserId && m.to_user_id === otherUserId) ||
                 (m.from_user_id === otherUserId && m.to_user_id === currentUserId))
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map(m => ({
      ...m,
      from_username: userMap[m.from_user_id]?.username || 'unknown',
      from_display_name: userMap[m.from_user_id]?.display_name || 'Unknown',
      is_mine: m.from_user_id === currentUserId,
    }));

  // Mark as read
  for (const m of messages) {
    if (m.from_user_id === otherUserId && m.to_user_id === currentUserId) m.read = true;
  }
  await kv.put('messages', JSON.stringify(messages));

  const other = userMap[otherUserId];
  return c.json({ thread, other_user: other || { username: 'unknown', display_name: 'Unknown' } });
});

api.post('/messages/send', async (c) => {
  const kv = c.env.KV;
  const body = await c.req.json();
  const fromId = body.user_id || 1;
  const toId = body.to_user_id;
  const content = body.content;

  if (!toId || !content) return c.json({ error: 'Missing fields' }, 400);

  const messages = await getData(kv, 'messages', SEED_MESSAGES);
  let nextId = parseInt(await kv.get('next_message_id') || '5');

  messages.push({
    id: nextId,
    from_user_id: fromId,
    to_user_id: toId,
    content,
    read: false,
    created_at: new Date().toISOString(),
  });

  await kv.put('messages', JSON.stringify(messages));
  await kv.put('next_message_id', String(nextId + 1));

  await addNotification(kv, 'message', fromId, toId, { content });

  return c.json({ success: true, message_id: nextId });
});

api.get('/messages/unread', async (c) => {
  const kv = c.env.KV;
  const userId = parseInt(c.req.query('user_id') || '1');
  const messages = await getData(kv, 'messages', SEED_MESSAGES);
  const count = messages.filter(m => m.to_user_id === userId && !m.read).length;
  return c.json({ count });
});

// ===== PARTS REVIEWS =====
api.get('/reviews', async (c) => {
  const kv = c.env.KV;
  const reviews = await getData(kv, 'reviews', SEED_REVIEWS);
  const users = await getData(kv, 'users', SEED_USERS);
  const userMap = {};
  for (const u of users) userMap[u.id] = u;

  const category = c.req.query('category');
  let filtered = reviews;
  if (category) filtered = reviews.filter(r => r.category === category);

  const enriched = filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map(r => ({
    ...r,
    username: userMap[r.user_id]?.username || 'unknown',
    display_name: userMap[r.user_id]?.display_name || 'Unknown',
  }));

  return c.json({ reviews: enriched });
});

api.post('/reviews', async (c) => {
  const kv = c.env.KV;
  const body = await c.req.json();
  const reviews = await getData(kv, 'reviews', SEED_REVIEWS);
  let nextId = parseInt(await kv.get('next_review_id') || '4');

  const newReview = {
    id: nextId,
    user_id: body.user_id || 1,
    part_name: body.part_name,
    category: body.category || 'その他',
    car_model: body.car_model || '',
    rating: body.rating || 5,
    content: body.content,
    pros: body.pros || '',
    cons: body.cons || '',
    created_at: new Date().toISOString(),
  };

  reviews.unshift(newReview);
  await kv.put('reviews', JSON.stringify(reviews));
  await kv.put('next_review_id', String(nextId + 1));

  return c.json({ success: true, review_id: nextId });
});

api.get('/reviews/categories', async (c) => {
  return c.json({ categories: ['ホイール', 'タイヤ', 'マフラー', 'サスペンション', 'ブレーキ', 'エアロ', 'インテリア', 'エンジン', 'ライト', 'オイル・ケミカル', 'その他'] });
});

export { api as apiRoutes };
