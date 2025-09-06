// ========================================
// 사용자 데이터 유효성 검증 함수들
// ========================================

// 이메일 형식 검증
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const result = {
    isValid: emailRegex.test(email),
    message: ''
  };
  
  if (!result.isValid) {
    if (!email) {
      result.message = '이메일을 입력해주세요.';
    } else {
      result.message = '올바른 이메일 형식이 아닙니다.';
    }
  }
  
  return result;
};

// 비밀번호 강도 검증
export const validatePassword = (password) => {
  const result = {
    isValid: false,
    message: '',
    strength: 'weak', // weak, medium, strong
    checks: {
      length: false,      // 8자 이상
      uppercase: false,   // 대문자 포함
      lowercase: false,   // 소문자 포함
      number: false,      // 숫자 포함
      special: false      // 특수문자 포함
    }
  };

  if (!password) {
    result.message = '비밀번호를 입력해주세요.';
    return result;
  }

  // 각 조건 체크
  result.checks.length = password.length >= 8;
  result.checks.uppercase = /[A-Z]/.test(password);
  result.checks.lowercase = /[a-z]/.test(password);
  result.checks.number = /\d/.test(password);
  result.checks.special = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  // 통과한 조건의 개수
  const passedChecks = Object.values(result.checks).filter(Boolean).length;

  // 강도 결정
  if (passedChecks >= 4 && result.checks.length) {
    result.strength = 'strong';
    result.isValid = true;
  } else if (passedChecks >= 3 && result.checks.length) {
    result.strength = 'medium';
    result.isValid = true;
    result.message = '비밀번호가 보통 강도입니다. 더 강한 비밀번호를 권장합니다.';
  } else {
    result.strength = 'weak';
    result.message = '비밀번호는 8자 이상이며, 대/소문자, 숫자, 특수문자를 포함해야 합니다.';
  }

  return result;
};

// 비밀번호 확인 검증
export const validatePasswordConfirm = (password, confirmPassword) => {
  const result = {
    isValid: false,
    message: ''
  };

  if (!confirmPassword) {
    result.message = '비밀번호 확인을 입력해주세요.';
  } else if (password !== confirmPassword) {
    result.message = '비밀번호가 일치하지 않습니다.';
  } else {
    result.isValid = true;
  }

  return result;
};

// 전화번호 형식 검증
export const validatePhone = (phone) => {
  // 한국 휴대폰 번호 형식: 010-0000-0000 또는 01000000000
  const phoneRegex = /^(010|011|016|017|018|019)-?\d{3,4}-?\d{4}$/;
  const result = {
    isValid: false,
    message: ''
  };

  if (!phone) {
    result.message = '전화번호를 입력해주세요.';
  } else {
    // 하이픈 제거 후 검사
    const cleanPhone = phone.replace(/-/g, '');
    result.isValid = phoneRegex.test(cleanPhone);
    
    if (!result.isValid) {
      result.message = '올바른 휴대폰 번호 형식이 아닙니다. (예: 010-1234-5678)';
    }
  }

  return result;
};

// 이름 검증
export const validateName = (name) => {
  const result = {
    isValid: false,
    message: ''
  };

  if (!name) {
    result.message = '이름을 입력해주세요.';
  } else if (name.length < 2) {
    result.message = '이름은 2자 이상 입력해주세요.';
  } else if (name.length > 20) {
    result.message = '이름은 20자 이하로 입력해주세요.';
  } else if (!/^[a-zA-Z가-힣\s]+$/.test(name)) {
    result.message = '이름은 한글, 영문만 입력 가능합니다.';
  } else {
    result.isValid = true;
  }

  return result;
};

// 생년월일 검증
export const validateBirthDate = (birthDate) => {
  const result = {
    isValid: false,
    message: ''
  };

  if (!birthDate) {
    result.message = '생년월일을 입력해주세요.';
    return result;
  }

  const date = new Date(birthDate);
  const today = new Date();
  const minAge = 14; // 최소 나이
  const maxAge = 100; // 최대 나이

  // 유효한 날짜인지 확인
  if (isNaN(date.getTime())) {
    result.message = '올바른 날짜 형식이 아닙니다.';
    return result;
  }

  // 미래 날짜인지 확인
  if (date > today) {
    result.message = '미래 날짜는 입력할 수 없습니다.';
    return result;
  }

  // 나이 계산
  const age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  const dayDiff = today.getDate() - date.getDate();
  const actualAge = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) ? age - 1 : age;

  if (actualAge < minAge) {
    result.message = `${minAge}세 이상만 가입 가능합니다.`;
  } else if (actualAge > maxAge) {
    result.message = '올바른 생년월일을 입력해주세요.';
  } else {
    result.isValid = true;
  }

  return result;
};

