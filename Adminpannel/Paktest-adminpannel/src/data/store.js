// ============================================================
// data/store.js — Reactive Store with localStorage + many-to-many
// ============================================================

// ── Default Data ──────────────────────────────────────────────

const defaultCategories = [
  { id: 'ppsc',  name: 'PPSC',    fullName: 'Punjab Public Service Commission',    description: 'Provincial level competitive exams for Punjab',   icon: '🏛️' },
  { id: 'fpsc',  name: 'FPSC',    fullName: 'Federal Public Service Commission',   description: 'Federal level competitive exams for Pakistan',    icon: '🇵🇰' },
  { id: 'nts',   name: 'NTS',     fullName: 'National Testing Service',            description: 'National level aptitude and academic testing',    icon: '📝' },
  { id: 'css',   name: 'CSS/PMS', fullName: 'Competitive Civil Services',          description: 'Elite civil service examinations',                icon: '⭐' },
  { id: 'spsc',  name: 'SPSC',    fullName: 'Sindh Public Service Commission',     description: 'Provincial level exams for Sindh',               icon: '🏢' },
  { id: 'kppsc', name: 'KPPSC',   fullName: 'KPK Public Service Commission',       description: 'Provincial level exams for KPK',                 icon: '🏔️' },
];

// positionIds: array of position IDs linked to this category
const defaultCategoryPositions = {
  ppsc:  ['pos1', 'pos2', 'pos3', 'pos7'],
  fpsc:  ['pos4', 'pos5', 'pos8'],
  nts:   ['pos6'],
  css:   ['pos4', 'pos5'],
  spsc:  ['pos7'],
  kppsc: ['pos3'],
};

const defaultPositions = [
  {
    id: 'pos1',
    title: 'Accountant',
    department: 'Finance Department',
    bpsLevel: 'BPS-16',
    openSeats: 42,
    categoryIds: ['ppsc'],
    description: 'Responsible for maintaining financial records, preparing budgets, and ensuring compliance with government financial regulations.',
    requirements: ['M.Com or MBA (Finance)', 'Age: 21–28 (+5 Years Relaxation)', 'Computer proficiency required', 'Punjab domicile'],
    salary: 'Rs. 45,000 – 75,000',
    lastDate: '2024-03-31',
    status: 'open',
  },
  {
    id: 'pos2',
    title: 'Lecturer Computer Science',
    department: 'Higher Education Department',
    bpsLevel: 'BPS-17',
    openSeats: 36,
    categoryIds: ['ppsc'],
    description: 'Teaching computer science subjects at government colleges across Punjab province.',
    requirements: ['MS/MPhil in Computer Science', '3+ years teaching experience', 'Age: 21–35', 'Punjab domicile'],
    salary: 'Rs. 55,000 – 90,000',
    lastDate: '2024-04-15',
    status: 'open',
  },
  {
    id: 'pos3',
    title: 'Assistant Sub-Inspector',
    department: 'Punjab Police / KPK Police',
    bpsLevel: 'BPS-11',
    openSeats: 150,
    categoryIds: ['ppsc', 'kppsc'],
    description: 'Law enforcement and security responsibilities at district level.',
    requirements: ["Bachelor's degree", 'Age: 18–25', 'Physical fitness test', 'Height: 5\'7"'],
    salary: 'Rs. 28,000 – 45,000',
    lastDate: '2024-05-01',
    status: 'open',
  },
  {
    id: 'pos4',
    title: 'Assistant Director (Admin)',
    department: 'Federal Investigation Agency',
    bpsLevel: 'BPS-17',
    openSeats: 15,
    categoryIds: ['fpsc', 'css'],
    description: 'Administrative and investigative role in FIA for federal-level matters.',
    requirements: ["Master's degree", 'Age: 25–35', 'Physical fitness test required', 'No criminal record'],
    salary: 'Rs. 60,000 – 95,000',
    lastDate: '2024-03-20',
    status: 'open',
  },
  {
    id: 'pos5',
    title: 'Income Tax Inspector',
    department: 'Federal Board of Revenue',
    bpsLevel: 'BPS-16',
    openSeats: 120,
    categoryIds: ['fpsc', 'css'],
    description: 'Tax collection, audit, and compliance enforcement under FBR.',
    requirements: ['Commerce/Finance/Law degree', 'Age: 18–30', 'Computer literate', 'Clean financial record'],
    salary: 'Rs. 50,000 – 80,000',
    lastDate: '2024-04-30',
    status: 'open',
  },
  {
    id: 'pos6',
    title: 'Junior Clerk',
    department: 'National Testing Service HQ',
    bpsLevel: 'BPS-11',
    openSeats: 200,
    categoryIds: ['nts'],
    description: 'Clerical and administrative support role in NTS offices nationwide.',
    requirements: ['Intermediate (F.A/F.Sc)', 'Computer skills (MS Office)', 'Age: 18–28', 'Typing speed 30 WPM'],
    salary: 'Rs. 22,000 – 35,000',
    lastDate: '2024-06-01',
    status: 'open',
  },
  {
    id: 'pos7',
    title: 'Medical Officer',
    department: 'Primary & Secondary Health Department',
    bpsLevel: 'BPS-17',
    openSeats: 88,
    categoryIds: ['ppsc', 'spsc'],
    description: 'Providing medical services at government hospitals and basic health units.',
    requirements: ['MBBS degree', 'PMDC registration mandatory', '1+ year house job experience', 'Age: 25–35'],
    salary: 'Rs. 65,000 – 100,000',
    lastDate: '2024-04-10',
    status: 'open',
  },
  {
    id: 'pos8',
    title: 'Section Officer',
    department: 'Cabinet Division',
    bpsLevel: 'BPS-17',
    openSeats: 25,
    categoryIds: ['fpsc'],
    description: 'Senior administrative role in federal ministries and divisions.',
    requirements: ["Bachelor's degree (16 years education)", 'CSS Exam qualification', 'Age: 21–30', 'Good communication skills'],
    salary: 'Rs. 60,000 – 95,000',
    lastDate: '2024-05-15',
    status: 'open',
  },
];

