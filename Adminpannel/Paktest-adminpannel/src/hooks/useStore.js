import { useState, useEffect } from 'react';
import { 
  subscribe, 
  getCategories, 
  getPositions, 
  getCategoryPositions, 
  getPapers, 
  getMockTests,
  getBooks, 
  getSubjects,
  getChapters,
  getMcqs, 
  getTestPatterns 
} from '../data/store';

export const useStore = () => {
  const [, setTick] = useState(0);
  useEffect(() => { const unsub = subscribe(() => setTick(t => t + 1)); return unsub; }, []);
  return {
    categories:        getCategories(),
    positions:         getPositions(),
    jobs:              getPositions(),   // alias
    categoryPositions: getCategoryPositions(),
    papers:            getPapers(),
    mockTests:         getMockTests(),
    books:             getBooks(),
    subjects:          getSubjects(),
    chapters:          getChapters(),
    mcqs:              getMcqs(),
    testPatterns:      getTestPatterns(),
  };
};
