/**
 * إدارة التخزين المحلي
 * تطوير: SEVEN_CODE7
 */

const Storage = {
  /**
   * الحصول على مفتاح كامل
   */
  getKey(key) {
    return CONFIG.storage.prefix + key;
  },

  /**
   * حفظ بيانات
   */
  set(key, value) {
    try {
      const fullKey = this.getKey(key);
      const data = JSON.stringify(value);
      localStorage.setItem(fullKey, data);
      return true;
    } catch (err) {
      console.error('خطأ في حفظ البيانات:', err);
      return false;
    }
  },

  /**
   * الحصول على بيانات
   */
  get(key, defaultValue = null) {
    try {
      const fullKey = this.getKey(key);
      const data = localStorage.getItem(fullKey);
      return data ? JSON.parse(data) : defaultValue;
    } catch (err) {
      console.error('خطأ في قراءة البيانات:', err);
      return defaultValue;
    }
  },

  /**
   * حذف بيانات
   */
  remove(key) {
    try {
      const fullKey = this.getKey(key);
      localStorage.removeItem(fullKey);
      return true;
    } catch (err) {
      console.error('خطأ في حذف البيانات:', err);
      return false;
    }
  },

  /**
   * مسح جميع البيانات
   */
  clear() {
    try {
      const keys = Object.keys(localStorage);
      const prefix = CONFIG.storage.prefix;
      
      keys.forEach(key => {
        if (key.startsWith(prefix)) {
          localStorage.removeItem(key);
        }
      });
      
      return true;
    } catch (err) {
      console.error('خطأ في مسح البيانات:', err);
      return false;
    }
  },

  /**
   * التحقق من وجود مفتاح
   */
  has(key) {
    const fullKey = this.getKey(key);
    return localStorage.getItem(fullKey) !== null;
  },

  /**
   * الحصول على حجم التخزين المستخدم
   */
  getSize() {
    let size = 0;
    const keys = Object.keys(localStorage);
    const prefix = CONFIG.storage.prefix;
    
    keys.forEach(key => {
      if (key.startsWith(prefix)) {
        size += localStorage.getItem(key).length + key.length;
      }
    });
    
    return size;
  },

  /**
   * الحصول على حجم التخزين المتاح
   */
  getAvailableSize() {
    const maxSize = 5 * 1024 * 1024; // 5MB تقريباً
    return maxSize - this.getSize();
  },

  /**
   * حفظ الرسائل
   */
  saveMessages(messages) {
    // حفظ آخر 50 رسالة فقط
    const maxMessages = CONFIG.ui.maxMessages;
    const messagesToSave = messages.slice(-maxMessages);
    return this.set(CONFIG.storage.keys.messages, messagesToSave);
  },

  /**
   * الحصول على الرسائل
   */
  getMessages() {
    return this.get(CONFIG.storage.keys.messages, []);
  },

  /**
   * حفظ الإحصائيات
   */
  saveStats(stats) {
    return this.set(CONFIG.storage.keys.stats, stats);
  },

  /**
   * الحصول على الإحصائيات
   */
  getStats() {
    return this.get(CONFIG.storage.keys.stats, {
      questionsCount: 0,
      learningLevel: 1,
      pointsCount: 0,
      streakCount: 0,
      totalTime: 0,
      lastVisit: null,
      startDate: new Date().toISOString()
    });
  },

  /**
   * تحديث الإحصائيات
   */
  updateStats(updates) {
    const stats = this.getStats();
    const newStats = { ...stats, ...updates };
    return this.saveStats(newStats);
  },

  /**
   * حفظ الإعدادات
   */
  saveSettings(settings) {
    return this.set(CONFIG.storage.keys.settings, settings);
  },

  /**
   * الحصول على الإعدادات
   */
  getSettings() {
    return this.get(CONFIG.storage.keys.settings, {
      theme: 'light',
      primaryColor: '#667eea',
      fontSize: 'medium',
      notificationsEnabled: true,
      soundEnabled: true,
      detailLevel: 'medium',
      autoSave: true
    });
  },

  /**
   * تحديث الإعدادات
   */
  updateSettings(updates) {
    const settings = this.getSettings();
    const newSettings = { ...settings, ...updates };
    return this.saveSettings(newSettings);
  },

  /**
   * حفظ الشارات
   */
  saveBadges(badges) {
    return this.set(CONFIG.storage.keys.badges, badges);
  },

  /**
   * الحصول على الشارات
   */
  getBadges() {
    return this.get(CONFIG.storage.keys.badges, ['beginner']);
  },

  /**
   * إضافة شارة
   */
  addBadge(badgeId) {
    const badges = this.getBadges();
    if (!badges.includes(badgeId)) {
      badges.push(badgeId);
      this.saveBadges(badges);
      return true;
    }
    return false;
  },

  /**
   * حفظ التحديات المكتملة
   */
  saveCompletedChallenges(challenges) {
    return this.set(CONFIG.storage.keys.challenges, challenges);
  },

  /**
   * الحصول على التحديات المكتملة
   */
  getCompletedChallenges() {
    return this.get(CONFIG.storage.keys.challenges, []);
  },

  /**
   * إضافة تحدي مكتمل
   */
  addCompletedChallenge(challengeId) {
    const challenges = this.getCompletedChallenges();
    if (!challenges.includes(challengeId)) {
      challenges.push(challengeId);
      this.saveCompletedChallenges(challenges);
      return true;
    }
    return false;
  },

  /**
   * حفظ المقالات المقروءة
   */
  saveReadArticles(articles) {
    return this.set(CONFIG.storage.keys.library, articles);
  },

  /**
   * الحصول على المقالات المقروءة
   */
  getReadArticles() {
    return this.get(CONFIG.storage.keys.library, []);
  },

  /**
   * إضافة مقال مقروء
   */
  addReadArticle(articleId) {
    const articles = this.getReadArticles();
    if (!articles.includes(articleId)) {
      articles.push(articleId);
      this.saveReadArticles(articles);
      return true;
    }
    return false;
  },

  /**
   * تصدير جميع البيانات
   */
  exportAll() {
    return {
      messages: this.getMessages(),
      stats: this.getStats(),
      settings: this.getSettings(),
      badges: this.getBadges(),
      completedChallenges: this.getCompletedChallenges(),
      readArticles: this.getReadArticles(),
      exportDate: new Date().toISOString(),
      version: CONFIG.app.version
    };
  },

  /**
   * استيراد البيانات
   */
  importAll(data) {
    try {
      if (data.messages) this.saveMessages(data.messages);
      if (data.stats) this.saveStats(data.stats);
      if (data.settings) this.saveSettings(data.settings);
      if (data.badges) this.saveBadges(data.badges);
      if (data.completedChallenges) this.saveCompletedChallenges(data.completedChallenges);
      if (data.readArticles) this.saveReadArticles(data.readArticles);
      return true;
    } catch (err) {
      console.error('خطأ في استيراد البيانات:', err);
      return false;
    }
  },

  /**
   * نسخ احتياطي تلقائي
   */
  autoBackup() {
    const data = this.exportAll();
    const backupKey = 'backup_' + new Date().toISOString().split('T')[0];
    return this.set(backupKey, data);
  },

  /**
   * استعادة من نسخة احتياطية
   */
  restoreBackup(date) {
    const backupKey = 'backup_' + date;
    const data = this.get(backupKey);
    if (data) {
      return this.importAll(data);
    }
    return false;
  },

  /**
   * حذف النسخ الاحتياطية القديمة
   */
  cleanOldBackups(daysToKeep = 7) {
    const keys = Object.keys(localStorage);
    const prefix = this.getKey('backup_');
    const now = new Date();
    
    keys.forEach(key => {
      if (key.startsWith(prefix)) {
        const dateStr = key.replace(prefix, '');
        const backupDate = new Date(dateStr);
        const daysDiff = (now - backupDate) / (1000 * 60 * 60 * 24);
        
        if (daysDiff > daysToKeep) {
          localStorage.removeItem(key);
        }
      }
    });
  }
};

// تجميد الكائن
Object.freeze(Storage);

