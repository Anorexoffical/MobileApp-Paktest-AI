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
  { id: 'book1', positionId: 'pos2', title: 'Computer Science for Competitive Exams', author: 'Dr. Tahir-ul-Qadri', pages: 320, totalMcqs: 450, description: 'Comprehensive CS guide for PPSC/FPSC' },
  { id: 'book2', positionId: 'pos2', title: 'Programming Fundamentals',               author: 'Prof. Ahmad Khan',   pages: 280, totalMcqs: 350, description: 'Basic to advanced programming concepts' },
  { id: 'book3', positionId: 'pos4', title: 'Administration & Management',            author: 'Dr. A. Malik',       pages: 350, totalMcqs: 400, description: 'Management principles for FIA/CSS' },
  { id: 'book4', positionId: 'pos7', title: 'Medical Sciences Complete Guide',        author: 'Dr. S. Ahmed',       pages: 400, totalMcqs: 500, description: 'Complete medical sciences reference' },
  { id: 'book5', positionId: 'pos4', title: 'CSS Pakistan Affairs',                   author: 'Ikram Rabbani',      pages: 600, totalMcqs: 700, description: 'Pakistan Affairs for CSS/PMS' },
  { id: 'book6', positionId: 'pos5', title: 'Income Tax & Finance Laws Pakistan',     author: 'Prof. Zubair',       pages: 420, totalMcqs: 380, description: 'Tax laws and finance for FBR exams' },
  { id: 'book7', positionId: 'pos6', title: 'NTS GAT General Prep Guide',             author: 'NTS Official',       pages: 180, totalMcqs: 300, description: 'Official NTS preparation guide' },
  { id: 'book8', positionId: 'pos1', title: 'Accounting & Finance for Pakistan',      author: 'Prof. M. Irfan',     pages: 360, totalMcqs: 420, description: 'Complete accounting guide' },
];