const defaultPapers = [
  { id: 'paper1', positionId: 'pos2', title: 'PPSC Lecturer CS 2023',            year: '2023', difficulty: 'Moderate', duration: 90,  totalMcqs: 100, type: 'solved',   description: 'Complete solved paper with detailed explanations' },
  { id: 'paper2', positionId: 'pos2', title: 'PPSC Lecturer CS 2022',            year: '2022', difficulty: 'Hard',     duration: 90,  totalMcqs: 100, type: 'solved',   description: 'Fully solved with answer keys' },
  { id: 'paper3', positionId: 'pos4', title: 'FIA Assistant Director Mock 2024', year: '2024', difficulty: 'Hard',     duration: 120, totalMcqs: 120, type: 'unsolved', description: 'Timed mock exam for FIA AD' },
  { id: 'paper4', positionId: 'pos7', title: 'Medical Officer Practice 2023',    year: '2023', difficulty: 'Moderate', duration: 90,  totalMcqs: 100, type: 'unsolved', description: 'Practice test for medical officers' },
  { id: 'paper5', positionId: 'pos4', title: 'CSS General Knowledge 2022',       year: '2022', difficulty: 'Expert',   duration: 180, totalMcqs: 150, type: 'solved',   description: 'CSS GK paper with detailed explanations' },
  { id: 'paper6', positionId: 'pos6', title: 'NTS Junior Clerk Past Paper 2023', year: '2023', difficulty: 'Easy',     duration: 60,  totalMcqs: 80,  type: 'solved',   description: 'Past paper for NTS Junior Clerk' },
  { id: 'paper7', positionId: 'pos5', title: 'FBR Inspector Sample Paper 2024',  year: '2024', difficulty: 'Moderate', duration: 90,  totalMcqs: 100, type: 'unsolved', description: 'Sample paper for FBR Income Tax Inspector' },
  { id: 'paper8', positionId: 'pos1', title: 'Accountant Past Paper 2022',       year: '2022', difficulty: 'Moderate', duration: 90,  totalMcqs: 100, type: 'solved',   description: 'Solved paper 2022 batch' },
];

