import React from "react";
import {
  MainContainer,
  HeaderSection,
  MainImageSection,
  FooterSection,
} from "./styles.jsx";
import { Img01 } from "../../assets/images";

const Main = () => {
  return (
    <MainContainer>
      <HeaderSection>
        <div className="menu-box">
          <span>SHOP</span>
          <span>고객센터</span>
        </div>
        <div className="logo-box">
          <div className="logo" />
        </div>
        <div className="icon-box">
          <div className="icon-person" />
          <div className="icon-cart" />
          <div className="menu-hamburger" />
        </div>
      </HeaderSection>

      <MainImageSection $bgImage={Img01} />

      <FooterSection>
        <div className="footer-top">
          <div className="logo-box">
            <div className="logo" />
          </div>
        </div>

        <div className="footer-mid">
          <div className="left-box">
            <div className="nav-links">
              <span>회사소개</span>
              <span>이용약관</span>
              <span>개인정보처리방침</span>
              <span>이용안내</span>
            </div>

            <div className="company-info">
              <h3>쇼핑몰 기본정보</h3>
              <div className="info-grid">
                <div className="info-row">
                  <div className="info-item">
                    <span className="label">상호명</span>
                    <span className="value">에잇바이어거스트</span>
                  </div>
                  <div className="info-item">
                    <span className="label">대표자명</span>
                    <span className="value">김진우</span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-item address">
                    <span className="label">사업장 주소</span>
                    <span className="value">
                      10113 경기도 김포시 풍무로 180 (풍무동) 풍무아도니스의꿈1
                    </span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-item">
                    <span className="label">대표 전화</span>
                    <span className="value">0507-1457-0810</span>
                  </div>
                  <div className="info-item">
                    <span className="label">사업자 등록번호</span>
                    <span className="value">6530801736</span>
                  </div>
                  <div className="info-item">
                    <span className="label">통신판매업 신고번호</span>
                    <span className="value">간이과세자</span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-item">
                    <span className="label">개인정보보호책임자</span>
                    <span className="value">김진우</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="right-box">
            <div className="customer-info">
              <h3>고객센터 정보</h3>
              <div className="info-list">
                <div className="info-item vertical">
                  <span className="label">상담/주문 전화</span>
                  <span className="value">0507-1457-0810</span>
                </div>
                <div className="info-item vertical">
                  <span className="label">상담/주문 이메일</span>
                  <span className="value">rlawlsdn40@gmail.com</span>
                </div>
                <div className="info-item vertical">
                  <span className="label">CS운영시간</span>
                  <div className="value-group">
                    <span className="value">MON -FRI : 1PM-5PM</span>
                    <span className="value">SAT / SUN / HOLIDAY OFF</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="payment-info">
              <h3>결제정보</h3>
              <div className="info-item vertical">
                <span className="label">무통장 계좌정보</span>
                <span className="value">기업은행 519-039471-01-011</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            <span>Copyright © PAZNTEGRH l 파즈네그르.</span>
          </div>
          <div className="sns-box">
            <span>SNS</span>
            <div className="sns-icon" />
          </div>
        </div>
      </FooterSection>
    </MainContainer>
  );
};

export default Main;
