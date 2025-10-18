/**
 * إدارة الإعدادات
 * تطوير: SEVEN_CODE7
 */

const Settings = {
  /**
   * تهيئة الإعدادات
   */
  init() {
    this.loadSettings();
    this.setupEventListeners();
  },

  /**
   * إعداد مستمعي الأحداث
   */
  setupEventListeners() {
    const settingsBtn = document.getElementById('settingsBtn');
    
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => this.openSettings());
    }
  },

  /**
   * فتح نافذة الإعدادات
   */
  openSettings() {
    const modal = document.getElementById('settingsModal');
    modal.classList.add('active');
    
    // تحميل القيم الحالية
    const settings = Storage.getSettings();
    
    document.getElementById('themeSelect').value = settings.theme;
    document.getElementById('primaryColor').value = settings.primaryColor;
    document.getElementById('fontSize').value = settings.fontSize;
    document.getElementById('notificationsEnabled').checked = settings.notificationsEnabled;
    document.getElementById('soundEnabled').checked = settings.soundEnabled;
    document.getElementById('detailLevel').value = settings.detailLevel;
  },

  /**
   * إغلاق نافذة الإعدادات
   */
  closeSettings() {
    const modal = document.getElementById('settingsModal');
    modal.classList.remove('active');
  },

  /**
   * حفظ الإعدادات
   */
  saveSettings() {
    const settings = {
      theme: document.getElementById('themeSelect').value,
      primaryColor: document.getElementById('primaryColor').value,
      fontSize: document.getElementById('fontSize').value,
      notificationsEnabled: document.getElementById('notificationsEnabled').checked,
      soundEnabled: document.getElementById('soundEnabled').checked,
      detailLevel: document.getElementById('detailLevel').value
    };

    Storage.saveSettings(settings);
    this.applySettings(settings);
    this.closeSettings();
    
    Notification.show('تم حفظ الإعدادات بنجاح', 'success');
  },

  /**
   * إعادة تعيين الإعدادات
   */
  resetSettings() {
    if (confirm('هل أنت متأكد من إعادة تعيين الإعدادات إلى القيم الافتراضية؟')) {
      const defaultSettings = {
        theme: 'light',
        primaryColor: '#667eea',
        fontSize: 'medium',
        notificationsEnabled: true,
        soundEnabled: true,
        detailLevel: 'medium'
      };

      Storage.saveSettings(defaultSettings);
      this.applySettings(defaultSettings);
      this.openSettings(); // إعادة فتح لتحديث القيم
      
      Notification.show('تم إعادة تعيين الإعدادات', 'success');
    }
  },

  /**
   * تحميل الإعدادات
   */
  loadSettings() {
    const settings = Storage.getSettings();
    this.applySettings(settings);
  },

  /**
   * تطبيق الإعدادات
   */
  applySettings(settings) {
    // تطبيق الثيم
    this.applyTheme(settings.theme);
    
    // تطبيق اللون الأساسي
    this.applyPrimaryColor(settings.primaryColor);
    
    // تطبيق حجم الخط
    this.applyFontSize(settings.fontSize);
  },

  /**
   * تطبيق الثيم
   */
  applyTheme(theme) {
    const root = document.documentElement;
    
    if (theme === 'auto') {
      // استخدام إعدادات النظام
      const isDark = Utils.isSystemDarkMode();
      root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }
    
    // تحديث أيقونة الزر
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
      const icon = themeBtn.querySelector('i');
      if (icon) {
        if (theme === 'dark' || (theme === 'auto' && Utils.isSystemDarkMode())) {
          icon.className = 'fas fa-sun';
        } else {
          icon.className = 'fas fa-moon';
        }
      }
    }
  },

  /**
   * تطبيق اللون الأساسي
   */
  applyPrimaryColor(color) {
    const root = document.documentElement;
    root.style.setProperty('--brand', color);
    root.style.setProperty('--bubble-user-grad-1', color);
    
    // حساب لون ثانوي
    const secondaryColor = Utils.darkenColor(color, 10);
    root.style.setProperty('--brand2', secondaryColor);
    root.style.setProperty('--bubble-user-grad-2', secondaryColor);
  },

  /**
   * تطبيق حجم الخط
   */
  applyFontSize(size) {
    const root = document.documentElement;
    
    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    
    root.style.fontSize = sizes[size] || sizes.medium;
  },

  /**
   * تبديل الثيم
   */
  toggleTheme() {
    const settings = Storage.getSettings();
    const currentTheme = settings.theme;
    
    let newTheme;
    if (currentTheme === 'light') {
      newTheme = 'dark';
    } else if (currentTheme === 'dark') {
      newTheme = 'auto';
    } else {
      newTheme = 'light';
    }
    
    settings.theme = newTheme;
    Storage.saveSettings(settings);
    this.applyTheme(newTheme);
    
    const themeNames = {
      light: 'الوضع الفاتح',
      dark: 'الوضع الداكن',
      auto: 'الوضع التلقائي'
    };
    
    Notification.show(`تم التبديل إلى ${themeNames[newTheme]}`, 'info');
  }
};

// وظائف عامة
function changeTheme(theme) {
  const settings = Storage.getSettings();
  settings.theme = theme;
  Storage.saveSettings(settings);
  Settings.applyTheme(theme);
}

function changePrimaryColor(color) {
  Settings.applyPrimaryColor(color);
}

function changeFontSize(size) {
  Settings.applyFontSize(size);
}

function toggleNotifications(enabled) {
  const settings = Storage.getSettings();
  settings.notificationsEnabled = enabled;
  Storage.saveSettings(settings);
}

function toggleSound(enabled) {
  const settings = Storage.getSettings();
  settings.soundEnabled = enabled;
  Storage.saveSettings(settings);
}

function changeDetailLevel(level) {
  const settings = Storage.getSettings();
  settings.detailLevel = level;
  Storage.saveSettings(settings);
}

function saveSettings() {
  Settings.saveSettings();
}

function resetSettings() {
  Settings.resetSettings();
}

function closeSettings() {
  Settings.closeSettings();
}

