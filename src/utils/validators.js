// 이메일 검증
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// 비밀번호 검증 (8자 이상, 영문, 숫자 포함)
export const isValidPassword = (password) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return regex.test(password);
};

// 전화번호 검증
export const isValidPhoneNumber = (phone) => {
  const regex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
  return regex.test(phone);
};

// 가격 검증
export const isValidPrice = (price) => {
  return !isNaN(price) && Number(price) > 0;
};
