/**
 * الملف الرئيسي لمنصة نبراس
 * تطوير: SEVEN_CODE7
 */

// نظام الإشعارات
const Notification = {
  container: null,

  /**
   * تهيئة نظام الإشعارات
   */
  init() {
    this.container = document.getElementById('notificationContainer');
  },

  /**
   * عرض إشعار
   */
  show(message, type = 'info', duration = 5000) {
    if (!this.container) {
      this.init();
    }

    const settings = Storage.getSettings();
    
    // التحقق من تفعيل الإشعارات
    if (!settings.notificationsEnabled) {
      return;
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-times-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };

    const titles = {
      success: 'نجح',
      error: 'خطأ',
      warning: 'تحذير',
      info: 'معلومة'
    };

    notification.innerHTML = `
      <div class="notification-icon">
        <i class="fas ${icons[type] || icons.info}"></i>
      </div>
      <div class="notification-content">
        <div class="notification-title">${titles[type] || titles.info}</div>
        <div class="notification-message">${message}</div>
      </div>
      <button class="notification-close" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    `;

    this.container.appendChild(notification);

    // تشغيل صوت إذا كان مفعلاً
    if (settings.soundEnabled) {
      const frequencies = {
        success: 800,
        error: 400,
        warning: 600,
        info: 700
      };
      Utils.playSound(frequencies[type] || 700, 100);
    }

    // إزالة الإشعار بعد المدة المحددة
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(-100%)';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, duration);
  }
};

// التهيئة الرئيسية
document.addEventListener('DOMContentLoaded', () => {
  // إخفاء شاشة التحميل
  setTimeout(() => {
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.classList.add('hidden');
  }, 1000);

  // تهيئة المكونات
  Notification.init();
  Settings.init();
  Chat.init();
  Modes.init();

  // إعداد زر الثيم
  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      Settings.toggleTheme();
    });
  }

  // إعداد النقر خارج المودال لإغلاقه
  const settingsModal = document.getElementById('settingsModal');
  if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        Settings.closeSettings();
      }
    });
  }

  // الحفظ التلقائي
  setInterval(() => {
    const settings = Storage.getSettings();
    if (settings.autoSave) {
      Storage.autoBackup();
      Storage.cleanOldBackups();
    }
  }, CONFIG.ui.autoSaveInterval);

  // تحديث السلسلة اليومية
  updateDailyStreak();

  // رسالة ترحيب
  console.log('%c🎓 نبراس - منصة التعلم الذكية', 'font-size: 24px; font-weight: bold; color: #667eea;');
  console.log('%cتطوير: SEVEN_CODE7 💻', 'font-size: 16px; color: #764ba2;');
  console.log('%cالإصدار: ' + CONFIG.app.version, 'font-size: 14px; color: #666;');
});

/**
 * تحديث السلسلة اليومية
 */
function updateDailyStreak() {
  const stats = Storage.getStats();
  const today = new Date().toDateString();
  const lastVisit = stats.lastVisit ? new Date(stats.lastVisit).toDateString() : null;

  if (lastVisit && lastVisit !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (lastVisit !== yesterdayStr) {
      // انقطعت السلسلة
      if (stats.streakCount > 0) {
        Notification.show(`انقطعت سلسلتك بعد ${stats.streakCount} يوم. ابدأ سلسلة جديدة!`, 'warning');
      }
      stats.streakCount = 0;
    }
  }

  stats.lastVisit = new Date().toISOString();
  Storage.saveStats(stats);
}

/**
 * معالجة الأخطاء العامة
 */
window.addEventListener('error', (event) => {
  console.error('خطأ عام:', event.error);
  Notification.show('حدث خطأ غير متوقع', 'error');
});

/**
 * معالجة الأخطاء غير المتزامنة
 */
window.addEventListener('unhandledrejection', (event) => {
  console.error('خطأ في Promise:', event.reason);
  Notification.show('حدث خطأ في العملية', 'error');
});

/**
 * التعامل مع الاتصال بالإنترنت
 */
window.addEventListener('online', () => {
  Notification.show('تم استعادة الاتصال بالإنترنت', 'success');
});

window.addEventListener('offline', () => {
  Notification.show('تم فقدان الاتصال بالإنترنت', 'warning');
});

/**
 * منع النقر بالزر الأيمن على الصور (اختياري)
 */
document.addEventListener('contextmenu', (e) => {
  if (e.target.tagName === 'IMG') {
    // يمكن تفعيل هذا لمنع حفظ الصور
    // e.preventDefault();
  }
});

