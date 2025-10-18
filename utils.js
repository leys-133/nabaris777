/**
 * وظائف مساعدة عامة
 * تطوير: SEVEN_CODE7
 */

const Utils = {
  /**
   * تنسيق الوقت
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  /**
   * تنسيق التاريخ
   */
  formatDate(date) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(date).toLocaleDateString('ar-SA', options);
  },

  /**
   * تنسيق التاريخ القصير
   */
  formatShortDate(date) {
    const now = new Date();
    const messageDate = new Date(date);
    const diffMs = now - messageDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    return messageDate.toLocaleDateString('ar-SA');
  },

  /**
   * تحويل الصورة إلى Base64
   */
  async imageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  /**
   * ضغط الصورة
   */
  async compressImage(file, maxWidth = 800, quality = 0.8) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/jpeg', quality);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  /**
   * تنظيف النص من HTML
   */
  sanitizeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /**
   * تحويل Markdown إلى HTML بسيط
   */
  markdownToHTML(text) {
    // عناوين
    text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    text = text.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    text = text.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // نص عريض
    text = text.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    
    // نص مائل
    text = text.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    
    // كود مضمن
    text = text.replace(/`(.*?)`/gim, '<code>$1</code>');
    
    // كود متعدد الأسطر
    text = text.replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>');
    
    // روابط
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank">$1</a>');
    
    // قوائم
    text = text.replace(/^\* (.*$)/gim, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // أسطر جديدة
    text = text.replace(/\n/gim, '<br>');
    
    return text;
  },

  /**
   * نسخ النص إلى الحافظة
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback للمتصفحات القديمة
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    }
  },

  /**
   * توليد معرف فريد
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  /**
   * خلط عناصر المصفوفة
   */
  shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  },

  /**
   * تأخير التنفيذ
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * Debounce للوظائف
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle للوظائف
   */
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * التحقق من صحة البريد الإلكتروني
   */
  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  /**
   * التحقق من صحة URL
   */
  isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * تقصير النص
   */
  truncateText(text, maxLength, suffix = '...') {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength - suffix.length) + suffix;
  },

  /**
   * تحويل الأرقام إلى صيغة قابلة للقراءة
   */
  formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'م';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'ك';
    return num.toString();
  },

  /**
   * حساب النسبة المئوية
   */
  calculatePercentage(value, total) {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  },

  /**
   * الحصول على لون عشوائي
   */
  getRandomColor() {
    const colors = CONFIG.themeColors;
    return colors[Math.floor(Math.random() * colors.length)];
  },

  /**
   * تحويل RGB إلى Hex
   */
  rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  },

  /**
   * تحويل Hex إلى RGB
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  /**
   * تفتيح اللون
   */
  lightenColor(hex, percent) {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return hex;
    
    const increase = (value) => Math.min(255, Math.floor(value + (255 - value) * percent / 100));
    
    return this.rgbToHex(
      increase(rgb.r),
      increase(rgb.g),
      increase(rgb.b)
    );
  },

  /**
   * تغميق اللون
   */
  darkenColor(hex, percent) {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return hex;
    
    const decrease = (value) => Math.max(0, Math.floor(value * (1 - percent / 100)));
    
    return this.rgbToHex(
      decrease(rgb.r),
      decrease(rgb.g),
      decrease(rgb.b)
    );
  },

  /**
   * الكشف عن الجهاز المحمول
   */
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  /**
   * الكشف عن الوضع الداكن للنظام
   */
  isSystemDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  },

  /**
   * تشغيل صوت
   */
  playSound(frequency = 440, duration = 200, type = 'sine') {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (err) {
      console.warn('تعذر تشغيل الصوت:', err);
    }
  },

  /**
   * اهتزاز الجهاز
   */
  vibrate(pattern = 200) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  },

  /**
   * طلب إذن الإشعارات
   */
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      return false;
    }
    
    if (Notification.permission === 'granted') {
      return true;
    }
    
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    
    return false;
  },

  /**
   * إرسال إشعار
   */
  async sendNotification(title, options = {}) {
    const hasPermission = await this.requestNotificationPermission();
    
    if (hasPermission) {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
      
      return notification;
    }
    
    return null;
  },

  /**
   * تحميل ملف
   */
  downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * تحميل JSON
   */
  downloadJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    this.downloadFile(json, filename, 'application/json');
  },

  /**
   * قراءة ملف
   */
  async readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  },

  /**
   * التمرير السلس إلى عنصر
   */
  smoothScrollTo(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  },

  /**
   * التحقق من ظهور العنصر في الشاشة
   */
  isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * الحصول على معلومات المتصفح
   */
  getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    
    if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
    else if (ua.indexOf('Chrome') > -1) browser = 'Chrome';
    else if (ua.indexOf('Safari') > -1) browser = 'Safari';
    else if (ua.indexOf('Edge') > -1) browser = 'Edge';
    else if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident/') > -1) browser = 'IE';
    
    return {
      browser,
      userAgent: ua,
      platform: navigator.platform,
      language: navigator.language
    };
  },

  /**
   * معالجة الأخطاء بشكل آمن
   */
  safeExecute(func, fallback = null) {
    try {
      return func();
    } catch (err) {
      console.error('خطأ في التنفيذ:', err);
      return fallback;
    }
  },

  /**
   * معالجة الأخطاء غير المتزامنة بشكل آمن
   */
  async safeExecuteAsync(func, fallback = null) {
    try {
      return await func();
    } catch (err) {
      console.error('خطأ في التنفيذ غير المتزامن:', err);
      return fallback;
    }
  }
};

// تجميد الكائن
Object.freeze(Utils);

