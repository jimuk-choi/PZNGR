import React from "react";
import Text from "../../atoms/Text/Text.jsx";
import Container from "../../atoms/Container/Container.jsx";
import Logo from "../../molecules/Logo/Logo.jsx";
import InfoItem from "../../molecules/InfoItem/InfoItem.jsx";
import SocialLink from "../../molecules/SocialLink/SocialLink.jsx";
import { InstagramIcon } from "../../../shared/assets";
import {
  StyledFooter,
  TopSection,
  MidSection,
  BottomSection,
  LeftSection,
  RightSection,
  LinkGroup,
  InfoSection,
  InfoGrid,
  InfoRow,
  SNSGroup
} from "./Footer.styles.jsx";

const Footer = () => {
  return (
    <StyledFooter>
      <TopSection>
        <Logo />
      </TopSection>

      <MidSection>
        <LeftSection>
          <LinkGroup>
            <Text variant="link" size="md" weight="semibold">회사소개</Text>
            <Text variant="link" size="md" weight="semibold">이용약관</Text>
            <Text variant="link" size="md" weight="semibold">개인정보처리방침</Text>
            <Text variant="link" size="md" weight="semibold">이용안내</Text>
          </LinkGroup>

          <InfoSection>
            <Text size="lg" weight="semibold">쇼핑몰 기본정보</Text>
            <InfoGrid>
              <InfoRow>
                <InfoItem label="상호명" value="에잇바이어거스트" />
                <InfoItem label="대표자명" value="김진우" />
              </InfoRow>
              <InfoRow>
                <InfoItem 
                  label="사업장 주소" 
                  value="10113 경기도 김포시 풍무로 180 (풍무동) 풍무아도니스의꿈1" 
                  isLongText={true}
                />
              </InfoRow>
              <InfoRow>
                <InfoItem label="대표 전화" value="0507-1457-0810" />
                <InfoItem label="사업자 등록번호" value="6530801736" />
                <InfoItem label="통신판매업 신고번호" value="간이과세자" />
              </InfoRow>
              <InfoRow>
                <InfoItem label="개인정보보호책임자" value="김진우" />
              </InfoRow>
            </InfoGrid>
          </InfoSection>
        </LeftSection>

        <RightSection>
          <InfoSection>
            <Text size="lg" weight="semibold">고객센터 정보</Text>
            <Container direction="column" gap="md">
              <InfoItem label="상담/주문 전화" value="0507-1457-0810" />
              <InfoItem label="상담/주문 이메일" value="rlawlsdn40@gmail.com" />
              <InfoItem label="CS운영시간">
                <Text size="sm">MON - FRI : 1PM-5PM</Text>
                <Text size="sm">SAT / SUN / HOLIDAY OFF</Text>
              </InfoItem>
            </Container>
          </InfoSection>

          <InfoSection>
            <Text size="lg" weight="semibold">결제정보</Text>
            <InfoItem label="무통장 계좌정보" value="기업은행 519-039471-01-011" />
          </InfoSection>
        </RightSection>
      </MidSection>

      <BottomSection>
        <Text size="sm" color="gray">Copyright © PAZNTEGRH l 파즈네그르.</Text>
        <SNSGroup>
          <Text size="lg" weight="semibold">SNS</Text>
          <SocialLink
            href="https://www.instagram.com/pazntegrh/"
            icon={InstagramIcon}
            alt="Instagram Icon"
          />
        </SNSGroup>
      </BottomSection>
    </StyledFooter>
  );
};

export default Footer;