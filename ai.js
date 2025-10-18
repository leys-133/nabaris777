/**
 * وحدة التواصل مع الذكاء الاصطناعي
 * تطوير: SEVEN_CODE7
 */

const AI = {
  /**
   * إرسال رسالة إلى الذكاء الاصطناعي
   */
  async sendMessage(messages, options = {}) {
    const {
      model = CONFIG.api.model,
      temperature = CONFIG.api.temperature,
      maxTokens = CONFIG.api.maxTokens,
      stream = false
    } = options;

    try {
      const response = await fetch(CONFIG.api.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.api.key}`
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          stream
        })
      });

      if (!response.ok) {
        throw new Error(`خطأ في الاستجابة: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: data.choices[0].message.content,
        usage: data.usage
      };
    } catch (err) {
      console.error('خطأ في التواصل مع الذكاء الاصطناعي:', err);
      return {
        success: false,
        error: err.message
      };
    }
  },

  /**
   * إرسال رسالة مع دعم الصور
   */
  async sendMessageWithImages(text, images, systemPrompt) {
    const content = [
      { type: 'text', text }
    ];

    // إضافة الصور
    images.forEach(image => {
      content.push({
        type: 'image_url',
        image_url: {
          url: image
        }
      });
    });

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content }
    ];

    return await this.sendMessage(messages);
  },

  /**
   * إرسال رسالة مع السياق
   */
  async sendMessageWithContext(userMessage, context, systemPrompt) {
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // إضافة السياق (الرسائل السابقة)
    context.forEach(msg => {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    });

    // إضافة الرسالة الجديدة
    messages.push({
      role: 'user',
      content: userMessage
    });

    return await this.sendMessage(messages);
  },

  /**
   * توليد أمثلة
   */
  async generateExamples(topic, count = 3) {
    const prompt = `قدم ${count} أمثلة واضحة ومتنوعة عن: ${topic}. اجعل الأمثلة عملية ومرتبطة بالحياة اليومية.`;
    
    const messages = [
      { role: 'system', content: CONFIG.modes.examples.systemPrompt },
      { role: 'user', content: prompt }
    ];

    return await this.sendMessage(messages);
  },

  /**
   * توليد أسئلة تدريبية
   */
  async generatePracticeQuestions(topic, difficulty = 'medium', count = 5) {
    const difficultyText = {
      easy: 'سهلة',
      medium: 'متوسطة',
      hard: 'صعبة'
    };

    const prompt = `أنشئ ${count} أسئلة تدريبية ${difficultyText[difficulty]} عن: ${topic}. قدم الأسئلة مع إجاباتها النموذجية وشرح مختصر.`;
    
    const messages = [
      { role: 'system', content: CONFIG.modes.practice.systemPrompt },
      { role: 'user', content: prompt }
    ];

    return await this.sendMessage(messages);
  },

  /**
   * إنشاء خطة دراسية
   */
  async createStudyPlan(subject, duration, level) {
    const prompt = `أنشئ خطة دراسية مفصلة لـ ${subject} لمدة ${duration}. المستوى: ${level}. قسّم الخطة إلى أسابيع وأيام مع تحديد المواضيع والأهداف.`;
    
    const messages = [
      { role: 'system', content: CONFIG.modes.planner.systemPrompt },
      { role: 'user', content: prompt }
    ];

    return await this.sendMessage(messages);
  },

  /**
   * شرح كود برمجي
   */
  async explainCode(code, language) {
    const prompt = `اشرح هذا الكود المكتوب بلغة ${language} بشكل مفصل:\n\n\`\`\`${language}\n${code}\n\`\`\``;
    
    const messages = [
      { role: 'system', content: CONFIG.modes.lab.systemPrompt },
      { role: 'user', content: prompt }
    ];

    return await this.sendMessage(messages);
  },

  /**
   * إصلاح كود برمجي
   */
  async fixCode(code, language, error) {
    const prompt = `هذا الكود المكتوب بلغة ${language} يحتوي على خطأ:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nالخطأ: ${error}\n\nقم بإصلاح الكود واشرح المشكلة والحل.`;
    
    const messages = [
      { role: 'system', content: CONFIG.modes.lab.systemPrompt },
      { role: 'user', content: prompt }
    ];

    return await this.sendMessage(messages);
  },

  /**
   * توليد كود برمجي
   */
  async generateCode(description, language) {
    const prompt = `اكتب كود برمجي بلغة ${language} يقوم بـ: ${description}. قدم الكود مع شرح مختصر لكيفية عمله.`;
    
    const messages = [
      { role: 'system', content: CONFIG.modes.lab.systemPrompt },
      { role: 'user', content: prompt }
    ];

    return await this.sendMessage(messages);
  },

  /**
   * تحليل إجابة
   */
  async analyzeAnswer(question, userAnswer, correctAnswer) {
    const prompt = `السؤال: ${question}\n\nإجابة الطالب: ${userAnswer}\n\nالإجابة الصحيحة: ${correctAnswer}\n\nقيّم إجابة الطالب وقدم تغذية راجعة بناءة.`;
    
    const messages = [
      { role: 'system', content: CONFIG.modes.practice.systemPrompt },
      { role: 'user', content: prompt }
    ];

    return await this.sendMessage(messages);
  },

  /**
   * توليد تحدي
   */
  async generateChallenge(category, difficulty) {
    const prompt = `أنشئ تحدياً تعليمياً في مجال ${category} بمستوى صعوبة ${difficulty}. قدم التحدي مع الحل والشرح.`;
    
    const messages = [
      { role: 'system', content: CONFIG.modes.challenges.systemPrompt },
      { role: 'user', content: prompt }
    ];

    return await this.sendMessage(messages);
  },

  /**
   * تلخيص نص
   */
  async summarizeText(text, maxLength = 200) {
    const prompt = `لخص النص التالي في حوالي ${maxLength} كلمة:\n\n${text}`;
    
    const messages = [
      { role: 'system', content: 'أنت ملخص نصوص محترف. قدم ملخصات دقيقة وشاملة.' },
      { role: 'user', content: prompt }
    ];

    return await this.sendMessage(messages);
  },

  /**
   * ترجمة نص
   */
  async translateText(text, targetLanguage) {
    const prompt = `ترجم النص التالي إلى ${targetLanguage}:\n\n${text}`;
    
    const messages = [
      { role: 'system', content: 'أنت مترجم محترف. قدم ترجمات دقيقة وطبيعية.' },
      { role: 'user', content: prompt }
    ];

    return await this.sendMessage(messages);
  },

  /**
   * تحسين نص
   */
  async improveText(text, style = 'formal') {
    const styleText = {
      formal: 'رسمي',
      casual: 'غير رسمي',
      academic: 'أكاديمي',
      creative: 'إبداعي'
    };

    const prompt = `حسّن النص التالي ليكون بأسلوب ${styleText[style]}:\n\n${text}`;
    
    const messages = [
      { role: 'system', content: 'أنت محرر نصوص محترف. قدم نصوصاً محسّنة وواضحة.' },
      { role: 'user', content: prompt }
    ];

    return await this.sendMessage(messages);
  },

  /**
   * الإجابة على سؤال من سياق
   */
  async answerFromContext(question, context) {
    const prompt = `بناءً على السياق التالي:\n\n${context}\n\nأجب على السؤال: ${question}`;
    
    const messages = [
      { role: 'system', content: 'أنت مساعد ذكي يجيب على الأسئلة بناءً على السياق المعطى فقط.' },
      { role: 'user', content: prompt }
    ];

    return await this.sendMessage(messages);
  },

  /**
   * توليد أفكار إبداعية
   */
  async generateIdeas(topic, count = 5) {
    const prompt = `قدم ${count} أفكار إبداعية ومبتكرة حول: ${topic}`;
    
    const messages = [
      { role: 'system', content: 'أنت مولد أفكار إبداعي. قدم أفكاراً مبتكرة وقابلة للتطبيق.' },
      { role: 'user', content: prompt }
    ];

    return await this.sendMessage(messages);
  },

  /**
   * تحليل نقاط القوة والضعف
   */
  async analyzeSWOT(topic) {
    const prompt = `قم بتحليل SWOT (نقاط القوة، نقاط الضعف، الفرص، التهديدات) لـ: ${topic}`;
    
    const messages = [
      { role: 'system', content: 'أنت محلل استراتيجي. قدم تحليلات شاملة ومتوازنة.' },
      { role: 'user', content: prompt }
    ];

    return await this.sendMessage(messages);
  },

  /**
   * إنشاء قصة تعليمية
   */
  async createEducationalStory(concept, ageGroup) {
    const prompt = `اكتب قصة تعليمية قصيرة تشرح مفهوم ${concept} للفئة العمرية: ${ageGroup}. اجعل القصة ممتعة وسهلة الفهم.`;
    
    const messages = [
      { role: 'system', content: 'أنت كاتب قصص تعليمية. اجعل القصص ممتعة وغنية بالمعلومات.' },
      { role: 'user', content: prompt }
    ];

    return await this.sendMessage(messages);
  },

  /**
   * تقييم التقدم
   */
  async evaluateProgress(stats) {
    const prompt = `بناءً على الإحصائيات التالية:\n- عدد الأسئلة: ${stats.questionsCount}\n- المستوى: ${stats.learningLevel}\n- النقاط: ${stats.pointsCount}\n- السلسلة: ${stats.streakCount} يوم\n\nقدم تقييماً للتقدم ونصائح للتحسين.`;
    
    const messages = [
      { role: 'system', content: CONFIG.modes.analytics.systemPrompt },
      { role: 'user', content: prompt }
    ];

    return await this.sendMessage(messages);
  },

  /**
   * ضغط السياق (للذاكرة)
   */
  async compressContext(messages) {
    const conversation = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    const prompt = `لخص المحادثة التالية في نقاط رئيسية:\n\n${conversation}`;
    
    const systemMessages = [
      { role: 'system', content: 'أنت ملخص محادثات. قدم ملخصات موجزة تحتفظ بالمعلومات المهمة.' },
      { role: 'user', content: prompt }
    ];

    return await this.sendMessage(systemMessages);
  }
};

// تجميد الكائن
Object.freeze(AI);