// ── Mock Tests (Unsolved Papers) ─────────────────────────────
const defaultMockTests = [
  { id: 'mock1', positionId: 'pos1', title: 'PPSC Accountant Mock Test 2024', year: '2024', difficulty: 'Moderate', duration: 90, totalMcqs: 100, attempts: 0, active: true, description: 'Practice mock test for Accountant position' },
  { id: 'mock2', positionId: 'pos2', title: 'PPSC Lecturer CS Mock 2024', year: '2024', difficulty: 'Hard', duration: 90, totalMcqs: 100, attempts: 0, active: true, description: 'Mock test for Lecturer Computer Science' },
  { id: 'mock3', positionId: 'pos4', title: 'FIA Assistant Director Mock 2024', year: '2024', difficulty: 'Hard', duration: 120, totalMcqs: 120, attempts: 0, active: true, description: 'Full mock test for FIA Assistant Director' },
];

const defaultBooks = [
  { id: 'book1', subjectId: 'sub1', title: 'English Grammar for Competitive Exams', author: 'Dr. Tahir-ul-Qadri', pages: 320, totalMcqs: 450, description: 'Comprehensive English guide for PPSC/FPSC' },
  { id: 'book2', subjectId: 'sub2', title: 'Computer Science Fundamentals',      author: 'Prof. Ahmad Khan',   pages: 280, totalMcqs: 350, description: 'Basic to advanced CS concepts' },
  { id: 'book3', subjectId: 'sub3', title: 'Accounting Principles',                author: 'Dr. A. Malik',       pages: 350, totalMcqs: 400, description: 'Complete accounting reference for competitive exams' },
];

// ── Subjects State ────────────────────────────────────────────────────
const defaultSubjects = [
  { 
    id: 'sub1', 
    name: 'English', 
    code: 'ENG-101', 
    totalMarks: 100, 
    description: 'English language and literature',
    positionId: 'pos2' 
  },
  { 
    id: 'sub2', 
    name: 'Computer Science', 
    code: 'CS-101', 
    totalMarks: 100, 
    description: 'Fundamentals of computer science',
    positionId: 'pos2' 
  },
  { 
    id: 'sub3', 
    name: 'Accounting', 
    code: 'ACC-101', 
    totalMarks: 100, 
    description: 'Basic accounting principles',
    positionId: 'pos1' 
  }
];

// ── Chapters State ──────────────────────────────────────────────────
const defaultChapters = [
  { 
    id: 'ch1', 
    name: 'Parts of Speech', 
    chapterNumber: '1', 
    totalMcqs: 50, 
    description: 'Introduction to parts of speech',
    bookId: 'book1' 
  },
  { 
    id: 'ch2', 
    name: 'Tenses', 
    chapterNumber: '2', 
    totalMcqs: 60, 
    description: 'English tenses explained',
    bookId: 'book1' 
  },
  { 
    id: 'ch3', 
    name: 'Programming Basics', 
    chapterNumber: '1', 
    totalMcqs: 40, 
    description: 'Introduction to programming',
    bookId: 'book2' 
  }
];

