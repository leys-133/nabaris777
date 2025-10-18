/**
 * إدارة المحادثة
 * تطوير: SEVEN_CODE7
 */

const Chat = {
  messages: [],
  currentMode: 'learn',
  isTyping: false,
  uploadedImages: [],

  /**
   * تهيئة المحادثة
   */
  init() {
    this.loadMessages();
    this.setupEventListeners();
    this.setupDragAndDrop();
  },

  /**
   * إعداد مستمعي الأحداث
   */
  setupEventListeners() {
    const sendBtn = document.getElementById('sendBtn');
    const messageInput = document.getElementById('messageInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const editBtn = document.getElementById('editBtn');
    const repeatBtn = document.getElementById('repeatBtn');
    const clearBtn = document.getElementById('clearBtn');
    const exportBtn = document.getElementById('exportBtn');
    const voiceBtn = document.getElementById('voiceBtn');
    const emojiBtn = document.getElementById('emojiBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    // إرسال الرسالة
    sendBtn.addEventListener('click', () => this.sendMessage());
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // رفع الصور
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => this.handleFileUpload(e));

    // تحرير آخر رسالة
    editBtn.addEventListener('click', () => this.editLastMessage());

    // إعادة إرسال
    repeatBtn.addEventListener('click', () => this.repeatLastMessage());

    // مسح الذاكرة
    clearBtn.addEventListener('click', () => this.clearMemory());

    // تصدير الجلسة
    exportBtn.addEventListener('click', () => this.exportSession());

    // الإدخال الصوتي
    voiceBtn.addEventListener('click', () => this.startVoiceInput());

    // منتقي الإيموجي
    emojiBtn.addEventListener('click', () => this.toggleEmojiPicker());

    // ملء الشاشة
    fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
  },

  /**
   * إعداد السحب والإفلات
   */
  setupDragAndDrop() {
    const dropZone = document.getElementById('dropZone');

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = 'var(--brand)';
      dropZone.style.backgroundColor = 'rgba(102, 126, 234, 0.05)';
    });

    dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = '';
      dropZone.style.backgroundColor = '';
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = '';
      dropZone.style.backgroundColor = '';

      const files = Array.from(e.dataTransfer.files).filter(file => 
        file.type.startsWith('image/')
      );

      if (files.length > 0) {
        this.handleFiles(files);
      }
    });
  },

  /**
   * معالجة رفع الملفات
   */
  async handleFileUpload(event) {
    const files = Array.from(event.target.files);
    await this.handleFiles(files);
    event.target.value = ''; // إعادة تعيين الإدخال
  },

  /**
   * معالجة الملفات
   */
  async handleFiles(files) {
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        try {
          const base64 = await Utils.imageToBase64(file);
          this.uploadedImages.push(base64);
          this.displayImageThumbnail(base64);
        } catch (err) {
          console.error('خطأ في معالجة الصورة:', err);
          Notification.show('خطأ في رفع الصورة', 'error');
        }
      }
    }
  },

  /**
   * عرض صورة مصغرة
   */
  displayImageThumbnail(base64) {
    const thumbsContainer = document.getElementById('thumbs');
    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    
    const img = document.createElement('img');
    img.src = base64;
    img.onclick = () => this.showImageModal(base64);
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'x';
    removeBtn.textContent = '×';
    removeBtn.onclick = (e) => {
      e.stopPropagation();
      this.removeImage(base64, thumb);
    };
    
    thumb.appendChild(img);
    thumb.appendChild(removeBtn);
    thumbsContainer.appendChild(thumb);
  },

  /**
   * إزالة صورة
   */
  removeImage(base64, thumbElement) {
    const index = this.uploadedImages.indexOf(base64);
    if (index > -1) {
      this.uploadedImages.splice(index, 1);
    }
    thumbElement.remove();
  },

  /**
   * عرض الصورة في مودال
   */
  showImageModal(src) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = src;
    modal.classList.add('active');
  },

  /**
   * إرسال رسالة
   */
  async sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();

    if (!text && this.uploadedImages.length === 0) {
      return;
    }

    // إضافة رسالة المستخدم
    this.addMessage('user', text, this.uploadedImages);

    // مسح الإدخال
    input.value = '';
    const thumbsContainer = document.getElementById('thumbs');
    thumbsContainer.innerHTML = '';
    const images = [...this.uploadedImages];
    this.uploadedImages = [];

    // عرض مؤشر الكتابة
    this.showTyping();

    // الحصول على الرد من الذكاء الاصطناعي
    const startTime = Date.now();
    const response = await this.getAIResponse(text, images);
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    // إخفاء مؤشر الكتابة
    this.hideTyping();

    if (response.success) {
      // إضافة رسالة الذكاء الاصطناعي
      this.addMessage('assistant', response.message);
      
      // تحديث الإحصائيات
      this.updateStats(duration);
      
      // حفظ الرسائل
      this.saveMessages();
    } else {
      // عرض رسالة خطأ
      this.addMessage('assistant', 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
      Notification.show('خطأ في الاتصال', 'error');
    }
  },

  /**
   * الحصول على رد من الذكاء الاصطناعي
   */
  async getAIResponse(text, images = []) {
    const mode = CONFIG.modes[this.currentMode];
    const systemPrompt = mode.systemPrompt;

    // بناء سياق المحادثة
    const context = this.messages.slice(-10).map(msg => ({
      role: msg.role,
      content: msg.text
    }));

    if (images.length > 0) {
      return await AI.sendMessageWithImages(text, images, systemPrompt);
    } else {
      return await AI.sendMessageWithContext(text, context, systemPrompt);
    }
  },

  /**
   * إضافة رسالة
   */
  addMessage(role, text, images = []) {
    const message = {
      id: Utils.generateId(),
      role,
      text,
      images,
      timestamp: new Date().toISOString()
    };

    this.messages.push(message);
    this.renderMessage(message);
    this.scrollToBottom();
  },

  /**
   * عرض رسالة
   */
  renderMessage(message) {
    const chatbox = document.getElementById('chatMessages');
    
    // إزالة رسالة الترحيب إذا كانت موجودة
    const welcomeMessage = chatbox.querySelector('.welcome-message');
    if (welcomeMessage) {
      welcomeMessage.remove();
    }

    const row = document.createElement('div');
    row.className = 'row';
    row.dataset.messageId = message.id;

    const msg = document.createElement('div');
    msg.className = `msg ${message.role === 'user' ? 'user' : 'ai'}`;

    // النص
    if (message.text) {
      const textContent = document.createElement('div');
      textContent.innerHTML = Utils.markdownToHTML(message.text);
      msg.appendChild(textContent);
    }

    // الصور
    if (message.images && message.images.length > 0) {
      message.images.forEach(img => {
        const image = document.createElement('img');
        image.src = img;
        image.onclick = () => this.showImageModal(img);
        msg.appendChild(image);
      });
    }

    // الطابع الزمني
    const timestamp = document.createElement('div');
    timestamp.className = 'ts';
    timestamp.textContent = Utils.formatShortDate(message.timestamp);
    msg.appendChild(timestamp);

    row.appendChild(msg);
    chatbox.appendChild(row);
  },

  /**
   * عرض مؤشر الكتابة
   */
  showTyping() {
    const typing = document.getElementById('typing');
    typing.classList.add('active');
    this.isTyping = true;
  },

  /**
   * إخفاء مؤشر الكتابة
   */
  hideTyping() {
    const typing = document.getElementById('typing');
    typing.classList.remove('active');
    this.isTyping = false;
  },

  /**
   * التمرير إلى الأسفل
   */
  scrollToBottom() {
    const chatbox = document.getElementById('chatMessages');
    chatbox.scrollTop = chatbox.scrollHeight;
  },

  /**
   * تحرير آخر رسالة
   */
  editLastMessage() {
    const userMessages = this.messages.filter(m => m.role === 'user');
    if (userMessages.length === 0) return;

    const lastMessage = userMessages[userMessages.length - 1];
    const input = document.getElementById('messageInput');
    input.value = lastMessage.text;
    input.focus();

    // حذف آخر رسالتين (المستخدم والذكاء الاصطناعي)
    this.messages = this.messages.slice(0, -2);
    this.renderMessages();
  },

  /**
   * إعادة إرسال آخر رسالة
   */
  async repeatLastMessage() {
    const userMessages = this.messages.filter(m => m.role === 'user');
    if (userMessages.length === 0) return;

    const lastMessage = userMessages[userMessages.length - 1];
    
    // حذف آخر رد من الذكاء الاصطناعي
    if (this.messages[this.messages.length - 1].role === 'assistant') {
      this.messages.pop();
    }

    // إعادة الإرسال
    this.showTyping();
    const startTime = Date.now();
    const response = await this.getAIResponse(lastMessage.text, lastMessage.images || []);
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    this.hideTyping();

    if (response.success) {
      this.addMessage('assistant', response.message);
      this.updateStats(duration);
      this.saveMessages();
    }
  },

  /**
   * مسح الذاكرة
   */
  clearMemory() {
    if (confirm('هل أنت متأكد من مسح جميع الرسائل؟')) {
      this.messages = [];
      this.renderMessages();
      this.saveMessages();
      Notification.show('تم مسح الذاكرة بنجاح', 'success');
    }
  },

  /**
   * تصدير الجلسة
   */
  exportSession() {
    const data = Storage.exportAll();
    const filename = `nebras_export_${new Date().toISOString().split('T')[0]}.json`;
    Utils.downloadJSON(data, filename);
    Notification.show('تم تصدير الجلسة بنجاح', 'success');
  },

  /**
   * بدء الإدخال الصوتي
   */
  startVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      Notification.show('المتصفح لا يدعم التعرف على الصوت', 'error');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'ar-SA';
    recognition.continuous = false;
    recognition.interimResults = false;

    const voiceBtn = document.getElementById('voiceBtn');
    voiceBtn.classList.add('pulse');

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const input = document.getElementById('messageInput');
      input.value = transcript;
      voiceBtn.classList.remove('pulse');
      Utils.playSound(800, 100);
    };

    recognition.onerror = (event) => {
      console.error('خطأ في التعرف على الصوت:', event.error);
      voiceBtn.classList.remove('pulse');
      Notification.show('خطأ في التعرف على الصوت', 'error');
    };

    recognition.onend = () => {
      voiceBtn.classList.remove('pulse');
    };

    recognition.start();
    Utils.playSound(600, 100);
  },

  /**
   * تبديل منتقي الإيموجي
   */
  toggleEmojiPicker() {
    const picker = document.getElementById('emojiPicker');
    picker.style.display = picker.style.display === 'none' ? 'block' : 'none';
  },

  /**
   * إدراج إيموجي
   */
  insertEmoji(emoji) {
    const input = document.getElementById('messageInput');
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;
    
    input.value = text.substring(0, start) + emoji + text.substring(end);
    input.focus();
    input.selectionStart = input.selectionEnd = start + emoji.length;
    
    this.toggleEmojiPicker();
  },

  /**
   * تبديل ملء الشاشة
   */
  toggleFullscreen() {
    const mainContent = document.querySelector('.main-content');
    
    if (!document.fullscreenElement) {
      mainContent.requestFullscreen().catch(err => {
        console.error('خطأ في ملء الشاشة:', err);
      });
    } else {
      document.exitFullscreen();
    }
  },

  /**
   * تحديث الإحصائيات
   */
  updateStats(duration) {
    const stats = Storage.getStats();
    
    stats.questionsCount++;
    stats.pointsCount += 10;
    stats.totalTime += duration;
    
    // تحديث المستوى
    const newLevel = Math.floor(stats.pointsCount / 100) + 1;
    if (newLevel > stats.learningLevel) {
      stats.learningLevel = newLevel;
      Notification.show(`تهانينا! وصلت إلى المستوى ${newLevel}`, 'success');
      Utils.playSound(800, 200);
    }
    
    // تحديث السلسلة
    const today = new Date().toDateString();
    const lastVisit = stats.lastVisit ? new Date(stats.lastVisit).toDateString() : null;
    
    if (lastVisit !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      
      if (lastVisit === yesterdayStr) {
        stats.streakCount++;
      } else if (lastVisit !== today) {
        stats.streakCount = 1;
      }
    }
    
    stats.lastVisit = new Date().toISOString();
    
    Storage.saveStats(stats);
    this.displayStats();
    this.checkBadges(stats);
  },

  /**
   * عرض الإحصائيات
   */
  displayStats() {
    const stats = Storage.getStats();
    
    document.getElementById('questionsCount').textContent = stats.questionsCount;
    document.getElementById('learningLevel').textContent = stats.learningLevel;
    document.getElementById('pointsCount').textContent = stats.pointsCount;
    document.getElementById('streakCount').textContent = stats.streakCount;
    
    const totalMinutes = Math.floor(stats.totalTime / 60);
    document.getElementById('totalTime').textContent = totalMinutes + 'د';
    
    const progress = Math.min((stats.pointsCount % 100), 100);
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('progressText').textContent = progress + '%';
  },

  /**
   * التحقق من الشارات
   */
  checkBadges(stats) {
    const currentBadges = Storage.getBadges();
    
    CONFIG.badges.forEach(badge => {
      if (stats.pointsCount >= badge.requirement && !currentBadges.includes(badge.id)) {
        Storage.addBadge(badge.id);
        this.displayBadges();
        Notification.show(`حصلت على شارة جديدة: ${badge.name} ${badge.icon}`, 'success');
        Utils.playSound(1000, 300);
      }
    });
  },

  /**
   * عرض الشارات
   */
  displayBadges() {
    const badgesContainer = document.getElementById('badgesContainer');
    const userBadges = Storage.getBadges();
    
    badgesContainer.innerHTML = '';
    
    userBadges.forEach(badgeId => {
      const badge = CONFIG.badges.find(b => b.id === badgeId);
      if (badge) {
        const badgeElement = document.createElement('span');
        badgeElement.className = 'badge';
        badgeElement.innerHTML = `${badge.icon} ${badge.name}`;
        badgesContainer.appendChild(badgeElement);
      }
    });
  },

  /**
   * حفظ الرسائل
   */
  saveMessages() {
    Storage.saveMessages(this.messages);
  },

  /**
   * تحميل الرسائل
   */
  loadMessages() {
    this.messages = Storage.getMessages();
    this.renderMessages();
    this.displayStats();
    this.displayBadges();
  },

  /**
   * عرض جميع الرسائل
   */
  renderMessages() {
    const chatbox = document.getElementById('chatMessages');
    chatbox.innerHTML = '';
    
    if (this.messages.length === 0) {
      chatbox.innerHTML = `
        <div class="welcome-message">
          <div class="welcome-icon">🎓</div>
          <h2>مرحباً بك في نبراس!</h2>
          <p>منصة التعلم الذكية المدعومة بالذكاء الاصطناعي</p>
          <div class="quick-actions">
            <button class="quick-btn" onclick="sendQuickMessage('ما هو الذكاء الاصطناعي؟')">
              <i class="fas fa-robot"></i> ما هو الذكاء الاصطناعي؟
            </button>
            <button class="quick-btn" onclick="sendQuickMessage('كيف أبدأ تعلم البرمجة؟')">
              <i class="fas fa-code"></i> كيف أبدأ تعلم البرمجة؟
            </button>
            <button class="quick-btn" onclick="sendQuickMessage('أريد تحدياً في الرياضيات')">
              <i class="fas fa-calculator"></i> تحدي في الرياضيات
            </button>
          </div>
        </div>
      `;
    } else {
      this.messages.forEach(message => this.renderMessage(message));
    }
  }
};

// وظائف عامة
function sendQuickMessage(message) {
  const input = document.getElementById('messageInput');
  input.value = message;
  Chat.sendMessage();
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  modal.classList.remove('active');
}

function insertEmoji(emoji) {
  Chat.insertEmoji(emoji);
}

// إغلاق منتقي الإيموجي عند النقر خارجه
document.addEventListener('click', (e) => {
  const picker = document.getElementById('emojiPicker');
  const emojiBtn = document.getElementById('emojiBtn');
  
  if (picker && !picker.contains(e.target) && e.target !== emojiBtn && !emojiBtn.contains(e.target)) {
    picker.style.display = 'none';
  }
});

