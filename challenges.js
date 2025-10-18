/**
 * التحديات اليومية
 * تطوير: SEVEN_CODE7
 */

const Challenges = {
  currentChallenge: null,

  /**
   * عرض التحديات
   */
  show() {
    const chatbox = document.getElementById('chatMessages');
    chatbox.innerHTML = this.getChallengesHTML();
    
    setTimeout(() => {
      this.setupEventListeners();
      this.loadDailyChallenge();
    }, 100);
  },

  /**
   * الحصول على HTML التحديات
   */
  getChallengesHTML() {
    const completedChallenges = Storage.getCompletedChallenges();
    
    return `
      <div class="mode-specific-content" style="padding: 20px;">
        <div style="margin-bottom: 30px; text-align: center;">
          <h2 style="color: var(--brand); margin-bottom: 10px;">
            <i class="fas fa-trophy"></i> التحديات اليومية
          </h2>
          <p style="color: var(--muted);">
            اختبر معرفتك وتحدى نفسك يومياً!
          </p>
          <div style="margin-top: 15px; font-size: 24px; color: var(--brand);">
            <i class="fas fa-check-circle"></i> ${completedChallenges.length} تحدي مكتمل
          </div>
        </div>

        <div id="dailyChallengeContainer">
          <div style="text-align: center; padding: 40px;">
            <div class="loading-spinner" style="margin: 0 auto;"></div>
            <p style="margin-top: 20px; color: var(--muted);">جاري تحميل التحدي اليومي...</p>
          </div>
        </div>

        <div style="margin-top: 30px;">
          <h3 style="color: var(--text); margin-bottom: 15px;">
            <i class="fas fa-list"></i> جميع التحديات
          </h3>
          <div class="library-grid" id="allChallengesGrid">
            ${this.getAllChallengesHTML()}
          </div>
        </div>
      </div>
    `;
  },

  /**
   * الحصول على HTML جميع التحديات
   */
  getAllChallengesHTML() {
    const challenges = CONFIG.dailyChallenges;
    const completedChallenges = Storage.getCompletedChallenges();
    
    let html = '';
    
    challenges.forEach(challenge => {
      const isCompleted = completedChallenges.includes(challenge.id);
      const difficultyClass = challenge.difficulty;
      const difficultyText = {
        easy: 'سهل',
        medium: 'متوسط',
        hard: 'صعب'
      };
      
      html += `
        <div class="library-item ${isCompleted ? 'completed' : ''}" onclick="Challenges.showChallenge('${challenge.id}')">
          <div class="library-item-icon">${isCompleted ? '✅' : '🎯'}</div>
          <div class="library-item-title">${challenge.title}</div>
          <div class="library-item-description">${challenge.description.substring(0, 80)}...</div>
          <div class="library-item-meta">
            <span><i class="fas fa-tag"></i> ${challenge.category}</span>
            <span class="challenge-difficulty ${difficultyClass}">${difficultyText[challenge.difficulty]}</span>
            <span><i class="fas fa-star"></i> ${challenge.points} نقطة</span>
          </div>
        </div>
      `;
    });
    
    return html;
  },

  /**
   * إعداد مستمعي الأحداث
   */
  setupEventListeners() {
    // سيتم إضافة المستمعين حسب الحاجة
  },

  /**
   * تحميل التحدي اليومي
   */
  loadDailyChallenge() {
    // اختيار تحدي عشوائي لم يكتمل بعد
    const completedChallenges = Storage.getCompletedChallenges();
    const availableChallenges = CONFIG.dailyChallenges.filter(c => 
      !completedChallenges.includes(c.id)
    );
    
    let challenge;
    if (availableChallenges.length > 0) {
      // اختيار تحدي عشوائي من التحديات المتاحة
      const randomIndex = Math.floor(Math.random() * availableChallenges.length);
      challenge = availableChallenges[randomIndex];
    } else {
      // إذا اكتملت جميع التحديات، اختر واحداً عشوائياً
      const randomIndex = Math.floor(Math.random() * CONFIG.dailyChallenges.length);
      challenge = CONFIG.dailyChallenges[randomIndex];
    }
    
    this.currentChallenge = challenge;
    this.displayChallenge(challenge, true);
  },

  /**
   * عرض تحدي
   */
  showChallenge(challengeId) {
    const challenge = CONFIG.dailyChallenges.find(c => c.id === challengeId);
    
    if (!challenge) {
      Notification.show('التحدي غير موجود', 'error');
      return;
    }

    this.currentChallenge = challenge;
    
    const container = document.getElementById('dailyChallengeContainer');
    container.innerHTML = this.getChallengeHTML(challenge, false);
  },

  /**
   * عرض التحدي
   */
  displayChallenge(challenge, isDaily = false) {
    const container = document.getElementById('dailyChallengeContainer');
    container.innerHTML = this.getChallengeHTML(challenge, isDaily);
  },

  /**
   * الحصول على HTML التحدي
   */
  getChallengeHTML(challenge, isDaily) {
    const completedChallenges = Storage.getCompletedChallenges();
    const isCompleted = completedChallenges.includes(challenge.id);
    
    const difficultyText = {
      easy: 'سهل',
      medium: 'متوسط',
      hard: 'صعب'
    };

    return `
      <div class="challenge-card">
        <div class="challenge-header">
          <div>
            <div class="challenge-title">
              ${isDaily ? '🌟 ' : ''}${challenge.title}
            </div>
            <div style="color: var(--muted); font-size: 14px; margin-top: 5px;">
              <i class="fas fa-tag"></i> ${challenge.category}
            </div>
          </div>
          <div class="challenge-difficulty ${challenge.difficulty}">
            ${difficultyText[challenge.difficulty]}
          </div>
        </div>
        
        <div class="challenge-description">
          ${challenge.description}
        </div>
        
        ${isCompleted ? `
          <div style="background: var(--success); color: white; padding: 15px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
            <i class="fas fa-check-circle" style="font-size: 32px; margin-bottom: 10px;"></i>
            <div style="font-weight: 700;">تم إكمال هذا التحدي!</div>
          </div>
        ` : ''}
        
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 10px; font-weight: 600; color: var(--text);">
            <i class="fas fa-pencil-alt"></i> إجابتك:
          </label>
          <textarea 
            id="challengeAnswer" 
            class="text" 
            style="width: 100%; min-height: 100px; border-radius: 12px; padding: 15px;"
            placeholder="اكتب إجابتك هنا..."
            ${isCompleted ? 'disabled' : ''}
          ></textarea>
        </div>
        
        <div class="challenge-actions">
          <button class="btn" onclick="Challenges.submitAnswer()" ${isCompleted ? 'disabled' : ''}>
            <i class="fas fa-paper-plane"></i> إرسال الإجابة
          </button>
          <button class="btn outline" onclick="Challenges.showHint()">
            <i class="fas fa-lightbulb"></i> تلميح
          </button>
          <button class="btn ghost" onclick="Challenges.skipChallenge()">
            <i class="fas fa-forward"></i> تخطي
          </button>
        </div>
        
        <div id="challengeFeedback" style="margin-top: 20px;"></div>
      </div>
    `;
  },

  /**
   * إرسال الإجابة
   */
  async submitAnswer() {
    if (!this.currentChallenge) return;

    const answerInput = document.getElementById('challengeAnswer');
    const userAnswer = answerInput.value.trim();
    
    if (!userAnswer) {
      Notification.show('يرجى كتابة إجابة', 'warning');
      return;
    }

    const feedback = document.getElementById('challengeFeedback');
    feedback.innerHTML = '<div style="text-align: center;"><div class="loading-spinner" style="margin: 0 auto;"></div></div>';

    // التحقق من الإجابة
    const isCorrect = this.checkAnswer(userAnswer, this.currentChallenge.answer);
    
    if (isCorrect) {
      // إجابة صحيحة
      const points = this.currentChallenge.points;
      
      feedback.innerHTML = `
        <div style="background: var(--success); color: white; padding: 20px; border-radius: 12px; text-align: center;">
          <i class="fas fa-check-circle" style="font-size: 48px; margin-bottom: 15px;"></i>
          <h3 style="margin-bottom: 10px;">إجابة صحيحة! 🎉</h3>
          <p>حصلت على ${points} نقطة</p>
        </div>
      `;
      
      // تحديث الإحصائيات
      const stats = Storage.getStats();
      stats.pointsCount += points;
      Storage.saveStats(stats);
      Chat.displayStats();
      
      // تسجيل التحدي كمكتمل
      Storage.addCompletedChallenge(this.currentChallenge.id);
      
      // تعطيل الإدخال
      answerInput.disabled = true;
      
      Notification.show(`أحسنت! حصلت على ${points} نقطة`, 'success');
      Utils.playSound(800, 300);
      
      // تحميل تحدي جديد بعد 3 ثوان
      setTimeout(() => {
        this.loadDailyChallenge();
      }, 3000);
    } else {
      // إجابة خاطئة
      feedback.innerHTML = `
        <div style="background: var(--error); color: white; padding: 20px; border-radius: 12px; text-align: center;">
          <i class="fas fa-times-circle" style="font-size: 48px; margin-bottom: 15px;"></i>
          <h3 style="margin-bottom: 10px;">إجابة خاطئة</h3>
          <p>حاول مرة أخرى أو اطلب تلميحاً</p>
        </div>
      `;
      
      Notification.show('إجابة خاطئة، حاول مرة أخرى', 'error');
      Utils.playSound(400, 200);
    }
  },

  /**
   * التحقق من الإجابة
   */
  checkAnswer(userAnswer, correctAnswer) {
    // تطبيع الإجابات
    const normalize = (text) => {
      return text.toLowerCase()
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s]/g, '');
    };
    
    const normalizedUser = normalize(userAnswer);
    const normalizedCorrect = normalize(correctAnswer);
    
    // التحقق من التطابق التام
    if (normalizedUser === normalizedCorrect) {
      return true;
    }
    
    // التحقق من التطابق الجزئي (70% على الأقل)
    const similarity = this.calculateSimilarity(normalizedUser, normalizedCorrect);
    return similarity >= 0.7;
  },

  /**
   * حساب التشابه بين نصين
   */
  calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) {
      return 1.0;
    }
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  },

  /**
   * حساب مسافة Levenshtein
   */
  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  },

  /**
   * عرض تلميح
   */
  showHint() {
    if (!this.currentChallenge) return;

    const feedback = document.getElementById('challengeFeedback');
    feedback.innerHTML = `
      <div style="background: var(--info); color: white; padding: 15px; border-radius: 12px;">
        <h4 style="margin-bottom: 10px;"><i class="fas fa-lightbulb"></i> تلميح:</h4>
        <p>${this.currentChallenge.hint}</p>
      </div>
    `;
    
    Utils.playSound(600, 100);
  },

  /**
   * تخطي التحدي
   */
  skipChallenge() {
    if (confirm('هل أنت متأكد من تخطي هذا التحدي؟')) {
      this.loadDailyChallenge();
      Notification.show('تم تحميل تحدي جديد', 'info');
    }
  }
};