// ── MCQs State ──────────────────────────────────────────────────────
const defaultMcqs = [
  { 
    id: 'mcq1', 
    question: 'What is the capital of Pakistan?', 
    optionA: 'Karachi', 
    optionB: 'Lahore', 
    optionC: 'Islamabad', 
    optionD: 'Rawalpindi', 
    correctAnswer: 'C',
    explanation: 'Islamabad is the capital city of Pakistan.',
    chapterId: 'ch1',
    paperId: 'paper1',
    difficulty: 'Easy',
    topic: 'General Knowledge'
  },
  { 
    id: 'mcq2', 
    question: 'What is the largest planet in our solar system?', 
    optionA: 'Earth', 
    optionB: 'Saturn', 
    optionC: 'Jupiter', 
    optionD: 'Neptune', 
    correctAnswer: 'C',
    explanation: 'Jupiter is the largest planet in our solar system.',
    chapterId: 'ch1',
    paperId: 'paper1',
    difficulty: 'Easy',
    topic: 'Science'
  },
  { 
    id: 'mcq3', 
    question: 'Which data structure uses LIFO principle?', 
    optionA: 'Queue', 
    optionB: 'Stack', 
    optionC: 'Array', 
    optionD: 'Linked List', 
    correctAnswer: 'B',
    explanation: 'Stack follows Last-In-First-Out (LIFO).',
    chapterId: 'ch3',
    paperId: 'paper2',
    difficulty: 'Medium',
    topic: 'Data Structures'
  }
];

const defaultTestPatterns = [
  { id: 'tp1', positionId: 'pos2', sections: [{ name: 'Computer Science', percentage: 40, mcqs: 40 }, { name: 'General Knowledge', percentage: 20, mcqs: 20 }, { name: 'English', percentage: 20, mcqs: 20 }, { name: 'Pakistan Studies', percentage: 20, mcqs: 20 }], totalMcqs: 100, timeLimit: 90, passingMarks: 40 },
  { id: 'tp2', positionId: 'pos4', sections: [{ name: 'Administration', percentage: 35, mcqs: 35 }, { name: 'Law', percentage: 25, mcqs: 25 }, { name: 'General Knowledge', percentage: 20, mcqs: 20 }, { name: 'English', percentage: 20, mcqs: 20 }], totalMcqs: 100, timeLimit: 90, passingMarks: 40 },
  { id: 'tp3', positionId: 'pos7', sections: [{ name: 'Medical Sciences', percentage: 50, mcqs: 50 }, { name: 'Anatomy', percentage: 20, mcqs: 20 }, { name: 'Pharmacology', percentage: 20, mcqs: 20 }, { name: 'General Knowledge', percentage: 10, mcqs: 10 }], totalMcqs: 100, timeLimit: 90, passingMarks: 45 },
  { id: 'tp4', positionId: 'pos1', sections: [{ name: 'Accounting', percentage: 40, mcqs: 40 }, { name: 'Finance', percentage: 30, mcqs: 30 }, { name: 'General Knowledge', percentage: 20, mcqs: 20 }, { name: 'English', percentage: 10, mcqs: 10 }], totalMcqs: 100, timeLimit: 90, passingMarks: 40 },
];

// ── localStorage helpers ──────────────────────────────────────
const load = (key, fallback) => {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
  catch { return fallback; }
};
const save = (key, data) => { try { localStorage.setItem(key, JSON.stringify(data)); } catch {} };

// ── Live state ────────────────────────────────────────────────
let _categories         = load('pak_categories',    defaultCategories);
let _categoryPositions  = load('pak_cat_positions', defaultCategoryPositions);
let _positions          = load('pak_positions',     defaultPositions);
let _papers             = load('pak_papers',        defaultPapers);
let _mockTests          = load('pak_mock_tests',    defaultMockTests);
let _books              = load('pak_books',         defaultBooks);
let _subjects           = load('pak_subjects',      defaultSubjects);
let _chapters           = load('pak_chapters',      defaultChapters);
let _mcqs               = load('pak_mcqs',          defaultMcqs);
let _testPatterns       = load('pak_patterns',      defaultTestPatterns);
let _nextId             = load('pak_nextId',        { cat: 300, pos: 300, paper: 300, book: 300, mcq: 300, pattern: 300, mock: 300, subject: 300, chapter: 300 });