// 주소 검증
export const validateAddress = (address) => {
  const result = {
    isValid: false,
    message: '',
    errors: []
  };

  // 수령인 이름 검증
  if (!address.recipientName) {
    result.errors.push({ field: 'recipientName', message: '수령인 이름을 입력해주세요.' });
  } else if (address.recipientName.length < 2) {
    result.errors.push({ field: 'recipientName', message: '수령인 이름은 2자 이상 입력해주세요.' });
  }

  // 수령인 전화번호 검증
  const phoneValidation = validatePhone(address.recipientPhone);
  if (!phoneValidation.isValid) {
    result.errors.push({ field: 'recipientPhone', message: phoneValidation.message });
  }

  // 우편번호 검증
  if (!address.zipCode) {
    result.errors.push({ field: 'zipCode', message: '우편번호를 입력해주세요.' });
  } else if (!/^\d{5}$/.test(address.zipCode)) {
    result.errors.push({ field: 'zipCode', message: '우편번호는 5자리 숫자여야 합니다.' });
  }

  // 기본 주소 검증
  if (!address.address) {
    result.errors.push({ field: 'address', message: '주소를 입력해주세요.' });
  } else if (address.address.length < 5) {
    result.errors.push({ field: 'address', message: '주소는 5자 이상 입력해주세요.' });
  }

  // 상세 주소 검증
  if (!address.detailAddress) {
    result.errors.push({ field: 'detailAddress', message: '상세 주소를 입력해주세요.' });
  }

  result.isValid = result.errors.length === 0;
  result.message = result.errors.length > 0 ? result.errors[0].message : '';

  return result;
};

// 우편번호 검증
export const validateZipCode = (zipCode) => {
  const result = {
    isValid: false,
    message: ''
  };

  if (!zipCode) {
    result.message = '우편번호를 입력해주세요.';
  } else if (!/^\d{5}$/.test(zipCode)) {
    result.message = '우편번호는 5자리 숫자여야 합니다.';
  } else {
    result.isValid = true;
  }

  return result;
};

// 회원가입 폼 전체 검증
export const validateRegistrationForm = (formData) => {
  const errors = {};

  // 각 필드 검증
  const emailResult = validateEmail(formData.email);
  if (!emailResult.isValid) errors.email = emailResult.message;

  const passwordResult = validatePassword(formData.password);
  if (!passwordResult.isValid) errors.password = passwordResult.message;

  const confirmPasswordResult = validatePasswordConfirm(formData.password, formData.confirmPassword);
  if (!confirmPasswordResult.isValid) errors.confirmPassword = confirmPasswordResult.message;

  const nameResult = validateName(formData.name);
  if (!nameResult.isValid) errors.name = nameResult.message;

  const phoneResult = validatePhone(formData.phone);
  if (!phoneResult.isValid) errors.phone = phoneResult.message;

  if (formData.birthDate) {
    const birthDateResult = validateBirthDate(formData.birthDate);
    if (!birthDateResult.isValid) errors.birthDate = birthDateResult.message;
  }

  // 약관 동의 확인
  if (!formData.termsAccepted) {
    errors.termsAccepted = '이용약관에 동의해야 합니다.';
  }

  if (!formData.privacyAccepted) {
    errors.privacyAccepted = '개인정보처리방침에 동의해야 합니다.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// 로그인 폼 검증
export const validateLoginForm = (formData) => {
  const errors = {};

  if (!formData.email) {
    errors.email = '이메일을 입력해주세요.';
  }

  if (!formData.password) {
    errors.password = '비밀번호를 입력해주세요.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// 전화번호 형식 자동 변환 (하이픈 추가)
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  
  return phone;
};

// 비밀번호 강도 표시 텍스트
export const getPasswordStrengthText = (strength) => {
  const strengthTexts = {
    weak: '약함',
    medium: '보통',
    strong: '강함'
  };
  return strengthTexts[strength] || '약함';
};

// 비밀번호 강도 색상
export const getPasswordStrengthColor = (strength) => {
  const strengthColors = {
    weak: '#ff4757',
    medium: '#ffa502',
    strong: '#2ed573'
  };
  return strengthColors[strength] || '#ff4757';
};