// localStorage 연동 유틸리티 함수들

// localStorage에서 데이터를 가져오는 함수
export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// localStorage에 데이터를 저장하는 함수
export const setToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// localStorage에서 데이터를 제거하는 함수
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};

// Zustand persist 미들웨어를 위한 storage 객체
export const createJSONStorage = () => ({
  getItem: (name) => getFromLocalStorage(name),
  setItem: (name, value) => setToLocalStorage(name, value),
  removeItem: (name) => removeFromLocalStorage(name),
});