// ── Pub/sub ───────────────────────────────────────────────────
let _listeners = [];
export const subscribe = (fn) => { _listeners.push(fn); return () => { _listeners = _listeners.filter(l => l !== fn); }; };
const notify = () => _listeners.forEach(fn => fn());

// ── Getters ───────────────────────────────────────────────────
export const getCategories        = () => _categories;
export const getPositions         = () => _positions;
export const getCategoryPositions = () => _categoryPositions;
export const getPapers            = () => _papers;
export const getMockTests         = () => _mockTests;
export const getBooks             = () => _books;
export const getSubjects          = () => _subjects;
export const getChapters          = () => _chapters;
export const getMcqs              = () => _mcqs;
export const getTestPatterns      = () => _testPatterns;

// Legacy exports for backward compat
export let categories   = _categories;
export let jobs         = _positions;
export let papers       = _papers;
export let mockTests    = _mockTests;
export let books        = _books;
export let subjects     = _subjects;
export let chapters     = _chapters;
export let mcqs         = _mcqs;
export let testPatterns = _testPatterns;

const syncExports = () => {
  categories = _categories; jobs = _positions;
  papers = _papers; mockTests = _mockTests;
  books = _books; subjects = _subjects;
  chapters = _chapters; mcqs = _mcqs; 
  testPatterns = _testPatterns;
};

// ── Categories ────────────────────────────────────────────────
export const addCategory = (data) => {
  const item = { ...data, id: `cat_${_nextId.cat++}` };
  _categories = [..._categories, item];
  _categoryPositions = { ..._categoryPositions, [item.id]: data.positionIds || [] };
  save('pak_categories', _categories);
  save('pak_cat_positions', _categoryPositions);
  save('pak_nextId', _nextId);
  syncExports(); notify(); return item;
};
export const updateCategory = (id, data) => {
  _categories = _categories.map(c => c.id === id ? { ...c, ...data } : c);
  if (data.positionIds !== undefined) {
    _categoryPositions = { ..._categoryPositions, [id]: data.positionIds };
    save('pak_cat_positions', _categoryPositions);
  }
  save('pak_categories', _categories); syncExports(); notify();
};
export const deleteCategory = (id) => {
  _categories = _categories.filter(c => c.id !== id);
  const { [id]: _, ...rest } = _categoryPositions;
  _categoryPositions = rest;
  save('pak_categories', _categories);
  save('pak_cat_positions', _categoryPositions);
  syncExports(); notify();
};

// Link/unlink positions from a category
export const setCategoryPositions = (catId, positionIds) => {
  _categoryPositions = { ..._categoryPositions, [catId]: positionIds };
  _positions = _positions.map(p => ({
    ...p,
    categoryIds: positionIds.includes(p.id)
      ? [...new Set([...(p.categoryIds || []), catId])]
      : (p.categoryIds || []).filter(c => c !== catId)
  }));
  save('pak_cat_positions', _categoryPositions);
  save('pak_positions', _positions);
  syncExports(); notify();
};

export const getPositionsForCategory = (catId) => {
  const ids = _categoryPositions[catId] || [];
  return _positions.filter(p => ids.includes(p.id));
};

