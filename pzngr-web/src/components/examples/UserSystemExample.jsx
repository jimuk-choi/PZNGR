import React, { useState } from 'react';
import styled from 'styled-components';
import {
  USER_ROLES,
  USER_STATUS,
  GENDER,
  MEMBERSHIP_TIER,
  MEMBERSHIP_BENEFITS,
  ADDRESS_TYPE,
  ADDRESS_TYPE_LABELS
} from '../../types';
import {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateRegistrationForm,
  formatPhoneNumber,
  getPasswordStrengthText,
  getPasswordStrengthColor
} from '../../utils/validation';
import { mockUsers, getUserStats, mockAddresses } from '../../data/mockUsers';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Section = styled.div`
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;
`;

const Title = styled.h1`
  color: #333;
  text-align: center;
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid ${props => props.hasError ? '#ff4757' : '#ddd'};
  border-radius: 4px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#ff4757' : '#007bff'};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 5px;
  background: ${props => props.$variant === 'danger' ? '#ff4757' : '#007bff'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: ${props => props.$variant === 'danger' ? '#ff3838' : '#0056b3'};
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.span`
  color: #ff4757;
  font-size: 12px;
  display: block;
  margin-top: 5px;
`;

const PasswordStrength = styled.div`
  margin-top: 5px;
  padding: 5px;
  border-radius: 4px;
  background: ${props => props.color}20;
  border-left: 3px solid ${props => props.color};
  font-size: 12px;
  color: ${props => props.color};
`;

const UserCard = styled(Card)`
  position: relative;
`;

const UserStatus = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: white;
  background: ${props => {
    switch(props.status) {
      case USER_STATUS.ACTIVE: return '#2ed573';
      case USER_STATUS.SUSPENDED: return '#ff4757';
      case USER_STATUS.INACTIVE: return '#ffa502';
      default: return '#57606f';
    }
  }};
`;

const MembershipBadge = styled.span`
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  background: ${props => MEMBERSHIP_BENEFITS[props.tier]?.color || '#57606f'};
`;

const StatCard = styled(Card)`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2em;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 14px;
`;

const AddressCard = styled(Card)`
  border-left: 4px solid ${props => props.isDefault ? '#2ed573' : '#ddd'};
`;

