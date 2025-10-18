/**
 * المختبر البرمجي
 * تطوير: SEVEN_CODE7
 */

const Lab = {
  editor: null,
  currentLanguage: 'javascript',

  /**
   * عرض المختبر البرمجي
   */
  show() {
    const chatbox = document.getElementById('chatMessages');
    chatbox.innerHTML = this.getLabHTML();
    
    setTimeout(() => {
      this.initEditor();
      this.setupEventListeners();
    }, 100);
  },

  /**
   * الحصول على HTML المختبر
   */
  getLabHTML() {
    return `
      <div class="lab-container mode-specific-content">
        <div class="code-editor-section">
          <div class="code-editor-header">
            <h3><i class="fas fa-code"></i> محرر الكود</h3>
            <div class="tools">
              <select id="languageSelect" class="btn ghost">
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
              </select>
              <button class="btn ghost" onclick="Lab.runCode()">
                <i class="fas fa-play"></i> تشغيل
              </button>
              <button class="btn ghost" onclick="Lab.clearEditor()">
                <i class="fas fa-eraser"></i> مسح
              </button>
              <button class="btn ghost" onclick="Lab.saveCode()">
                <i class="fas fa-save"></i> حفظ
              </button>
            </div>
          </div>
          <textarea id="codeEditor"></textarea>
        </div>
        
        <div class="code-output-section">
          <div class="code-output-header">
            <h3><i class="fas fa-terminal"></i> النتيجة</h3>
            <button class="btn ghost" onclick="Lab.clearOutput()">
              <i class="fas fa-trash"></i> مسح
            </button>
          </div>
          <div id="codeOutput" class="code-output"></div>
        </div>
      </div>
      
      <div style="margin-top: 20px; padding: 15px; background: rgba(102, 126, 234, 0.1); border-radius: 12px;">
        <h4 style="margin-bottom: 10px;"><i class="fas fa-lightbulb"></i> أمثلة سريعة:</h4>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn ghost" onclick="Lab.loadExample('hello')">
            <i class="fas fa-hand-wave"></i> Hello World
          </button>
          <button class="btn ghost" onclick="Lab.loadExample('calculator')">
            <i class="fas fa-calculator"></i> آلة حاسبة
          </button>
          <button class="btn ghost" onclick="Lab.loadExample('loop')">
            <i class="fas fa-repeat"></i> حلقة تكرار
          </button>
          <button class="btn ghost" onclick="Lab.loadExample('array')">
            <i class="fas fa-list"></i> مصفوفة
          </button>
        </div>
      </div>
    `;
  },

  /**
   * تهيئة المحرر
   */
  initEditor() {
    const textarea = document.getElementById('codeEditor');
    
    if (typeof CodeMirror !== 'undefined') {
      this.editor = CodeMirror.fromTextArea(textarea, {
        mode: 'javascript',
        theme: Storage.getSettings().theme === 'dark' ? 'dracula' : 'default',
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 2,
        tabSize: 2,
        lineWrapping: true
      });
      
      this.editor.setSize('100%', '400px');
      this.loadExample('hello');
    } else {
      // Fallback إذا لم يتم تحميل CodeMirror
      textarea.style.width = '100%';
      textarea.style.height = '400px';
      textarea.style.fontFamily = 'monospace';
      textarea.style.fontSize = '14px';
      textarea.style.padding = '10px';
      textarea.value = this.getExampleCode('hello');
    }
  },

  /**
   * إعداد مستمعي الأحداث
   */
  setupEventListeners() {
    const languageSelect = document.getElementById('languageSelect');
    
    languageSelect.addEventListener('change', (e) => {
      this.changeLanguage(e.target.value);
    });
  },

  /**
   * تغيير اللغة
   */
  changeLanguage(language) {
    this.currentLanguage = language;
    
    if (this.editor) {
      const modes = {
        javascript: 'javascript',
        python: 'python',
        html: 'htmlmixed',
        css: 'css'
      };
      
      this.editor.setOption('mode', modes[language] || 'javascript');
    }
    
    this.clearOutput();
  },

  /**
   * تشغيل الكود
   */
  runCode() {
    const code = this.editor ? this.editor.getValue() : document.getElementById('codeEditor').value;
    
    if (!code.trim()) {
      Notification.show('يرجى كتابة كود أولاً', 'warning');
      return;
    }

    this.clearOutput();
    const output = document.getElementById('codeOutput');

    try {
      switch (this.currentLanguage) {
        case 'javascript':
          this.runJavaScript(code, output);
          break;
        case 'python':
          this.showPythonMessage(output);
          break;
        case 'html':
          this.runHTML(code, output);
          break;
        case 'css':
          this.showCSSMessage(output);
          break;
        default:
          output.textContent = 'اللغة غير مدعومة حالياً';
      }
    } catch (err) {
      output.innerHTML = `<span style="color: var(--error);">خطأ: ${err.message}</span>`;
    }
  },

  /**
   * تشغيل JavaScript
   */
  runJavaScript(code, output) {
    // إعادة تعريف console.log
    const logs = [];
    const originalLog = console.log;
    
    console.log = function(...args) {
      logs.push(args.map(arg => {
        if (typeof arg === 'object') {
          return JSON.stringify(arg, null, 2);
        }
        return String(arg);
      }).join(' '));
    };

    try {
      // تنفيذ الكود
      const result = eval(code);
      
      // عرض النتائج
      if (logs.length > 0) {
        output.textContent = logs.join('\n');
      } else if (result !== undefined) {
        output.textContent = String(result);
      } else {
        output.textContent = 'تم التنفيذ بنجاح (لا توجد مخرجات)';
      }
    } catch (err) {
      output.innerHTML = `<span style="color: var(--error);">خطأ: ${err.message}</span>`;
    } finally {
      console.log = originalLog;
    }
  },

  /**
   * تشغيل HTML
   */
  runHTML(code, output) {
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '300px';
    iframe.style.border = '1px solid var(--border)';
    iframe.style.borderRadius = '8px';
    iframe.style.backgroundColor = 'white';
    
    output.appendChild(iframe);
    
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(code);
    doc.close();
  },

  /**
   * رسالة Python
   */
  showPythonMessage(output) {
    output.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <i class="fas fa-info-circle" style="font-size: 48px; color: var(--info); margin-bottom: 15px;"></i>
        <p>تنفيذ Python غير مدعوم مباشرة في المتصفح.</p>
        <p>يمكنك استخدام الكود في بيئة Python محلية أو عبر الإنترنت.</p>
        <a href="https://repl.it/languages/python3" target="_blank" class="btn" style="margin-top: 15px;">
          <i class="fas fa-external-link-alt"></i> تجربة في Repl.it
        </a>
      </div>
    `;
  },

  /**
   * رسالة CSS
   */
  showCSSMessage(output) {
    output.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <i class="fas fa-info-circle" style="font-size: 48px; color: var(--info); margin-bottom: 15px;"></i>
        <p>لتجربة CSS، استخدم وضع HTML واكتب:</p>
        <pre style="background: rgba(0,0,0,0.05); padding: 10px; border-radius: 8px; margin-top: 10px; text-align: left;">
&lt;style&gt;
  /* كود CSS هنا */
&lt;/style&gt;

&lt;div class="test"&gt;
  نص تجريبي
&lt;/div&gt;
        </pre>
      </div>
    `;
  },

  /**
   * مسح المحرر
   */
  clearEditor() {
    if (this.editor) {
      this.editor.setValue('');
    } else {
      document.getElementById('codeEditor').value = '';
    }
    this.clearOutput();
  },

  /**
   * مسح المخرجات
   */
  clearOutput() {
    const output = document.getElementById('codeOutput');
    if (output) {
      output.innerHTML = '';
    }
  },

  /**
   * حفظ الكود
   */
  saveCode() {
    const code = this.editor ? this.editor.getValue() : document.getElementById('codeEditor').value;
    
    if (!code.trim()) {
      Notification.show('لا يوجد كود لحفظه', 'warning');
      return;
    }

    const filename = prompt('أدخل اسم الملف:', `code.${this.getFileExtension()}`);
    
    if (filename) {
      Utils.downloadFile(code, filename, 'text/plain');
      Notification.show('تم حفظ الملف بنجاح', 'success');
    }
  },

  /**
   * الحصول على امتداد الملف
   */
  getFileExtension() {
    const extensions = {
      javascript: 'js',
      python: 'py',
      html: 'html',
      css: 'css'
    };
    return extensions[this.currentLanguage] || 'txt';
  },

  /**
   * تحميل مثال
   */
  loadExample(exampleId) {
    const code = this.getExampleCode(exampleId);
    
    if (this.editor) {
      this.editor.setValue(code);
    } else {
      document.getElementById('codeEditor').value = code;
    }
    
    this.clearOutput();
  },

  /**
   * الحصول على كود المثال
   */
  getExampleCode(exampleId) {
    const examples = {
      hello: `// مرحباً بك في المختبر البرمجي!
console.log("مرحباً بالعالم!");
console.log("Hello World!");

// جرب تعديل الكود والضغط على تشغيل`,

      calculator: `// آلة حاسبة بسيطة
function calculator(num1, num2, operation) {
  switch(operation) {
    case '+':
      return num1 + num2;
    case '-':
      return num1 - num2;
    case '*':
      return num1 * num2;
    case '/':
      return num2 !== 0 ? num1 / num2 : 'خطأ: القسمة على صفر';
    default:
      return 'عملية غير صحيحة';
  }
}

// تجربة الآلة الحاسبة
console.log('10 + 5 =', calculator(10, 5, '+'));
console.log('10 - 5 =', calculator(10, 5, '-'));
console.log('10 * 5 =', calculator(10, 5, '*'));
console.log('10 / 5 =', calculator(10, 5, '/'));`,

      loop: `// حلقة تكرار - طباعة الأرقام من 1 إلى 10
console.log('الأرقام من 1 إلى 10:');
for (let i = 1; i <= 10; i++) {
  console.log(i);
}

// حلقة while - حساب مجموع الأرقام
let sum = 0;
let n = 1;
while (n <= 5) {
  sum += n;
  n++;
}
console.log('\\nمجموع الأرقام من 1 إلى 5:', sum);`,

      array: `// التعامل مع المصفوفات
const fruits = ['تفاح', 'موز', 'برتقال', 'عنب', 'فراولة'];

console.log('الفواكه:', fruits);
console.log('عدد الفواكه:', fruits.length);
console.log('أول فاكهة:', fruits[0]);
console.log('آخر فاكهة:', fruits[fruits.length - 1]);

// إضافة عنصر
fruits.push('مانجو');
console.log('\\nبعد إضافة المانجو:', fruits);

// البحث عن عنصر
const index = fruits.indexOf('برتقال');
console.log('\\nموقع البرتقال:', index);

// تصفية المصفوفة
const longNames = fruits.filter(fruit => fruit.length > 5);
console.log('\\nالفواكه ذات الأسماء الطويلة:', longNames);`
    };

    return examples[exampleId] || examples.hello;
  }
};