// ── Positions ─────────────────────────────────────────────────
export const addPosition = (data) => {
  const item = { ...data, id: `pos_${_nextId.pos++}`, categoryIds: data.categoryIds || [] };
  _positions = [..._positions, item];
  item.categoryIds.forEach(catId => {
    _categoryPositions[catId] = [...new Set([...(_categoryPositions[catId] || []), item.id])];
  });
  save('pak_positions', _positions);
  save('pak_cat_positions', _categoryPositions);
  save('pak_nextId', _nextId);
  syncExports(); notify(); return item;
};
export const updatePosition = (id, data) => {
  const old = _positions.find(p => p.id === id);
  _positions = _positions.map(p => p.id === id ? { ...p, ...data } : p);
  if (data.categoryIds) {
    const allCatIds = new Set([...(old?.categoryIds || []), ...data.categoryIds]);
    allCatIds.forEach(catId => {
      const linked = _positions.find(p => p.id === id)?.categoryIds?.includes(catId);
      _categoryPositions[catId] = linked
        ? [...new Set([...(_categoryPositions[catId] || []), id])]
        : (_categoryPositions[catId] || []).filter(pid => pid !== id);
    });
    save('pak_cat_positions', _categoryPositions);
  }
  save('pak_positions', _positions); syncExports(); notify();
};
export const deletePosition = (id) => {
  _positions = _positions.filter(p => p.id !== id);
  Object.keys(_categoryPositions).forEach(catId => {
    _categoryPositions[catId] = _categoryPositions[catId].filter(pid => pid !== id);
  });
  const subjectsToDelete = _subjects.filter(s => s.positionId === id);
  subjectsToDelete.forEach(subject => {
    const booksToDelete = _books.filter(b => b.subjectId === subject.id);
    booksToDelete.forEach(book => {
      const chaptersToDelete = _chapters.filter(c => c.bookId === book.id);
      chaptersToDelete.forEach(chapter => {
        _mcqs = _mcqs.filter(m => m.chapterId !== chapter.id);
      });
      _chapters = _chapters.filter(c => c.bookId !== book.id);
    });
    _books = _books.filter(b => b.subjectId !== subject.id);
  });
  _subjects = _subjects.filter(s => s.positionId !== id);
  
  save('pak_positions', _positions);
  save('pak_cat_positions', _categoryPositions);
  save('pak_subjects', _subjects);
  save('pak_books', _books);
  save('pak_chapters', _chapters);
  save('pak_mcqs', _mcqs);
  syncExports(); notify();
};

// Legacy job aliases
export const addJob    = addPosition;
export const updateJob = updatePosition;
export const deleteJob = deletePosition;
export const toggleJobStatus = (id) => {
  _positions = _positions.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p);
  save('pak_positions', _positions); syncExports(); notify();
};

// ── Subjects ──────────────────────────────────────────────────
export const addSubject = (data) => {
  const item = { ...data, id: `sub_${_nextId.subject++}` };
  _subjects = [..._subjects, item];
  save('pak_subjects', _subjects);
  save('pak_nextId', _nextId);
  syncExports(); notify(); return item;
};

export const updateSubject = (id, data) => {
  _subjects = _subjects.map(s => s.id === id ? { ...s, ...data } : s);
  save('pak_subjects', _subjects);
  syncExports(); notify();
};

export const deleteSubject = (id) => {
  const booksToDelete = _books.filter(b => b.subjectId === id);
  booksToDelete.forEach(book => {
    const chaptersToDelete = _chapters.filter(c => c.bookId === book.id);
    chaptersToDelete.forEach(chapter => {
      _mcqs = _mcqs.filter(m => m.chapterId !== chapter.id);
    });
    _chapters = _chapters.filter(c => c.bookId !== book.id);
  });
  _books = _books.filter(b => b.subjectId !== id);
  _subjects = _subjects.filter(s => s.id !== id);
  
  save('pak_subjects', _subjects);
  save('pak_books', _books);
  save('pak_chapters', _chapters);
  save('pak_mcqs', _mcqs);
  syncExports(); notify();
};

export const getSubjectsForPosition = (positionId) => {
  return _subjects.filter(s => s.positionId === positionId);
};

// ── Books ─────────────────────────────────────────────────────
export const addBook = (data) => {
  const item = { ...data, id: `book_${_nextId.book++}` };
  _books = [..._books, item];
  save('pak_books', _books);
  save('pak_nextId', _nextId);
  syncExports(); notify(); return item;
};

export const updateBook = (id, data) => {
  _books = _books.map(b => b.id === id ? { ...b, ...data } : b);
  save('pak_books', _books);
  syncExports(); notify();
};

