/**
 * ملف التكوين الرئيسي لمنصة نبراس
 * تطوير: SEVEN_CODE7
 */

const CONFIG = {
  // إعدادات API
  api: {
    key: 'AIzaSyAU69TKKDvjj1zsPoeB0kmrusP2UOAC50U',
    url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    model: 'gpt-4o-mini',
    maxTokens: 2000,
    temperature: 0.7
  },

  // إعدادات التطبيق
  app: {
    name: 'نبراس',
    version: '2.0.0',
    studio: 'SEVEN_CODE7',
    description: 'منصة التعلم الذكية المدعومة بالذكاء الاصطناعي'
  },

  // إعدادات التخزين المحلي
  storage: {
    prefix: 'nebras_',
    keys: {
      theme: 'theme',
      messages: 'messages',
      stats: 'stats',
      settings: 'settings',
      badges: 'badges',
      challenges: 'challenges',
      library: 'library'
    }
  },

  // إعدادات الواجهة
  ui: {
    maxMessages: 50,
    typingSpeed: 30,
    animationDuration: 300,
    notificationDuration: 5000,
    autoSaveInterval: 30000
  },

  // أوضاع التعلم
  modes: {
    learn: {
      id: 'learn',
      title: 'المعلم الافتراضي',
      icon: 'fas fa-book-open',
      systemPrompt: 'أنت معلم افتراضي ذكي ومتخصص. مهمتك شرح المفاهيم بطريقة واضحة ومبسطة مع أمثلة عملية. استخدم أسلوباً تفاعلياً وشجع الطالب على التفكير النقدي.'
    },
    examples: {
      id: 'examples',
      title: 'مولد الأمثلة',
      icon: 'fas fa-lightbulb',
      systemPrompt: 'أنت مولد أمثلة إبداعي. قدم أمثلة متنوعة وواقعية لأي مفهوم يطلبه المستخدم. اجعل الأمثلة سهلة الفهم ومرتبطة بالحياة اليومية.'
    },
    practice: {
      id: 'practice',
      title: 'التدريب والاختبار',
      icon: 'fas fa-pen',
      systemPrompt: 'أنت مدرب ومقيّم. قدم تمارين وأسئلة متدرجة الصعوبة، وقيّم إجابات المستخدم بشكل بناء. قدم تغذية راجعة مفصلة وشجع على التحسن المستمر.'
    },
    workshop: {
      id: 'workshop',
      title: 'ورشة العمل',
      icon: 'fas fa-flask',
      systemPrompt: 'أنت مرشد ورشة عمل عملية. ساعد المستخدم على تطبيق المعرفة من خلال مشاريع وتجارب عملية. قدم إرشادات خطوة بخطوة وحلول للمشاكل.'
    },
    planner: {
      id: 'planner',
      title: 'المخطط الدراسي',
      icon: 'fas fa-calendar-alt',
      systemPrompt: 'أنت مخطط دراسي ذكي. ساعد المستخدم على تنظيم وقته وإنشاء خطط دراسية فعالة. قدم نصائح حول إدارة الوقت والتحفيز الذاتي.'
    },
    lab: {
      id: 'lab',
      title: 'المختبر البرمجي',
      icon: 'fas fa-code',
      systemPrompt: 'أنت مساعد برمجة خبير. ساعد المستخدم في كتابة وفهم الأكواد البرمجية. اشرح المفاهيم البرمجية بوضوح وقدم أمثلة عملية قابلة للتنفيذ.'
    },
    library: {
      id: 'library',
      title: 'المكتبة التعليمية',
      icon: 'fas fa-book',
      systemPrompt: 'أنت أمين مكتبة معرفية. قدم معلومات موثوقة ومنظمة حول مختلف المواضيع. استخدم مصادر متعددة واشرح المفاهيم بعمق.'
    },
    challenges: {
      id: 'challenges',
      title: 'التحديات اليومية',
      icon: 'fas fa-trophy',
      systemPrompt: 'أنت منشئ تحديات تعليمية. قدم تحديات ممتعة ومحفزة تناسب مستوى المستخدم. اجعل التحديات متنوعة وتغطي مجالات مختلفة.'
    },
    analytics: {
      id: 'analytics',
      title: 'الإحصائيات المتقدمة',
      icon: 'fas fa-chart-bar',
      systemPrompt: 'أنت محلل بيانات تعليمية. ساعد المستخدم على فهم تقدمه من خلال تحليل إحصائياته. قدم رؤى قيمة ونصائح للتحسين.'
    }
  },

  // إعدادات الشارات
  badges: [
    { id: 'beginner', name: 'المبتدئ', icon: '🌟', requirement: 0 },
    { id: 'learner', name: 'المتعلم', icon: '📚', requirement: 10 },
    { id: 'explorer', name: 'المستكشف', icon: '🔍', requirement: 25 },
    { id: 'scholar', name: 'الباحث', icon: '🎓', requirement: 50 },
    { id: 'expert', name: 'الخبير', icon: '💡', requirement: 100 },
    { id: 'master', name: 'الماهر', icon: '🏆', requirement: 200 },
    { id: 'genius', name: 'العبقري', icon: '🧠', requirement: 500 },
    { id: 'legend', name: 'الأسطورة', icon: '👑', requirement: 1000 }
  ],

  // المكتبة التعليمية - محتوى افتراضي
  libraryContent: [
    {
      id: 'intro-ai',
      title: 'مقدمة في الذكاء الاصطناعي',
      icon: '🤖',
      category: 'تقنية',
      description: 'تعرف على أساسيات الذكاء الاصطناعي وتطبيقاته في الحياة اليومية',
      content: `الذكاء الاصطناعي هو فرع من علوم الحاسوب يهدف إلى إنشاء أنظمة قادرة على محاكاة الذكاء البشري...`,
      readTime: '5 دقائق',
      difficulty: 'مبتدئ'
    },
    {
      id: 'programming-basics',
      title: 'أساسيات البرمجة',
      icon: '💻',
      category: 'برمجة',
      description: 'ابدأ رحلتك في عالم البرمجة من الصفر',
      content: `البرمجة هي عملية كتابة تعليمات للحاسوب لتنفيذ مهام معينة...`,
      readTime: '10 دقائق',
      difficulty: 'مبتدئ'
    },
    {
      id: 'math-algebra',
      title: 'الجبر الأساسي',
      icon: '🔢',
      category: 'رياضيات',
      description: 'فهم المعادلات والمتغيرات الجبرية',
      content: `الجبر هو فرع من الرياضيات يتعامل مع الرموز والقواعد لمعالجة هذه الرموز...`,
      readTime: '8 دقائق',
      difficulty: 'متوسط'
    },
    {
      id: 'physics-motion',
      title: 'الحركة والقوة',
      icon: '⚡',
      category: 'فيزياء',
      description: 'استكشف قوانين نيوتن للحركة',
      content: `قوانين نيوتن الثلاثة هي أساس الميكانيكا الكلاسيكية...`,
      readTime: '7 دقائق',
      difficulty: 'متوسط'
    },
    {
      id: 'chemistry-atoms',
      title: 'الذرات والجزيئات',
      icon: '⚗️',
      category: 'كيمياء',
      description: 'تعرف على البنية الأساسية للمادة',
      content: `الذرة هي أصغر وحدة من العنصر الكيميائي التي تحتفظ بخصائصه...`,
      readTime: '6 دقائق',
      difficulty: 'مبتدئ'
    },
    {
      id: 'biology-cells',
      title: 'الخلايا الحية',
      icon: '🧬',
      category: 'أحياء',
      description: 'اكتشف وحدة البناء الأساسية للحياة',
      content: `الخلية هي الوحدة الأساسية للحياة في جميع الكائنات الحية...`,
      readTime: '9 دقائق',
      difficulty: 'مبتدئ'
    }
  ],

  // التحديات اليومية - محتوى افتراضي
  dailyChallenges: [
    {
      id: 'math-challenge-1',
      title: 'تحدي الحساب السريع',
      category: 'رياضيات',
      difficulty: 'easy',
      description: 'احسب نتيجة: 25 × 4 + 18 ÷ 2 = ؟',
      answer: '109',
      points: 10,
      hint: 'ابدأ بالضرب والقسمة أولاً، ثم اجمع النتائج'
    },
    {
      id: 'logic-challenge-1',
      title: 'تحدي المنطق',
      category: 'منطق',
      difficulty: 'medium',
      description: 'إذا كان كل القطط حيوانات، وبعض الحيوانات تطير، هل يمكن أن تطير بعض القطط؟',
      answer: 'لا',
      points: 20,
      hint: 'فكر في الخصائص المشتركة والخاصة'
    },
    {
      id: 'code-challenge-1',
      title: 'تحدي البرمجة',
      category: 'برمجة',
      difficulty: 'medium',
      description: 'اكتب دالة JavaScript تعكس ترتيب الأحرف في نص معطى',
      answer: 'function reverse(str) { return str.split("").reverse().join(""); }',
      points: 30,
      hint: 'استخدم split و reverse و join'
    },
    {
      id: 'science-challenge-1',
      title: 'تحدي العلوم',
      category: 'علوم',
      difficulty: 'easy',
      description: 'ما هو العنصر الكيميائي الأكثر وفرة في الكون؟',
      answer: 'الهيدروجين',
      points: 10,
      hint: 'إنه أخف العناصر وأبسطها'
    },
    {
      id: 'language-challenge-1',
      title: 'تحدي اللغة',
      category: 'لغة',
      difficulty: 'hard',
      description: 'أكمل المثل: "العلم في الصغر كالنقش على ..."',
      answer: 'الحجر',
      points: 15,
      hint: 'شيء يدوم طويلاً'
    }
  ],

  // الألوان المتاحة للتخصيص
  themeColors: [
    { name: 'أزرق بنفسجي', primary: '#667eea', secondary: '#764ba2' },
    { name: 'أخضر', primary: '#10b981', secondary: '#059669' },
    { name: 'أحمر', primary: '#ef4444', secondary: '#dc2626' },
    { name: 'برتقالي', primary: '#f59e0b', secondary: '#d97706' },
    { name: 'وردي', primary: '#ec4899', secondary: '#db2777' },
    { name: 'أزرق', primary: '#3b82f6', secondary: '#2563eb' },
    { name: 'بنفسجي', primary: '#8b5cf6', secondary: '#7c3aed' }
  ]
};

// تجميد الكائن لمنع التعديل
Object.freeze(CONFIG);

