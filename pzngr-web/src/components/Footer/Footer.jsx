import React from "react";
import {
  FooterContainer,
  TopBox,
  MidBox,
  LeftBox,
  RightBox,
  BottomBox,
  LogoBox,
  LogoImage,
  LinkGroup,
  LinkItem,
  InfoSection,
  InfoTitle,
  InfoBox,
  InfoRow,
  InfoItem,
  InfoLabel,
  InfoText,
  SNSBox,
  SNSIcon,
} from "./styles.jsx";
import { Logo01, InstagramIcon } from "../../assets/images";

const Footer = () => {
  return (
    <FooterContainer>
      <TopBox>
        <LogoBox>
          <LogoImage src={Logo01} alt="PZNGR Footer Logo" />
        </LogoBox>
      </TopBox>

      <MidBox>
        <LeftBox>
          <LinkGroup>
            <LinkItem>회사소개</LinkItem>
            <LinkItem>이용약관</LinkItem>
            <LinkItem>개인정보처리방침</LinkItem>
            <LinkItem>이용안내</LinkItem>
          </LinkGroup>

          <InfoSection>
            <InfoTitle>쇼핑몰 기본정보</InfoTitle>
            <InfoBox>
              <InfoRow>
                <InfoItem>
                  <InfoLabel>상호명</InfoLabel>
                  <InfoText>에잇바이어거스트</InfoText>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>대표자명</InfoLabel>
                  <InfoText>김진우</InfoText>
                </InfoItem>
              </InfoRow>

              <InfoRow>
                <InfoItem>
                  <InfoLabel>사업장 주소</InfoLabel>
                  <InfoText>
                    10113 경기도 김포시 풍무로 180 (풍무동) 풍무아도니스의꿈1
                  </InfoText>
                </InfoItem>
              </InfoRow>

              <InfoRow>
                <InfoItem>
                  <InfoLabel>대표 전화</InfoLabel>
                  <InfoText>0507-1457-0810</InfoText>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>사업자 등록번호</InfoLabel>
                  <InfoText>6530801736</InfoText>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>통신판매업 신고번호</InfoLabel>
                  <InfoText>간이과세자</InfoText>
                </InfoItem>
              </InfoRow>

              <InfoRow>
                <InfoItem>
                  <InfoLabel>개인정보보호책임자</InfoLabel>
                  <InfoText>김진우</InfoText>
                </InfoItem>
              </InfoRow>
            </InfoBox>
          </InfoSection>
        </LeftBox>

        <RightBox>
          <InfoSection>
            <InfoTitle>고객센터 정보</InfoTitle>
            <InfoBox>
              <InfoRow>
                <InfoItem>
                  <InfoLabel>상담/주문 전화</InfoLabel>
                  <InfoText>0507-1457-0810</InfoText>
                </InfoItem>
              </InfoRow>

              <InfoRow>
                <InfoItem>
                  <InfoLabel>상담/주문 이메일</InfoLabel>
                  <InfoText>rlawlsdn40@gmail.com</InfoText>
                </InfoItem>
              </InfoRow>

              <InfoRow>
                <InfoItem>
                  <InfoLabel>CS운영시간</InfoLabel>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <InfoText>MON - FRI : 1PM-5PM</InfoText>
                    <InfoText>SAT / SUN / HOLIDAY OFF</InfoText>
                  </div>
                </InfoItem>
              </InfoRow>
            </InfoBox>
          </InfoSection>

          <InfoSection>
            <InfoTitle>결제정보</InfoTitle>
            <InfoBox>
              <InfoRow>
                <InfoItem>
                  <InfoLabel>무통장 계좌정보</InfoLabel>
                  <InfoText>기업은행 519-039471-01-011</InfoText>
                </InfoItem>
              </InfoRow>
            </InfoBox>
          </InfoSection>
        </RightBox>
      </MidBox>

      <BottomBox>
        <p>Copyright © PAZNTEGRH l 파즈네그르.</p>
        <SNSBox>
          <p>SNS</p>
          <a
            href="https://www.instagram.com/pazntegrh/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SNSIcon src={InstagramIcon} alt="Instagram Icon" />
          </a>
        </SNSBox>
      </BottomBox>
    </FooterContainer>
  );
};

export default Footer;
