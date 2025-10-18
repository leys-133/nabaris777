/**
 * الإحصائيات المتقدمة
 * تطوير: SEVEN_CODE7
 */

const Analytics = {
  charts: {},

  /**
   * عرض الإحصائيات
   */
  show() {
    const chatbox = document.getElementById('chatMessages');
    chatbox.innerHTML = this.getAnalyticsHTML();
    
    setTimeout(() => {
      this.initCharts();
    }, 100);
  },

  /**
   * الحصول على HTML الإحصائيات
   */
  getAnalyticsHTML() {
    const stats = Storage.getStats();
    const badges = Storage.getBadges();
    const completedChallenges = Storage.getCompletedChallenges();
    const readArticles = Storage.getReadArticles();
    
    return `
      <div class="mode-specific-content" style="padding: 20px;">
        <div style="margin-bottom: 30px; text-align: center;">
          <h2 style="color: var(--brand); margin-bottom: 10px;">
            <i class="fas fa-chart-bar"></i> الإحصائيات المتقدمة
          </h2>
          <p style="color: var(--muted);">
            تتبع تقدمك وإنجازاتك بالتفصيل
          </p>
        </div>

        <!-- ملخص الإحصائيات -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
          <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 12px; text-align: center;">
            <div style="font-size: 36px; font-weight: 800; margin-bottom: 5px;">${stats.questionsCount}</div>
            <div style="opacity: 0.9;">أسئلة تم الإجابة عليها</div>
          </div>
          <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 12px; text-align: center;">
            <div style="font-size: 36px; font-weight: 800; margin-bottom: 5px;">${stats.pointsCount}</div>
            <div style="opacity: 0.9;">إجمالي النقاط</div>
          </div>
          <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 20px; border-radius: 12px; text-align: center;">
            <div style="font-size: 36px; font-weight: 800; margin-bottom: 5px;">${stats.learningLevel}</div>
            <div style="opacity: 0.9;">المستوى الحالي</div>
          </div>
          <div style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 20px; border-radius: 12px; text-align: center;">
            <div style="font-size: 36px; font-weight: 800; margin-bottom: 5px;">${stats.streakCount}</div>
            <div style="opacity: 0.9;">سلسلة الأيام</div>
          </div>
        </div>

        <!-- الرسوم البيانية -->
        <div class="analytics-grid">
          <div class="chart-container">
            <div class="chart-title">
              <i class="fas fa-chart-line"></i> التقدم اليومي
            </div>
            <canvas id="progressChart"></canvas>
          </div>
          
          <div class="chart-container">
            <div class="chart-title">
              <i class="fas fa-chart-pie"></i> توزيع النشاطات
            </div>
            <canvas id="activityChart"></canvas>
          </div>
          
          <div class="chart-container">
            <div class="chart-title">
              <i class="fas fa-chart-bar"></i> النقاط الأسبوعية
            </div>
            <canvas id="pointsChart"></canvas>
          </div>
          
          <div class="chart-container">
            <div class="chart-title">
              <i class="fas fa-trophy"></i> الإنجازات
            </div>
            <div style="padding: 20px;">
              <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                  <span><i class="fas fa-medal"></i> الشارات</span>
                  <span style="font-weight: 700;">${badges.length} / ${CONFIG.badges.length}</span>
                </div>
                <div class="progress">
                  <span style="width: ${(badges.length / CONFIG.badges.length) * 100}%"></span>
                </div>
              </div>
              
              <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                  <span><i class="fas fa-tasks"></i> التحديات</span>
                  <span style="font-weight: 700;">${completedChallenges.length} / ${CONFIG.dailyChallenges.length}</span>
                </div>
                <div class="progress">
                  <span style="width: ${(completedChallenges.length / CONFIG.dailyChallenges.length) * 100}%"></span>
                </div>
              </div>
              
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                  <span><i class="fas fa-book-open"></i> المقالات</span>
                  <span style="font-weight: 700;">${readArticles.length} / ${CONFIG.libraryContent.length}</span>
                </div>
                <div class="progress">
                  <span style="width: ${(readArticles.length / CONFIG.libraryContent.length) * 100}%"></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- معلومات إضافية -->
        <div style="margin-top: 30px; padding: 20px; background: var(--card-bg); border-radius: 12px; border: 1px solid var(--border);">
          <h3 style="margin-bottom: 15px; color: var(--brand);">
            <i class="fas fa-info-circle"></i> معلومات إضافية
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
            <div>
              <div style="color: var(--muted); margin-bottom: 5px;">تاريخ البدء</div>
              <div style="font-weight: 600;">${Utils.formatDate(stats.startDate)}</div>
            </div>
            <div>
              <div style="color: var(--muted); margin-bottom: 5px;">آخر زيارة</div>
              <div style="font-weight: 600;">${stats.lastVisit ? Utils.formatDate(stats.lastVisit) : 'غير متوفر'}</div>
            </div>
            <div>
              <div style="color: var(--muted); margin-bottom: 5px;">إجمالي الوقت</div>
              <div style="font-weight: 600;">${Math.floor(stats.totalTime / 60)} دقيقة</div>
            </div>
            <div>
              <div style="color: var(--muted); margin-bottom: 5px;">متوسط الوقت لكل سؤال</div>
              <div style="font-weight: 600;">${stats.questionsCount > 0 ? Math.round(stats.totalTime / stats.questionsCount) : 0} ثانية</div>
            </div>
          </div>
        </div>

        <!-- أزرار الإجراءات -->
        <div style="margin-top: 30px; text-align: center; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
          <button class="btn" onclick="Analytics.exportReport()">
            <i class="fas fa-file-export"></i> تصدير التقرير
          </button>
          <button class="btn outline" onclick="Analytics.shareProgress()">
            <i class="fas fa-share-alt"></i> مشاركة التقدم
          </button>
          <button class="btn ghost" onclick="Analytics.resetStats()">
            <i class="fas fa-redo"></i> إعادة تعيين الإحصائيات
          </button>
        </div>
      </div>
    `;
  },

  /**
   * تهيئة الرسوم البيانية
   */
  initCharts() {
    if (typeof Chart === 'undefined') {
      console.warn('مكتبة Chart.js غير محملة');
      return;
    }

    this.initProgressChart();
    this.initActivityChart();
    this.initPointsChart();
  },

  /**
   * رسم بياني للتقدم
   */
  initProgressChart() {
    const ctx = document.getElementById('progressChart');
    if (!ctx) return;

    const stats = Storage.getStats();
    const days = 7;
    const labels = [];
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('ar-SA', { weekday: 'short' }));
      // بيانات تجريبية - يمكن تحسينها لتخزين بيانات يومية فعلية
      data.push(Math.floor(Math.random() * 50) + 10);
    }

    this.charts.progress = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'الأسئلة',
          data,
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  },

  /**
   * رسم بياني للنشاطات
   */
  initActivityChart() {
    const ctx = document.getElementById('activityChart');
    if (!ctx) return;

    const completedChallenges = Storage.getCompletedChallenges().length;
    const readArticles = Storage.getReadArticles().length;
    const stats = Storage.getStats();

    this.charts.activity = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['الأسئلة', 'التحديات', 'المقالات'],
        datasets: [{
          data: [stats.questionsCount, completedChallenges, readArticles],
          backgroundColor: [
            '#667eea',
            '#10b981',
            '#f59e0b'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  },

  /**
   * رسم بياني للنقاط
   */
  initPointsChart() {
    const ctx = document.getElementById('pointsChart');
    if (!ctx) return;

    const weeks = ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4'];
    const data = weeks.map(() => Math.floor(Math.random() * 200) + 50);

    this.charts.points = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: weeks,
        datasets: [{
          label: 'النقاط',
          data,
          backgroundColor: 'rgba(102, 126, 234, 0.8)',
          borderColor: '#667eea',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  },

  /**
   * تصدير التقرير
   */
  exportReport() {
    const stats = Storage.getStats();
    const badges = Storage.getBadges();
    const completedChallenges = Storage.getCompletedChallenges();
    const readArticles = Storage.getReadArticles();

    const report = `
# تقرير التقدم - منصة نبراس

## الإحصائيات العامة
- **الأسئلة المجابة**: ${stats.questionsCount}
- **إجمالي النقاط**: ${stats.pointsCount}
- **المستوى الحالي**: ${stats.learningLevel}
- **سلسلة الأيام**: ${stats.streakCount}
- **إجمالي الوقت**: ${Math.floor(stats.totalTime / 60)} دقيقة

## الإنجازات
- **الشارات المكتسبة**: ${badges.length} / ${CONFIG.badges.length}
- **التحديات المكتملة**: ${completedChallenges.length} / ${CONFIG.dailyChallenges.length}
- **المقالات المقروءة**: ${readArticles.length} / ${CONFIG.libraryContent.length}

## الشارات
${badges.map(id => {
  const badge = CONFIG.badges.find(b => b.id === id);
  return badge ? `- ${badge.icon} ${badge.name}` : '';
}).join('\n')}

## معلومات إضافية
- **تاريخ البدء**: ${Utils.formatDate(stats.startDate)}
- **آخر زيارة**: ${stats.lastVisit ? Utils.formatDate(stats.lastVisit) : 'غير متوفر'}
- **متوسط الوقت لكل سؤال**: ${stats.questionsCount > 0 ? Math.round(stats.totalTime / stats.questionsCount) : 0} ثانية

---
تم إنشاء هذا التقرير بواسطة منصة نبراس - SEVEN_CODE7
    `.trim();

    Utils.downloadFile(report, `nebras_report_${new Date().toISOString().split('T')[0]}.md`, 'text/markdown');
    Notification.show('تم تصدير التقرير بنجاح', 'success');
  },

  /**
   * مشاركة التقدم
   */
  shareProgress() {
    const stats = Storage.getStats();
    const shareText = `لقد حققت ${stats.pointsCount} نقطة ووصلت إلى المستوى ${stats.learningLevel} على منصة نبراس التعليمية! 🎓✨`;

    if (navigator.share) {
      navigator.share({
        title: 'تقدمي على نبراس',
        text: shareText,
        url: window.location.href
      }).catch(err => console.log('خطأ في المشاركة:', err));
    } else {
      Utils.copyToClipboard(shareText);
      Notification.show('تم نسخ النص للمشاركة', 'success');
    }
  },

  /**
   * إعادة تعيين الإحصائيات
   */
  resetStats() {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الإحصائيات؟ هذا الإجراء لا يمكن التراجع عنه!')) {
      if (confirm('تأكيد نهائي: سيتم حذف جميع بياناتك!')) {
        Storage.clear();
        Notification.show('تم إعادة تعيين الإحصائيات', 'success');
        setTimeout(() => {
          location.reload();
        }, 1500);
      }
    }
  }
};

