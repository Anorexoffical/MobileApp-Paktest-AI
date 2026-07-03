# Navigation Flow Diagram

## Admin Panel Top Navigation Bar
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📚 ExamPrep Admin                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  Dashboard │ Test Bodies │ Positions │ Papers │ Books │ Chapters │ MCQs │  │
│             │             │           │        │       │          │      │  │
│  /admin    │ /admin/     │ /admin/   │/admin/ │/admin/│ /admin/  │/admin│  │
│            │test-conduct │positions  │papers  │books  │chapters  │/mcqs │  │
│            │-bodies      │           │        │       │          │      │  │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Two Ways to Navigate

### Method 1: Direct Access (From Top Navigation)
```
Admin Panel → Books → View/Add/Edit All Books
Admin Panel → Chapters → View/Add/Edit All Chapters  
Admin Panel → MCQs → View/Add/Edit All MCQs
```

### Method 2: Hierarchical Navigation (Through Parent Entities)
```
Positions Page
    │
    ├─ Click "Manage Subjects" (📚 icon)
    │
    ├─→ Position Subjects Page (for specific position)
         │
         ├─ Click "Manage Books" button
         │
         ├─→ Subject Books Page (for specific subject)
              │
              ├─ Click "Manage Chapters" button
              │
              ├─→ Book Chapters Page (for specific book)
                   │
                   ├─ Click "Manage MCQs" button
                   │
                   └─→ Chapter MCQs Page (for specific chapter)
```

## Complete Page Inventory

### Main Admin Pages (Top Navigation)
1. **Dashboard** - `/admin`
2. **Test Conduct Bodies** - `/admin/test-conduct-bodies`
3. **Positions** - `/admin/positions`
4. **Papers** - `/admin/papers`
5. **Books** - `/admin/books` ✨ NEW
6. **Chapters** - `/admin/chapters` ✨ NEW
7. **MCQs** - `/admin/mcqs` ✨ NEW
8. **Patterns** - `/admin/patterns`

### Nested/Detail Pages (Accessed through parent)
9. **Position Subjects** - `/admin/position/:positionId/subjects`
10. **Subject Books** - `/admin/subject/:subjectId/books`
11. **Book Chapters** - `/admin/book/:bookId/chapters`
12. **Chapter MCQs** - `/admin/chapter/:chapterId/mcqs`
13. **Position Patterns** - `/admin/position/:positionId/patterns`

## Data Flow Example

### Example: Adding an MCQ to a specific Position

```
Step 1: Navigate to Positions
   → URL: /admin/positions
   → Action: Find "Accountant" position

Step 2: Manage Subjects
   → URL: /admin/position/pos1/subjects
   → Action: Find "Accounting" subject

Step 3: Manage Books
   → URL: /admin/subject/sub3/books
   → Action: Find "Accounting Principles" book

Step 4: Manage Chapters
   → URL: /admin/book/book3/chapters
   → Action: Find "Chapter 1" 

Step 5: Manage MCQs
   → URL: /admin/chapter/ch1/mcqs
   → Action: Add new MCQ with question, options, and answer
```

## Quick Access Shortcuts

### Managing All Books Across All Subjects
```
Admin Panel → Books → Add/Edit/Delete any book
(Direct access without going through Position → Subject)
```

### Managing All Chapters Across All Books
```
Admin Panel → Chapters → Add/Edit/Delete any chapter
(Direct access without going through Position → Subject → Book)
```

### Managing All MCQs Across All Chapters
```
Admin Panel → MCQs → Add/Edit/Delete any MCQ
(Direct access without going through the entire hierarchy)
```

## Buttons & Icons Reference

| Page | Button/Icon | Action | Leads To |
|------|------------|--------|----------|
| Positions | 📚 (FiBook) | Manage Subjects | Position Subjects Page |
| Position Subjects | 📖 Manage Books | View books for subject | Subject Books Page |
| Subject Books | 📄 Manage Chapters | View chapters for book | Book Chapters Page |
| Book Chapters | ✅ Manage MCQs | View MCQs for chapter | Chapter MCQs Page |
| Books (main) | 📄 (FiFileText) | Manage Chapters | Book Chapters Page |
| Chapters (main) | ✅ (FiCheckCircle) | Manage MCQs | Chapter MCQs Page |

## Action Icons Legend

- 👁️ (FiEye) - View Details
- ✏️ (FiEdit) - Edit Item
- 🗑️ (FiTrash2) - Delete Item
- ➕ (FiPlus) - Add New Item
- 🔍 (FiSearch) - Search/Filter

## Page Features Matrix

| Feature | Books | Chapters | MCQs |
|---------|-------|----------|------|
| Add New | ✅ | ✅ | ✅ |
| Edit | ✅ | ✅ | ✅ |
| Delete | ✅ | ✅ | ✅ |
| Search | ✅ | ✅ | ✅ |
| View Details Modal | ✅ | ✅ | ✅ |
| Link to Parent | ✅ Subject | ✅ Book | ✅ Chapter |
| Navigate to Children | ✅ Chapters | ✅ MCQs | ❌ (leaf node) |
| Empty State | ✅ | ✅ | ✅ |
| Table View | ✅ | ✅ | ✅ |
| Badges | ✅ | ✅ | ✅ |

## Breadcrumb Navigation Example

```
Position Subjects Page:
← Back to Positions | Position: Accountant | Subjects (3)

Subject Books Page:
← Back to Subjects | Accountant → Accounting | Books (5)

Book Chapters Page:
← Back to Books | Accounting Principles | Chapters (12)

Chapter MCQs Page:
← Back to Chapters | Chapter 1 | MCQs (25)
```

## Color Coding & Badges

- 🔵 **Blue/Primary** - Position, Chapter Number
- 🟢 **Green/Success** - Subject, Book (parent entity)
- 🟡 **Yellow/Warning** - Medium difficulty
- 🔴 **Red/Danger** - Hard difficulty, Delete button
- ⚪ **Gray/Secondary** - Pages count, neutral info
- 🔷 **Info/Cyan** - MCQs count, Edit button
