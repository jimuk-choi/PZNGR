import React from "react";
import PageTemplate from "../../components/templates/PageTemplate/PageTemplate.jsx";
import Text from "../../components/atoms/Text/Text.jsx";
import Container from "../../components/atoms/Container/Container.jsx";

const CustomerService = () => {
  return (
    <PageTemplate>
      <Container variant="center" padding="xxxxxl">
        <Text size="xl" weight="bold">고객센터 페이지</Text>
      </Container>
    </PageTemplate>
  );
};

export default CustomerService;
