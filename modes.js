/**
 * إدارة أوضاع التعلم
 * تطوير: SEVEN_CODE7
 */

const Modes = {
  currentMode: 'learn',

  /**
   * تهيئة الأوضاع
   */
  init() {
    this.setupEventListeners();
    this.loadCurrentMode();
  },

  /**
   * إعداد مستمعي الأحداث
   */
  setupEventListeners() {
    // تم إعداد الأحداث في HTML (onclick)
  },

  /**
   * تبديل الوضع
   */
  switchMode(modeId) {
    if (!CONFIG.modes[modeId]) {
      console.error('وضع غير موجود:', modeId);
      return;
    }

    this.currentMode = modeId;
    Chat.currentMode = modeId;
    
    this.updateUI(modeId);
    this.handleModeSpecificUI(modeId);
    
    Storage.updateSettings({ lastMode: modeId });
    Notification.show(`تم التبديل إلى: ${CONFIG.modes[modeId].title}`, 'info');
  },

  /**
   * تحديث الواجهة
   */
  updateUI(modeId) {
    const mode = CONFIG.modes[modeId];
    
    // تحديث العنوان
    const chatTitle = document.getElementById('chatTitle');
    chatTitle.innerHTML = `<i class="${mode.icon}"></i> ${mode.title}`;
    
    // تحديث العناصر النشطة في القائمة
    document.querySelectorAll('.menu .item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.mode === modeId) {
        item.classList.add('active');
      }
    });
  },

  /**
   * معالجة الواجهة الخاصة بكل وضع
   */
  handleModeSpecificUI(modeId) {
    const mainContent = document.querySelector('.main-content');
    
    // إخفاء جميع المحتويات الخاصة
    document.querySelectorAll('.mode-specific-content').forEach(el => {
      el.style.display = 'none';
    });

    // عرض المحتوى الخاص بالوضع
    switch (modeId) {
      case 'learn':
        this.showLearnMode();
        break;
      case 'examples':
        this.showExamplesMode();
        break;
      case 'practice':
        this.showPracticeMode();
        break;
      case 'workshop':
        this.showWorkshopMode();
        break;
      case 'planner':
        this.showPlannerMode();
        break;
      case 'lab':
        this.showLabMode();
        break;
      case 'library':
        this.showLibraryMode();
        break;
      case 'challenges':
        this.showChallengesMode();
        break;
      case 'analytics':
        this.showAnalyticsMode();
        break;
    }
  },

  /**
   * عرض وضع المعلم الافتراضي
   */
  showLearnMode() {
    // الوضع الافتراضي - المحادثة العادية
    const chatbox = document.getElementById('chatMessages');
    if (chatbox.children.length === 0) {
      Chat.renderMessages();
    }
  },

  /**
   * عرض وضع مولد الأمثلة
   */
  showExamplesMode() {
    const topicInputArea = document.getElementById('topicInputArea');
    topicInputArea.style.display = 'flex';
    
    const topicInput = document.getElementById('topicInput');
    topicInput.placeholder = 'أدخل موضوعاً للحصول على أمثلة...';
  },

  /**
   * عرض وضع التدريب والاختبار
   */
  showPracticeMode() {
    const topicInputArea = document.getElementById('topicInputArea');
    topicInputArea.style.display = 'flex';
    
    const topicInput = document.getElementById('topicInput');
    topicInput.placeholder = 'أدخل موضوعاً للحصول على أسئلة تدريبية...';
  },

  /**
   * عرض وضع ورشة العمل
   */
  showWorkshopMode() {
    // يمكن إضافة واجهة خاصة لورشة العمل
    Chat.renderMessages();
  },

  /**
   * عرض وضع المخطط الدراسي
   */
  showPlannerMode() {
    const topicInputArea = document.getElementById('topicInputArea');
    topicInputArea.style.display = 'flex';
    
    const topicInput = document.getElementById('topicInput');
    topicInput.placeholder = 'أدخل المادة الدراسية لإنشاء خطة...';
  },

  /**
   * عرض وضع المختبر البرمجي
   */
  showLabMode() {
    // سيتم معالجته في lab.js
    Lab.show();
  },

  /**
   * عرض وضع المكتبة التعليمية
   */
  showLibraryMode() {
    // سيتم معالجته في library.js
    Library.show();
  },

  /**
   * عرض وضع التحديات اليومية
   */
  showChallengesMode() {
    // سيتم معالجته في challenges.js
    Challenges.show();
  },

  /**
   * عرض وضع الإحصائيات المتقدمة
   */
  showAnalyticsMode() {
    // سيتم معالجته في analytics.js
    Analytics.show();
  },

  /**
   * بدء التعلم (من منطقة إدخال الموضوع)
   */
  async startLearning() {
    const topicInput = document.getElementById('topicInput');
    const topic = topicInput.value.trim();
    
    if (!topic) {
      Notification.show('يرجى إدخال موضوع', 'warning');
      return;
    }

    topicInput.value = '';
    
    let prompt = '';
    
    switch (this.currentMode) {
      case 'examples':
        prompt = `أعطني 5 أمثلة متنوعة وواضحة عن: ${topic}`;
        break;
      case 'practice':
        prompt = `أنشئ 5 أسئلة تدريبية متدرجة الصعوبة عن: ${topic}`;
        break;
      case 'planner':
        prompt = `أنشئ خطة دراسية مفصلة لمدة شهر لتعلم: ${topic}`;
        break;
      default:
        prompt = `علمني عن: ${topic}`;
    }

    const messageInput = document.getElementById('messageInput');
    messageInput.value = prompt;
    await Chat.sendMessage();
  },

  /**
   * تحميل الوضع الحالي
   */
  loadCurrentMode() {
    const settings = Storage.getSettings();
    const lastMode = settings.lastMode || 'learn';
    this.switchMode(lastMode);
  },

  /**
   * الحصول على الوضع الحالي
   */
  getCurrentMode() {
    return this.currentMode;
  },

  /**
   * الحصول على معلومات الوضع
   */
  getModeInfo(modeId) {
    return CONFIG.modes[modeId] || null;
  }
};

// وظيفة عامة للتبديل بين الأوضاع
function switchMode(modeId) {
  Modes.switchMode(modeId);
}

// وظيفة بدء التعلم
function startLearning() {
  Modes.startLearning();
}

// وظيفة تحميل محتوى SEVEN_CODE7
async function loadSevenCodeContent() {
  const message = `أخبرني عن قناة SEVEN_CODE7 على يوتيوب وما هي أنواع المحتوى التعليمي الذي تقدمه في مجال البرمجة والتقنية.`;
  
  const messageInput = document.getElementById('messageInput');
  messageInput.value = message;
  await Chat.sendMessage();
}