const UserSystemExample = () => {
  // 회원가입 폼 상태
  const [registrationForm, setRegistrationForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    birthDate: '',
    gender: GENDER.PREFER_NOT_TO_SAY,
    emailNotifications: true,
    smsNotifications: true,
    marketingConsent: false,
    termsAccepted: false,
    privacyAccepted: false
  });

  const [formErrors, setFormErrors] = useState({});
  const [selectedUser, setSelectedUser] = useState(mockUsers[0]);

  // 폼 입력 핸들러
  const handleInputChange = (field, value) => {
    setRegistrationForm(prev => ({
      ...prev,
      [field]: value
    }));

    // 실시간 검증
    setFormErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  // 전화번호 자동 형식 변환
  const handlePhoneChange = (value) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange('phone', formatted);
  };

  // 회원가입 폼 검증
  const validateForm = () => {
    const validation = validateRegistrationForm(registrationForm);
    setFormErrors(validation.errors);
    return validation.isValid;
  };

  // 회원가입 처리
  const handleRegistration = () => {
    if (validateForm()) {
      alert('회원가입이 완료되었습니다!');
      console.log('Registration data:', registrationForm);
    }
  };

  // 통계 데이터
  const stats = getUserStats();

  // 비밀번호 강도 검사
  const passwordValidation = validatePassword(registrationForm.password);

  return (
    <Container>
      <Title>👥 사용자 관리 시스템 예시</Title>

      {/* 사용자 통계 섹션 */}
      <Section>
        <SectionTitle>📊 사용자 통계</SectionTitle>
        <Grid>
          <StatCard>
            <StatNumber>{stats.totalUsers}</StatNumber>
            <StatLabel>전체 사용자</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.activeUsers}</StatNumber>
            <StatLabel>활성 사용자</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.adminUsers}</StatNumber>
            <StatLabel>관리자</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.totalRevenue.toLocaleString()}원</StatNumber>
            <StatLabel>총 매출</StatLabel>
          </StatCard>
        </Grid>

        <h3>회원 등급별 분포</h3>
        <Grid>
          {Object.entries(stats.tierDistribution).map(([tier, count]) => (
            <StatCard key={tier}>
              <MembershipBadge tier={tier}>
                {MEMBERSHIP_BENEFITS[tier].name}
              </MembershipBadge>
              <StatNumber>{count}명</StatNumber>
              <StatLabel>
                할인율: {(MEMBERSHIP_BENEFITS[tier].discountRate * 100)}%<br/>
                포인트 적립: {MEMBERSHIP_BENEFITS[tier].pointsMultiplier}배
              </StatLabel>
            </StatCard>
          ))}
        </Grid>
      </Section>

      {/* 회원가입 폼 섹션 */}
      <Section>
        <SectionTitle>📝 회원가입 폼 (유효성 검증 포함)</SectionTitle>
        <Grid>
          <Card>
            <h3>회원가입</h3>
            
            <FormGroup>
              <Label>이메일 *</Label>
              <Input
                type="email"
                value={registrationForm.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                hasError={formErrors.email}
                placeholder="example@email.com"
              />
              {formErrors.email && <ErrorText>{formErrors.email}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>비밀번호 *</Label>
              <Input
                type="password"
                value={registrationForm.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                hasError={formErrors.password}
                placeholder="8자 이상, 대/소문자, 숫자, 특수문자 포함"
              />
              {registrationForm.password && (
                <PasswordStrength color={getPasswordStrengthColor(passwordValidation.strength)}>
                  비밀번호 강도: {getPasswordStrengthText(passwordValidation.strength)}
                </PasswordStrength>
              )}
              {formErrors.password && <ErrorText>{formErrors.password}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>비밀번호 확인 *</Label>
              <Input
                type="password"
                value={registrationForm.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                hasError={formErrors.confirmPassword}
                placeholder="비밀번호를 다시 입력하세요"
              />
              {formErrors.confirmPassword && <ErrorText>{formErrors.confirmPassword}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>이름 *</Label>
              <Input
                type="text"
                value={registrationForm.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                hasError={formErrors.name}
                placeholder="홍길동"
              />
              {formErrors.name && <ErrorText>{formErrors.name}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>전화번호 *</Label>
              <Input
                type="tel"
                value={registrationForm.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                hasError={formErrors.phone}
                placeholder="010-1234-5678"
              />
              {formErrors.phone && <ErrorText>{formErrors.phone}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>생년월일</Label>
              <Input
                type="date"
                value={registrationForm.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                hasError={formErrors.birthDate}
              />
              {formErrors.birthDate && <ErrorText>{formErrors.birthDate}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>성별</Label>
              <Select
                value={registrationForm.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
              >
                <option value={GENDER.PREFER_NOT_TO_SAY}>선택 안함</option>
                <option value={GENDER.MALE}>남성</option>
                <option value={GENDER.FEMALE}>여성</option>
                <option value={GENDER.OTHER}>기타</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>
                <input
                  type="checkbox"
                  checked={registrationForm.termsAccepted}
                  onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                />
                {' '}이용약관 동의 (필수)
              </Label>
              {formErrors.termsAccepted && <ErrorText>{formErrors.termsAccepted}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>
                <input
                  type="checkbox"
                  checked={registrationForm.privacyAccepted}
                  onChange={(e) => handleInputChange('privacyAccepted', e.target.checked)}
                />
                {' '}개인정보처리방침 동의 (필수)
              </Label>
              {formErrors.privacyAccepted && <ErrorText>{formErrors.privacyAccepted}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>
                <input
                  type="checkbox"
                  checked={registrationForm.marketingConsent}
                  onChange={(e) => handleInputChange('marketingConsent', e.target.checked)}
                />
                {' '}마케팅 정보 수신 동의 (선택)
              </Label>
            </FormGroup>

            <Button onClick={handleRegistration}>
              회원가입
            </Button>
          </Card>

          {/* 실시간 폼 검증 결과 */}
          <Card>
            <h3>실시간 검증 결과</h3>
            <div>
              <strong>이메일:</strong> {
                registrationForm.email ? 
                validateEmail(registrationForm.email).isValid ? '✅ 유효' : '❌ 무효' 
                : '⏳ 입력 대기'
              }
            </div>
            <div>
              <strong>비밀번호:</strong> {
                registrationForm.password ? 
                `${passwordValidation.isValid ? '✅' : '❌'} ${getPasswordStrengthText(passwordValidation.strength)}`
                : '⏳ 입력 대기'
              }
            </div>
            <div>
              <strong>이름:</strong> {
                registrationForm.name ? 
                validateName(registrationForm.name).isValid ? '✅ 유효' : '❌ 무효' 
                : '⏳ 입력 대기'
              }
            </div>
            <div>
              <strong>전화번호:</strong> {
                registrationForm.phone ? 
                validatePhone(registrationForm.phone).isValid ? '✅ 유효' : '❌ 무효' 
                : '⏳ 입력 대기'
              }
            </div>
          </Card>
        </Grid>
      </Section>

      {/* 사용자 목록 섹션 */}
      <Section>
        <SectionTitle>👤 사용자 목록</SectionTitle>
        <Grid>
          {mockUsers.map(user => (
            <UserCard key={user.id}>
              <UserStatus status={user.status}>
                {user.status === USER_STATUS.ACTIVE && '활성'}
                {user.status === USER_STATUS.SUSPENDED && '정지'}
                {user.status === USER_STATUS.INACTIVE && '비활성'}
              </UserStatus>
              
              <h4>{user.name}</h4>
              <p><strong>이메일:</strong> {user.email}</p>
              <p><strong>전화번호:</strong> {user.phone}</p>
              <p><strong>역할:</strong> {user.role === USER_ROLES.ADMIN ? '관리자' : '일반 사용자'}</p>
              
              <div style={{ margin: '10px 0' }}>
                <MembershipBadge tier={user.membershipTier}>
                  {MEMBERSHIP_BENEFITS[user.membershipTier].name}
                </MembershipBadge>
              </div>
              
              <p><strong>총 구매금액:</strong> {user.totalSpent.toLocaleString()}원</p>
              <p><strong>주문 횟수:</strong> {user.orderCount}회</p>
              <p><strong>가입일:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
              <p><strong>최종 로그인:</strong> {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : '없음'}</p>
              
              <Button onClick={() => setSelectedUser(user)}>
                상세 보기
              </Button>
            </UserCard>
          ))}
        </Grid>
      </Section>

      {/* 선택된 사용자 상세 정보 */}
      {selectedUser && (
        <Section>
          <SectionTitle>🔍 사용자 상세 정보 - {selectedUser.name}</SectionTitle>
          <Grid>
            <Card>
              <h3>기본 정보</h3>
              <p><strong>ID:</strong> {selectedUser.id}</p>
              <p><strong>이름:</strong> {selectedUser.name}</p>
              <p><strong>이메일:</strong> {selectedUser.email}</p>
              <p><strong>전화번호:</strong> {selectedUser.phone}</p>
              <p><strong>생년월일:</strong> {selectedUser.birthDate}</p>
              <p><strong>성별:</strong> {
                selectedUser.gender === GENDER.MALE ? '남성' :
                selectedUser.gender === GENDER.FEMALE ? '여성' :
                selectedUser.gender === GENDER.OTHER ? '기타' : '선택 안함'
              }</p>
            </Card>

            <Card>
              <h3>계정 상태</h3>
              <p><strong>역할:</strong> {selectedUser.role === USER_ROLES.ADMIN ? '관리자' : '일반 사용자'}</p>
              <p><strong>상태:</strong> {
                selectedUser.status === USER_STATUS.ACTIVE ? '활성' :
                selectedUser.status === USER_STATUS.SUSPENDED ? '정지' : '비활성'
              }</p>
              <p><strong>회원 등급:</strong> {MEMBERSHIP_BENEFITS[selectedUser.membershipTier].name}</p>
              <p><strong>가입일:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              <p><strong>최종 수정일:</strong> {new Date(selectedUser.updatedAt).toLocaleDateString()}</p>
              <p><strong>최종 로그인:</strong> {selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleDateString() : '없음'}</p>
            </Card>

            <Card>
              <h3>구매 정보</h3>
              <p><strong>총 구매금액:</strong> {selectedUser.totalSpent.toLocaleString()}원</p>
              <p><strong>주문 횟수:</strong> {selectedUser.orderCount}회</p>
              <p><strong>평균 주문금액:</strong> {
                selectedUser.orderCount > 0 ? 
                Math.round(selectedUser.totalSpent / selectedUser.orderCount).toLocaleString() + '원' : 
                '0원'
              }</p>
              <p><strong>할인율:</strong> {(MEMBERSHIP_BENEFITS[selectedUser.membershipTier].discountRate * 100)}%</p>
              <p><strong>포인트 적립률:</strong> {MEMBERSHIP_BENEFITS[selectedUser.membershipTier].pointsMultiplier}배</p>
            </Card>

            {selectedUser.defaultAddress && (
              <Card>
                <h3>기본 배송지</h3>
                <p><strong>수령인:</strong> {selectedUser.defaultAddress.recipientName}</p>
                <p><strong>전화번호:</strong> {selectedUser.defaultAddress.recipientPhone}</p>
                <p><strong>주소:</strong> ({selectedUser.defaultAddress.zipCode}) {selectedUser.defaultAddress.address}</p>
                <p><strong>상세주소:</strong> {selectedUser.defaultAddress.detailAddress}</p>
                <p><strong>별칭:</strong> {selectedUser.defaultAddress.addressAlias}</p>
                <p><strong>배송메모:</strong> {selectedUser.defaultAddress.deliveryNote}</p>
              </Card>
            )}
          </Grid>
        </Section>
      )}

      {/* 주소 관리 섹션 */}
      <Section>
        <SectionTitle>🏠 주소 관리 시스템</SectionTitle>
        <Grid>
          {mockAddresses.map(address => (
            <AddressCard key={address.id} isDefault={address.isDefault}>
              <h4>
                {ADDRESS_TYPE_LABELS[address.type]}
                {address.isDefault && <span style={{ color: '#2ed573', fontSize: '12px' }}> (기본)</span>}
              </h4>
              <p><strong>별칭:</strong> {address.addressAlias}</p>
              <p><strong>수령인:</strong> {address.recipientName}</p>
              <p><strong>전화번호:</strong> {address.recipientPhone}</p>
              <p><strong>주소:</strong> ({address.zipCode}) {address.address}</p>
              <p><strong>상세주소:</strong> {address.detailAddress}</p>
              {address.deliveryNote && (
                <p><strong>배송메모:</strong> {address.deliveryNote}</p>
              )}
              <p><strong>등록일:</strong> {new Date(address.createdAt).toLocaleDateString()}</p>
            </AddressCard>
          ))}
        </Grid>
      </Section>
    </Container>
  );
};

export default UserSystemExample;