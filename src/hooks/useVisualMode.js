import { useState } from 'react';

function useVisualMode(initialMode) {
  const [history, setHistory] = useState([initialMode]);

  const transition = (newMode, replace = false) => {
    if (replace) {
      setHistory((prevHistory) => {
        const newHistory = [...prevHistory];
        newHistory.pop(); 
        return [...newHistory, newMode];
      });
    } else {
      setHistory((prevHistory) => [...prevHistory, newMode]);
    }
  };

  const back = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
    }
  };

  return { mode: history[history.length - 1], transition, back };
}

export default useVisualMode;