export const deleteBook = (id) => {
  const chaptersToDelete = _chapters.filter(c => c.bookId === id);
  chaptersToDelete.forEach(chapter => {
    _mcqs = _mcqs.filter(m => m.chapterId !== chapter.id);
  });
  _chapters = _chapters.filter(c => c.bookId !== id);
  _books = _books.filter(b => b.id !== id);
  
  save('pak_books', _books);
  save('pak_chapters', _chapters);
  save('pak_mcqs', _mcqs);
  syncExports(); notify();
};

export const getBooksForSubject = (subjectId) => {
  return _books.filter(b => b.subjectId === subjectId);
};

// Legacy function for backward compatibility - returns books by position
export const getBooksForPosition = (positionId) => {
  return _books.filter(b => b.positionId === positionId);
};

// ── Chapters ─────────────────────────────────────────────────
export const addChapter = (data) => {
  const item = { ...data, id: `ch_${_nextId.chapter++}` };
  _chapters = [..._chapters, item];
  save('pak_chapters', _chapters);
  save('pak_nextId', _nextId);
  syncExports(); notify(); return item;
};

export const updateChapter = (id, data) => {
  _chapters = _chapters.map(c => c.id === id ? { ...c, ...data } : c);
  save('pak_chapters', _chapters);
  syncExports(); notify();
};

export const deleteChapter = (id) => {
  _mcqs = _mcqs.filter(m => m.chapterId !== id);
  _chapters = _chapters.filter(c => c.id !== id);
  save('pak_chapters', _chapters);
  save('pak_mcqs', _mcqs);
  syncExports(); notify();
};

export const getChaptersForBook = (bookId) => {
  return _chapters.filter(c => c.bookId === bookId);
};

// ── MCQs ──────────────────────────────────────────────────────
export const addMcq = (data) => {
  const item = { ...data, id: `mcq_${_nextId.mcq++}` };
  _mcqs = [..._mcqs, item];
  save('pak_mcqs', _mcqs);
  save('pak_nextId', _nextId);
  syncExports(); notify(); return item;
};

export const updateMcq = (id, data) => {
  _mcqs = _mcqs.map(m => m.id === id ? { ...m, ...data } : m);
  save('pak_mcqs', _mcqs);
  syncExports(); notify();
};

export const deleteMcq = (id) => {
  _mcqs = _mcqs.filter(m => m.id !== id);
  save('pak_mcqs', _mcqs);
  syncExports(); notify();
};

export const getMcqsForChapter = (chapterId) => {
  return _mcqs.filter(m => m.chapterId === chapterId);
};

export const getMcqsForPaper = (paperId) => {
  return _mcqs.filter(m => m.paperId === paperId);
};

// ── Papers (Solved) ───────────────────────────────────────────
export const addPaper = (data) => {
  const item = { ...data, id: `paper_${_nextId.paper++}` };
  _papers = [..._papers, item]; 
  save('pak_papers', _papers); 
  save('pak_nextId', _nextId); 
  syncExports(); notify(); 
  return item;
};

export const updatePaper = (id, data) => {
  _papers = _papers.map(p => p.id === id ? { ...p, ...data } : p); 
  save('pak_papers', _papers); 
  syncExports(); notify();
};

export const deletePaper = (id) => {
  _papers = _papers.filter(p => p.id !== id); 
  save('pak_papers', _papers); 
  syncExports(); notify();
};

export const getPapersForPosition = (positionId) => {
  return _papers.filter(p => p.positionId === positionId);
};

// ── Mock Tests (Unsolved Papers) ─────────────────────────────
export const addMockTest = (data) => {
  const item = { ...data, id: `mock_${_nextId.mock++}` };
  _mockTests = [..._mockTests, item]; 
  save('pak_mock_tests', _mockTests); 
  save('pak_nextId', _nextId); 
  syncExports(); notify(); 
  return item;
};

