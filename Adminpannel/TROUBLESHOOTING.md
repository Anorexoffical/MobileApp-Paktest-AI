# Quick Troubleshooting Guide

## If Pages Still Redirect to Home

### Step 1: Clear Browser Cache and LocalStorage
```javascript
// Open browser console (F12) and run:
localStorage.clear();
location.reload();
```

### Step 2: Restart Development Server
```bash
cd Adminpannel/Paktest-adminpannel
npm run dev
# OR
yarn dev
```

### Step 3: Verify Data Exists
Check if you have subjects in localStorage:
```javascript
// In browser console:
JSON.parse(localStorage.getItem('pak_subjects'))
JSON.parse(localStorage.getItem('pak_books'))
JSON.parse(localStorage.getItem('pak_chapters'))
```

If they're null or empty, the default data should load automatically.

### Step 4: Check Browser Console for Errors
Open DevTools (F12) → Console tab
Look for any error messages when clicking navigation buttons

## Common Issues & Solutions

### Issue: "Cannot read property of undefined"
**Cause**: Store data not loaded
**Solution**: Refresh the page, clear localStorage

### Issue: Page shows "Not Found" or redirects to home
**Cause**: 
- Route parameter mismatch
- Data doesn't exist for that ID
**Solution**: 
- Check URL parameters match expected format
- Verify data exists in localStorage

### Issue: Buttons don't navigate
**Cause**: React Router Link component issue
**Solution**: Check browser console for errors

## Verify Navigation Works

1. Go to: `http://localhost:5173/admin/positions`
2. Click on "Manage Subjects" button (book icon)
   - Should go to: `/admin/position/pos1/subjects` (or similar)
   - Should see subjects list

3. Click on "Manage Books" button
   - Should go to: `/admin/subject/sub1/books` (or similar)
   - Should see books list

4. Click on "Manage Chapters" button
   - Should go to: `/admin/book/book1/chapters` (or similar)
   - Should see chapters list

5. Click on "Manage MCQs" button
   - Should go to: `/admin/chapter/ch1/mcqs` (or similar)
   - Should see MCQs list

## Manual Test Data Creation

If default data isn't showing:

1. Add a Position first
2. Then add a Subject to that Position
3. Then add a Book to that Subject
4. Then add a Chapter to that Book
5. Finally add MCQs to that Chapter

## Files to Check If Issues Persist

1. `src/hooks/useStore.js` - Should export subjects, chapters
2. `src/data/store.js` - Should have getSubjects(), getChapters()
3. `src/App.jsx` - Should have all routes defined
4. Browser Console - Check for JavaScript errors
5. Network Tab - Check if any 404 errors