const defaultMcqs = [
  { id: 'mcq1',  paperId: 'paper1', bookId: 'book1', question: 'What is the capital of Pakistan?',                                    options: ['Lahore','Karachi','Islamabad','Peshawar'],                       correctAnswer: 2, explanation: 'Islamabad became the capital in 1966.',              difficulty: 'Easy',   topic: 'General Knowledge' },
  { id: 'mcq2',  paperId: 'paper1', bookId: 'book1', question: 'Which data structure uses LIFO principle?',                           options: ['Queue','Stack','Array','Linked List'],                           correctAnswer: 1, explanation: 'Stack follows Last-In-First-Out (LIFO).',             difficulty: 'Medium', topic: 'Data Structures' },
  { id: 'mcq3',  paperId: 'paper2', bookId: 'book2', question: 'What is the time complexity of binary search?',                      options: ['O(n)','O(log n)','O(n²)','O(1)'],                               correctAnswer: 1, explanation: 'Binary search halves the search space each step.',    difficulty: 'Medium', topic: 'Algorithms' },
  { id: 'mcq4',  paperId: 'paper3', bookId: 'book3', question: 'What is the primary role of FIA?',                                   options: ['Traffic Management','Federal Investigation','Tax Collection','Education'], correctAnswer: 1, explanation: 'FIA handles federal-level investigations.',  difficulty: 'Easy',   topic: 'Law Enforcement' },
  { id: 'mcq5',  paperId: 'paper4', bookId: 'book4', question: 'Which organ filters blood in the human body?',                       options: ['Liver','Kidney','Heart','Lungs'],                                correctAnswer: 1, explanation: 'Kidneys filter blood and remove waste.',             difficulty: 'Easy',   topic: 'Anatomy' },
  { id: 'mcq6',  paperId: 'paper5', bookId: 'book5', question: 'When was Pakistan established?',                                     options: ['1945','1946','1947','1948'],                                     correctAnswer: 2, explanation: 'Pakistan was created on 14 August 1947.',            difficulty: 'Easy',   topic: 'Pakistan Studies' },
  { id: 'mcq7',  paperId: 'paper1', bookId: 'book2', question: 'What does OOP stand for?',                                           options: ['Open Operational Program','Object Oriented Programming','Ordered Output Process','None'], correctAnswer: 1, explanation: 'OOP is a programming paradigm.', difficulty: 'Easy', topic: 'Programming' },
  { id: 'mcq8',  paperId: 'paper2', bookId: 'book1', question: 'Which sorting algorithm has the best average-case time complexity?', options: ['Bubble Sort','Selection Sort','Merge Sort','Insertion Sort'],    correctAnswer: 2, explanation: 'Merge Sort has O(n log n) average complexity.',        difficulty: 'Hard',   topic: 'Algorithms' },
  { id: 'mcq9',  paperId: 'paper8', bookId: 'book8', question: 'What is the accounting equation?',                                   options: ['Assets = Liabilities','Assets = Liabilities + Equity','Revenue - Expenses = Profit','None'], correctAnswer: 1, explanation: 'The fundamental accounting equation.', difficulty: 'Easy', topic: 'Accounting' },
  { id: 'mcq10', paperId: 'paper6', bookId: 'book7', question: 'What does NTS stand for?',                                           options: ['National Test Service','National Testing Service','New Testing System','None'], correctAnswer: 1, explanation: 'NTS stands for National Testing Service.', difficulty: 'Easy', topic: 'General Knowledge' },
  { id: 'mcq11', paperId: 'paper1', bookId: 'book1', question: 'Which protocol is used for sending emails?',                         options: ['HTTP','FTP','SMTP','SSH'],                                       correctAnswer: 2, explanation: 'SMTP (Simple Mail Transfer Protocol) is used for email.',difficulty: 'Medium', topic: 'Networking' },
  { id: 'mcq12', paperId: 'paper7', bookId: 'book6', question: 'What is the full form of FBR?',                                      options: ['Federal Business Registry','Federal Board of Revenue','Finance Bureau of Revenue','None'], correctAnswer: 1, explanation: 'FBR = Federal Board of Revenue.', difficulty: 'Easy', topic: 'Finance' },
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
let _mcqs               = load('pak_mcqs',          defaultMcqs);
let _testPatterns       = load('pak_patterns',      defaultTestPatterns);
let _nextId             = load('pak_nextId',        { cat: 300, pos: 300, paper: 300, book: 300, mcq: 300, pattern: 300, mock: 300 });

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
export const getMcqs              = () => _mcqs;
export const getTestPatterns      = () => _testPatterns;

// Legacy exports for backward compat
export let categories   = _categories;
export let jobs         = _positions;
export let papers       = _papers;
export let mockTests    = _mockTests;
export let books        = _books;
export let mcqs         = _mcqs;
export let testPatterns = _testPatterns;

const syncExports = () => {
  categories = _categories; jobs = _positions;
  papers = _papers; mockTests = _mockTests;
  books = _books; mcqs = _mcqs; testPatterns = _testPatterns;
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
  // Also update categoryIds on each position
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
  // link back into categoryPositions
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
  // re-sync categoryPositions if categoryIds changed
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
  save('pak_positions', _positions);
  save('pak_cat_positions', _categoryPositions);
  syncExports(); notify();
};

// Legacy job aliases
export const addJob    = addPosition;
export const updateJob = updatePosition;
export const deleteJob = deletePosition;

// ── Papers (Solved) ───────────────────────────────────────────
export const addPaper = (data) => {
  const item = { ...data, id: `paper_${_nextId.paper++}` };
  _papers = [..._papers, item]; save('pak_papers', _papers); save('pak_nextId', _nextId); syncExports(); notify(); return item;
};
export const updatePaper = (id, data) => {
  _papers = _papers.map(p => p.id === id ? { ...p, ...data } : p); save('pak_papers', _papers); syncExports(); notify();
};
export const deletePaper = (id) => {
  _papers = _papers.filter(p => p.id !== id); save('pak_papers', _papers); syncExports(); notify();
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

// ── Books ─────────────────────────────────────────────────────
export const addBook = (data) => {
  const item = { ...data, id: `book_${_nextId.book++}` };
  _books = [..._books, item]; save('pak_books', _books); save('pak_nextId', _nextId); syncExports(); notify(); return item;
};
export const updateBook = (id, data) => {
  _books = _books.map(b => b.id === id ? { ...b, ...data } : b); save('pak_books', _books); syncExports(); notify();
};
export const deleteBook = (id) => {
  _books = _books.filter(b => b.id !== id); save('pak_books', _books); syncExports(); notify();
};

// ── MCQs ──────────────────────────────────────────────────────
export const addMcq = (data) => {
  const item = { ...data, id: `mcq_${_nextId.mcq++}` };
  _mcqs = [..._mcqs, item]; save('pak_mcqs', _mcqs); save('pak_nextId', _nextId); syncExports(); notify(); return item;
};
export const updateMcq = (id, data) => {
  _mcqs = _mcqs.map(m => m.id === id ? { ...m, ...data } : m); save('pak_mcqs', _mcqs); syncExports(); notify();
};
export const deleteMcq = (id) => {
  _mcqs = _mcqs.filter(m => m.id !== id); save('pak_mcqs', _mcqs); syncExports(); notify();
};

// ── Test Patterns ─────────────────────────────────────────────
export const addPattern = (data) => {
  const item = { ...data, id: `tp_${_nextId.pattern++}` };
  _testPatterns = [..._testPatterns, item]; save('pak_patterns', _testPatterns); save('pak_nextId', _nextId); syncExports(); notify(); return item;
};
export const updatePattern = (id, data) => {
  _testPatterns = _testPatterns.map(p => p.id === id ? { ...p, ...data } : p); save('pak_patterns', _testPatterns); syncExports(); notify();
};
export const deletePattern = (id) => {
  _testPatterns = _testPatterns.filter(p => p.id !== id); save('pak_patterns', _testPatterns); syncExports(); notify();
};

// ── Reset ─────────────────────────────────────────────────────
export const resetAllData = () => {
  _categories = defaultCategories; _categoryPositions = defaultCategoryPositions;
  _positions = defaultPositions; _papers = defaultPapers;
  _mockTests = defaultMockTests; _books = defaultBooks; 
  _mcqs = defaultMcqs; _testPatterns = defaultTestPatterns;
  _nextId = { cat: 300, pos: 300, paper: 300, book: 300, mcq: 300, pattern: 300, mock: 300 };
  ['pak_categories','pak_cat_positions','pak_positions','pak_papers','pak_mock_tests','pak_books','pak_mcqs','pak_patterns','pak_nextId']
    .forEach(k => localStorage.removeItem(k));
  syncExports(); notify();
};

// ── Helpers ───────────────────────────────────────────────────
export const getPapersForJob    = (posId)  => _papers.filter(p => p.positionId === posId || p.jobId === posId);
export const getMockTestsForJob = (posId)  => _mockTests.filter(m => m.positionId === posId || m.jobId === posId);
export const getBooksForJob     = (posId)  => _books.filter(b => b.positionId === posId || b.jobId === posId);
export const getPatternForJob   = (posId)  => _testPatterns.find(p => p.positionId === posId || p.jobId === posId);
export const getMcqsForPaper    = (paperId)=> _mcqs.filter(m => m.paperId === paperId);
export const getMcqsForBook     = (bookId) => _mcqs.filter(m => m.bookId === bookId);

// ── Exports for React Context/Store ──────────────────────────
export const useStore = {
  getState: () => ({
    categories: _categories,
    positions: _positions,
    categoryPositions: _categoryPositions,
    papers: _papers,
    mockTests: _mockTests,
    books: _books,
    mcqs: _mcqs,
    testPatterns: _testPatterns,
  }),
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
  getMcqs,
  getTestPatterns,
  addCategory,
  updateCategory,
  deleteCategory,
  addPosition,
  updatePosition,
  deletePosition,
  addPaper,
  updatePaper,
  deletePaper,
  addMockTest,
  updateMockTest,
  deleteMockTest,
  addBook,
  updateBook,
  deleteBook,
  addMcq,
  updateMcq,
  deleteMcq,
  addPattern,
  updatePattern,
  deletePattern,
  setCategoryPositions,
  getPositionsForCategory,
  getPapersForJob,
  getMockTestsForJob,
  getBooksForJob,
  getPatternForJob,
  getMcqsForPaper,
  getMcqsForBook,
  resetAllData,
  subscribe,
  useStore,
};