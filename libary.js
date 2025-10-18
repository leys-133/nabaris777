/**
 * المكتبة التعليمية
 * تطوير: SEVEN_CODE7
 */

const Library = {
  /**
   * عرض المكتبة
   */
  show() {
    const chatbox = document.getElementById('chatMessages');
    chatbox.innerHTML = this.getLibraryHTML();
    
    setTimeout(() => {
      this.setupEventListeners();
    }, 100);
  },

  /**
   * الحصول على HTML المكتبة
   */
  getLibraryHTML() {
    const content = CONFIG.libraryContent;
    const readArticles = Storage.getReadArticles();
    
    let html = `
      <div class="mode-specific-content" style="padding: 20px;">
        <div style="margin-bottom: 20px;">
          <h2 style="color: var(--brand); margin-bottom: 10px;">
            <i class="fas fa-book"></i> المكتبة التعليمية
          </h2>
          <p style="color: var(--muted);">
            مجموعة من المقالات والدروس التعليمية في مختلف المجالات
          </p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <input 
            type="text" 
            id="librarySearch" 
            class="text" 
            placeholder="ابحث في المكتبة..."
            style="width: 100%;"
          />
        </div>
        
        <div class="library-grid">
    `;
    
    content.forEach(article => {
      const isRead = readArticles.includes(article.id);
      const readBadge = isRead ? '<span style="background: var(--success); color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; margin-right: 8px;">✓ مقروء</span>' : '';
      
      html += `
        <div class="library-item" data-article-id="${article.id}" data-category="${article.category}" data-title="${article.title}">
          <div class="library-item-icon">${article.icon}</div>
          <div class="library-item-title">
            ${article.title}
            ${readBadge}
          </div>
          <div class="library-item-description">${article.description}</div>
          <div class="library-item-meta">
            <span><i class="fas fa-tag"></i> ${article.category}</span>
            <span><i class="fas fa-clock"></i> ${article.readTime}</span>
            <span><i class="fas fa-signal"></i> ${article.difficulty}</span>
          </div>
        </div>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
    
    return html;
  },

  /**
   * إعداد مستمعي الأحداث
   */
  setupEventListeners() {
    // النقر على المقالة
    document.querySelectorAll('.library-item').forEach(item => {
      item.addEventListener('click', () => {
        const articleId = item.dataset.articleId;
        this.showArticle(articleId);
      });
    });

    // البحث
    const searchInput = document.getElementById('librarySearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filterArticles(e.target.value);
      });
    }
  },

  /**
   * عرض مقالة
   */
  showArticle(articleId) {
    const article = CONFIG.libraryContent.find(a => a.id === articleId);
    
    if (!article) {
      Notification.show('المقالة غير موجودة', 'error');
      return;
    }

    const chatbox = document.getElementById('chatMessages');
    chatbox.innerHTML = `
      <div class="mode-specific-content" style="padding: 20px;">
        <button class="btn ghost" onclick="Library.show()" style="margin-bottom: 20px;">
          <i class="fas fa-arrow-right"></i> العودة إلى المكتبة
        </button>
        
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="font-size: 64px; margin-bottom: 15px;">${article.icon}</div>
          <h1 style="color: var(--brand); margin-bottom: 10px;">${article.title}</h1>
          <div style="display: flex; gap: 15px; justify-content: center; color: var(--muted); font-size: 14px;">
            <span><i class="fas fa-tag"></i> ${article.category}</span>
            <span><i class="fas fa-clock"></i> ${article.readTime}</span>
            <span><i class="fas fa-signal"></i> ${article.difficulty}</span>
          </div>
        </div>
        
        <div style="background: var(--card-bg); padding: 30px; border-radius: 16px; line-height: 1.8; font-size: 16px;">
          ${this.formatArticleContent(article.content)}
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
          <button class="btn" onclick="Library.askAboutArticle('${article.id}')">
            <i class="fas fa-question-circle"></i> اسأل عن هذا الموضوع
          </button>
          <button class="btn outline" onclick="Library.shareArticle('${article.id}')">
            <i class="fas fa-share"></i> مشاركة
          </button>
        </div>
      </div>
    `;

    // تسجيل المقالة كمقروءة
    Storage.addReadArticle(articleId);
    
    // تحديث الإحصائيات
    const stats = Storage.getStats();
    stats.pointsCount += 5;
    Storage.saveStats(stats);
    Chat.displayStats();
    
    Notification.show('حصلت على 5 نقاط لقراءة المقالة!', 'success');
  },

  /**
   * تنسيق محتوى المقالة
   */
  formatArticleContent(content) {
    // يمكن توسيع هذا لدعم Markdown كامل
    return content.split('\n').map(paragraph => {
      if (paragraph.trim()) {
        return `<p style="margin-bottom: 15px;">${paragraph}</p>`;
      }
      return '';
    }).join('');
  },

  /**
   * السؤال عن المقالة
   */
  async askAboutArticle(articleId) {
    const article = CONFIG.libraryContent.find(a => a.id === articleId);
    
    if (!article) return;

    // العودة إلى وضع المحادثة
    Modes.switchMode('learn');
    
    // إرسال سؤال تلقائي
    const messageInput = document.getElementById('messageInput');
    messageInput.value = `أخبرني المزيد عن ${article.title}`;
    await Chat.sendMessage();
  },

  /**
   * مشاركة المقالة
   */
  shareArticle(articleId) {
    const article = CONFIG.libraryContent.find(a => a.id === articleId);
    
    if (!article) return;

    const shareText = `اقرأ "${article.title}" على منصة نبراس التعليمية!`;
    
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: shareText,
        url: window.location.href
      }).catch(err => console.log('خطأ في المشاركة:', err));
    } else {
      Utils.copyToClipboard(shareText);
      Notification.show('تم نسخ رابط المشاركة', 'success');
    }
  },

  /**
   * تصفية المقالات
   */
  filterArticles(searchTerm) {
    const items = document.querySelectorAll('.library-item');
    const term = searchTerm.toLowerCase().trim();
    
    items.forEach(item => {
      const title = item.dataset.title.toLowerCase();
      const category = item.dataset.category.toLowerCase();
      
      if (title.includes(term) || category.includes(term) || term === '') {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }
};