/**
 * اختصارات لوحة المفاتيح
 */
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + K: التركيز على حقل الإدخال
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const input = document.getElementById('messageInput');
    if (input) {
      input.focus();
    }
  }

  // Ctrl/Cmd + /: فتح الإعدادات
  if ((e.ctrlKey || e.metaKey) && e.key === '/') {
    e.preventDefault();
    Settings.openSettings();
  }

  // Esc: إغلاق المودال
  if (e.key === 'Escape') {
    Settings.closeSettings();
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
      imageModal.classList.remove('active');
    }
  }

  // Ctrl/Cmd + D: تبديل الثيم
  if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
    e.preventDefault();
    Settings.toggleTheme();
  }
});

/**
 * تتبع الوقت النشط
 */
let activeTime = 0;
let isActive = true;
let activityTimer = null;

function startActivityTracking() {
  activityTimer = setInterval(() => {
    if (isActive) {
      activeTime++;
      
      // تحديث الوقت الإجمالي كل دقيقة
      if (activeTime % 60 === 0) {
        const stats = Storage.getStats();
        stats.totalTime += 60;
        Storage.saveStats(stats);
        Chat.displayStats();
      }
    }
  }, 1000);
}

// بدء التتبع
startActivityTracking();

// تتبع النشاط
document.addEventListener('mousemove', () => { isActive = true; });
document.addEventListener('keypress', () => { isActive = true; });
document.addEventListener('click', () => { isActive = true; });
document.addEventListener('scroll', () => { isActive = true; });

// إيقاف النشاط بعد فترة من عدم التفاعل
let inactivityTimer;
function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  isActive = true;
  inactivityTimer = setTimeout(() => {
    isActive = false;
  }, 60000); // دقيقة واحدة
}

document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keypress', resetInactivityTimer);
resetInactivityTimer();

/**
 * معالجة التغيير في حجم النافذة
 */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // إعادة رسم الرسوم البيانية إذا كانت مفتوحة
    if (Modes.getCurrentMode() === 'analytics' && Analytics.charts) {
      Object.values(Analytics.charts).forEach(chart => {
        if (chart && chart.resize) {
          chart.resize();
        }
      });
    }
  }, 250);
});

/**
 * معالجة التبديل بين التبويبات
 */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    isActive = false;
  } else {
    isActive = true;
    // تحديث السلسلة عند العودة
    updateDailyStreak();
  }
});

/**
 * حفظ البيانات قبل إغلاق الصفحة
 */
window.addEventListener('beforeunload', (e) => {
  // حفظ جميع البيانات
  Chat.saveMessages();
  Storage.autoBackup();
  
  // لا نعرض رسالة تأكيد إلا إذا كان هناك رسائل غير محفوظة
  // يمكن تفعيل هذا إذا لزم الأمر
  // e.preventDefault();
  // e.returnValue = '';
});

/**
 * تحديثات دورية
 */
setInterval(() => {
  // تحديث الطوابع الزمنية
  document.querySelectorAll('.ts').forEach(ts => {
    const messageId = ts.closest('.row')?.dataset.messageId;
    if (messageId) {
      const message = Chat.messages.find(m => m.id === messageId);
      if (message) {
        ts.textContent = Utils.formatShortDate(message.timestamp);
      }
    }
  });
}, 60000); // كل دقيقة

/**
 * إشعار بالتحديثات (إذا كانت متوفرة)
 */
if ('serviceWorker' in navigator) {
  // يمكن تفعيل Service Worker للعمل دون اتصال
  // navigator.serviceWorker.register('/sw.js');
}

/**
 * تحسين الأداء - Lazy Loading للصور
 */
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  });

  // مراقبة الصور الجديدة
  const observeImages = () => {
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  };

  // مراقبة التغييرات في DOM
  const domObserver = new MutationObserver(observeImages);
  domObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  observeImages();
}

/**
 * تحسينات إضافية
 */

// تحسين الأداء للتمرير
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      // يمكن إضافة تأثيرات عند التمرير
      ticking = false;
    });
    ticking = true;
  }
});

// تحميل الخطوط بشكل غير متزامن
if ('fonts' in document) {
  document.fonts.ready.then(() => {
    console.log('تم تحميل جميع الخطوط');
  });
}

// رسالة ترحيب للمستخدمين الجدد
const stats = Storage.getStats();
if (stats.questionsCount === 0) {
  setTimeout(() => {
    Notification.show('مرحباً بك في نبراس! ابدأ رحلتك التعليمية الآن 🎓', 'info', 7000);
  }, 2000);
}

// تحفيز المستخدم
if (stats.questionsCount > 0 && stats.questionsCount % 10 === 0) {
  setTimeout(() => {
    Notification.show(`رائع! لقد أجبت على ${stats.questionsCount} سؤال! استمر في التقدم 🌟`, 'success', 5000);
  }, 1500);
}

console.log('✅ تم تحميل منصة نبراس بنجاح!');

