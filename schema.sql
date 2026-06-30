-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT DEFAULT '/api/avatar/default',
  bio TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Posts table
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

-- Post images
CREATE TABLE IF NOT EXISTS post_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Likes
CREATE TABLE IF NOT EXISTS likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  post_id INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, post_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  post_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Hashtags
CREATE TABLE IF NOT EXISTS hashtags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  post_count INTEGER DEFAULT 0
);

-- Post-Hashtag junction
CREATE TABLE IF NOT EXISTS post_hashtags (
  post_id INTEGER NOT NULL,
  hashtag_id INTEGER NOT NULL,
  PRIMARY KEY (post_id, hashtag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (hashtag_id) REFERENCES hashtags(id)
);

-- Follows
CREATE TABLE IF NOT EXISTS follows (
  follower_id INTEGER NOT NULL,
  following_id INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (follower_id, following_id),
  FOREIGN KEY (follower_id) REFERENCES users(id),
  FOREIGN KEY (following_id) REFERENCES users(id)
);

-- Bookmarks
CREATE TABLE IF NOT EXISTS bookmarks (
  user_id INTEGER NOT NULL,
  post_id INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, post_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Notifications
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

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_user_id INTEGER NOT NULL,
  to_user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (from_user_id) REFERENCES users(id),
  FOREIGN KEY (to_user_id) REFERENCES users(id)
);

-- Seed data: users
INSERT OR IGNORE INTO users (id, username, display_name, avatar_url, bio) VALUES
(1, 'sora_car', 'SORA', '/api/avatar/sora_car', '車が大好き！GR86オーナー'),
(2, 'cart_kun', 'カートくん', '/api/avatar/cart_kun', 'カスタムカー愛好家'),
(3, 'drive_diary', 'ドライブ日記', '/api/avatar/drive_diary', '週末ドライバー🚗'),
(4, 'maintenance_note', '整備記録簿', '/api/avatar/maintenance_note', 'DIY整備が趣味です'),
(5, 'takumi_car', '車好きのたくみ', '/api/avatar/takumi_car', '峠を攻める！'),
(6, 'garage_life', 'ガレージライフ', '/api/avatar/garage_life', 'ガレージでの時間が至福'),
(7, 'car_trip', '車と旅する人', '/api/avatar/car_trip', '愛車と日本一周中');

-- Seed data: posts
INSERT OR IGNORE INTO posts (id, user_id, content, car_model, created_at) VALUES
(1, 2, '新しいホイールに交換！やっぱりBBSは最高…
#GR86 #BBS #カスタム', 'GR86', datetime('now', '-2 hours')),
(2, 3, '海沿いのワインディング最高だった～
やっぱりドライブはやめられない！
#ドライブ #景色 #ロードスター', 'ロードスター', datetime('now', '-5 hours')),
(3, 4, 'エンジンオイルとフィルター交換完了 🔧
これでまた気持ちよく走れるぞ！', '', datetime('now', '-1 day'));

-- Seed data: hashtags
INSERT OR IGNORE INTO hashtags (id, name, post_count) VALUES
(1, 'みんなの愛車', 12345),
(2, 'JDM', 8765),
(3, '愛車紹介', 7890),
(4, 'カスタムカー', 6543),
(5, 'ドライブスポット', 5678),
(6, 'GR86', 3210),
(7, 'BBS', 1234),
(8, 'カスタム', 4567),
(9, 'ドライブ', 5432),
(10, '景色', 2345),
(11, 'ロードスター', 1890);

-- Seed data: post_hashtags
INSERT OR IGNORE INTO post_hashtags (post_id, hashtag_id) VALUES
(1, 6), (1, 7), (1, 8),
(2, 9), (2, 10), (2, 11);

-- Seed data: likes
INSERT OR IGNORE INTO likes (user_id, post_id) VALUES
(1, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1),
(1, 2), (2, 2), (4, 2), (5, 2),
(1, 3), (2, 3), (3, 3);

-- Seed data: comments (just counts for display)
INSERT OR IGNORE INTO comments (user_id, post_id, content) VALUES
(1, 1, 'かっこいい！'),
(5, 1, 'BBS似合ってますね！'),
(1, 2, '最高のドライブですね！');

-- Seed data: post images
INSERT OR IGNORE INTO post_images (post_id, image_url, sort_order) VALUES
(1, '/api/placeholder/car1', 0),
(2, '/api/placeholder/car2', 0);