export const updateMockTest = (id, data) => {
  _mockTests = _mockTests.map(m => m.id === id ? { ...m, ...data } : m); 
  save('pak_mock_tests', _mockTests); 
  syncExports(); notify();
};

export const deleteMockTest = (id) => {
  _mockTests = _mockTests.filter(m => m.id !== id); 
  save('pak_mock_tests', _mockTests); 
  syncExports(); notify();
};

export const getMockTestsForPosition = (positionId) => {
  return _mockTests.filter(m => m.positionId === positionId);
};

// ── Test Patterns ─────────────────────────────────────────────
export const addPattern = (data) => {
  const item = { ...data, id: `tp_${_nextId.pattern++}` };
  _testPatterns = [..._testPatterns, item]; 
  save('pak_patterns', _testPatterns); 
  save('pak_nextId', _nextId); 
  syncExports(); notify(); 
  return item;
};

export const updatePattern = (id, data) => {
  _testPatterns = _testPatterns.map(p => p.id === id ? { ...p, ...data } : p); 
  save('pak_patterns', _testPatterns); 
  syncExports(); notify();
};

export const deletePattern = (id) => {
  _testPatterns = _testPatterns.filter(p => p.id !== id); 
  save('pak_patterns', _testPatterns); 
  syncExports(); notify();
};

export const getPatternForPosition = (positionId) => {
  return _testPatterns.find(p => p.positionId === positionId);
};

// ── Reset ─────────────────────────────────────────────────────
export const resetAllData = () => {
  _categories = defaultCategories; 
  _categoryPositions = defaultCategoryPositions;
  _positions = defaultPositions; 
  _papers = defaultPapers;
  _mockTests = defaultMockTests; 
  _books = defaultBooks; 
  _subjects = defaultSubjects;
  _chapters = defaultChapters;
  _mcqs = defaultMcqs; 
  _testPatterns = defaultTestPatterns;
  _nextId = { cat: 300, pos: 300, paper: 300, book: 300, mcq: 300, pattern: 300, mock: 300, subject: 300, chapter: 300 };
  ['pak_categories','pak_cat_positions','pak_positions','pak_papers','pak_mock_tests','pak_books','pak_subjects','pak_chapters','pak_mcqs','pak_patterns','pak_nextId']
    .forEach(k => localStorage.removeItem(k));
  syncExports(); notify();
};

// ── useStore Hook ─────────────────────────────────────────────
export const useStore = {
  get categories() { return _categories; },
  get positions() { return _positions; },
  get categoryPositions() { return _categoryPositions; },
  get papers() { return _papers; },
  get mockTests() { return _mockTests; },
  get books() { return _books; },
  get subjects() { return _subjects; },
  get chapters() { return _chapters; },
  get mcqs() { return _mcqs; },
  get testPatterns() { return _testPatterns; },
  subscribe: subscribe,
};

// ── Default export ────────────────────────────────────────────
export default {
  getCategories,
  getPositions,
  getCategoryPositions,
  getPapers,
  getMockTests,
  getBooks,
  getSubjects,
  getChapters,
  getMcqs,
  getTestPatterns,
  addCategory,
  updateCategory,
  deleteCategory,
  addPosition,
  updatePosition,
  deletePosition,
  addSubject,
  updateSubject,
  deleteSubject,
  addBook,
  updateBook,
  deleteBook,
  addChapter,
  updateChapter,
  deleteChapter,
  addMcq,
  updateMcq,
  deleteMcq,
  addPaper,
  updatePaper,
  deletePaper,
  addMockTest,
  updateMockTest,
  deleteMockTest,
  addPattern,
  updatePattern,
  deletePattern,
  setCategoryPositions,
  getPositionsForCategory,
  getSubjectsForPosition,
  getBooksForSubject,
  getChaptersForBook,
  getMcqsForChapter,
  getMcqsForPaper,
  getPapersForPosition,
  getMockTestsForPosition,
  getBooksForPosition,
  getPatternForPosition,
  resetAllData,
  subscribe,
  useStore,
};