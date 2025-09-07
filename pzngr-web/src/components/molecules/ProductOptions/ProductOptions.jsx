import React, { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import { OPTION_TYPE, createProductOption, createOptionValue } from "../../../models/Product";
import * as S from "./ProductOptions.styles";

const ProductOptions = ({ options = [], onChange }) => {
  const [expandedOption, setExpandedOption] = useState(null);

  const handleAddOption = () => {
    const newOption = createProductOption('새 옵션', OPTION_TYPE.SELECT, false);
    onChange([...options, newOption]);
    setExpandedOption(newOption.id);
  };

  const handleRemoveOption = (optionId) => {
    const updatedOptions = options.filter(option => option.id !== optionId);
    onChange(updatedOptions);
    if (expandedOption === optionId) {
      setExpandedOption(null);
    }
  };

  const handleUpdateOption = (optionId, updates) => {
    const updatedOptions = options.map(option =>
      option.id === optionId ? { ...option, ...updates } : option
    );
    onChange(updatedOptions);
  };

  const handleAddOptionValue = (optionId) => {
    const newValue = createOptionValue('새 값', 0);
    const updatedOptions = options.map(option =>
      option.id === optionId 
        ? { ...option, values: [...option.values, newValue] }
        : option
    );
    onChange(updatedOptions);
  };

  const handleRemoveOptionValue = (optionId, valueId) => {
    const updatedOptions = options.map(option =>
      option.id === optionId 
        ? { ...option, values: option.values.filter(value => value.id !== valueId) }
        : option
    );
    onChange(updatedOptions);
  };

  const handleUpdateOptionValue = (optionId, valueId, updates) => {
    const updatedOptions = options.map(option =>
      option.id === optionId 
        ? {
            ...option,
            values: option.values.map(value =>
              value.id === valueId ? { ...value, ...updates } : value
            )
          }
        : option
    );
    onChange(updatedOptions);
  };

  const toggleExpanded = (optionId) => {
    setExpandedOption(expandedOption === optionId ? null : optionId);
  };

  return (
    <S.OptionsContainer>
      <S.OptionsHeader>
        <Text variant="h4">상품 옵션</Text>
        <Button variant="outline" size="small" onClick={handleAddOption}>
          + 옵션 추가
        </Button>
      </S.OptionsHeader>

      {options.length === 0 ? (
        <S.EmptyState>
          <Text variant="body2" color="gray">
            옵션이 없습니다. 색상, 사이즈 등의 옵션을 추가해보세요.
          </Text>
        </S.EmptyState>
      ) : (
        <S.OptionsList>
          {options.map((option) => (
            <S.OptionItem key={option.id} expanded={expandedOption === option.id}>
              <S.OptionHeader onClick={() => toggleExpanded(option.id)}>
                <S.OptionInfo>
                  <S.OptionName>
                    {option.name || '새 옵션'} 
                    <S.OptionBadge type={option.type}>{option.type}</S.OptionBadge>
                    {option.required && <S.RequiredBadge>필수</S.RequiredBadge>}
                  </S.OptionName>
                  <S.OptionMeta>
                    {option.values.length}개 값 • {expandedOption === option.id ? '접기' : '펼치기'}
                  </S.OptionMeta>
                </S.OptionInfo>
                <S.OptionActions onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => handleRemoveOption(option.id)}
                  >
                    삭제
                  </Button>
                </S.OptionActions>
              </S.OptionHeader>

              {expandedOption === option.id && (
                <S.OptionDetails>
                  <S.OptionSettings>
                    <S.SettingRow>
                      <S.SettingGroup>
                        <S.Label>옵션명</S.Label>
                        <S.Input
                          type="text"
                          value={option.name}
                          onChange={(e) => handleUpdateOption(option.id, { name: e.target.value })}
                          placeholder="예: 색상, 사이즈, 재질"
                        />
                      </S.SettingGroup>
                      
                      <S.SettingGroup>
                        <S.Label>타입</S.Label>
                        <S.Select
                          value={option.type}
                          onChange={(e) => handleUpdateOption(option.id, { type: e.target.value })}
                        >
                          <option value={OPTION_TYPE.SELECT}>드롭다운 선택</option>
                          <option value={OPTION_TYPE.RADIO}>라디오 버튼</option>
                          <option value={OPTION_TYPE.CHECKBOX}>체크박스</option>
                        </S.Select>
                      </S.SettingGroup>
                    </S.SettingRow>

                    <S.CheckboxRow>
                      <S.CheckboxGroup>
                        <S.Checkbox
                          type="checkbox"
                          checked={option.required}
                          onChange={(e) => handleUpdateOption(option.id, { required: e.target.checked })}
                        />
                        <S.CheckboxLabel>필수 옵션</S.CheckboxLabel>
                      </S.CheckboxGroup>
                    </S.CheckboxRow>
                  </S.OptionSettings>

                  <S.ValuesSection>
                    <S.ValuesHeader>
                      <Text variant="h5">옵션 값</Text>
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => handleAddOptionValue(option.id)}
                      >
                        + 값 추가
                      </Button>
                    </S.ValuesHeader>

                    {option.values.length === 0 ? (
                      <S.EmptyValues>
                        <Text variant="body2" color="gray">
                          옵션 값이 없습니다. '값 추가' 버튼을 눌러 추가해보세요.
                        </Text>
                      </S.EmptyValues>
                    ) : (
                      <S.ValuesList>
                        {option.values.map((value) => (
                          <S.ValueItem key={value.id}>
                            <S.ValueInputs>
                              <S.ValueInputGroup>
                                <S.Label>값 이름</S.Label>
                                <S.Input
                                  type="text"
                                  value={value.name}
                                  onChange={(e) => 
                                    handleUpdateOptionValue(option.id, value.id, { name: e.target.value })
                                  }
                                  placeholder="예: 빨간색, L사이즈, 면"
                                />
                              </S.ValueInputGroup>
                              
                              <S.ValueInputGroup>
                                <S.Label>추가 가격 (원)</S.Label>
                                <S.Input
                                  type="number"
                                  value={value.additionalPrice}
                                  onChange={(e) => 
                                    handleUpdateOptionValue(option.id, value.id, { 
                                      additionalPrice: parseInt(e.target.value) || 0 
                                    })
                                  }
                                  placeholder="0"
                                />
                              </S.ValueInputGroup>
                              
                              <S.ValueInputGroup>
                                <S.Label>재고 수량</S.Label>
                                <S.Input
                                  type="number"
                                  value={value.stock}
                                  onChange={(e) => 
                                    handleUpdateOptionValue(option.id, value.id, { 
                                      stock: parseInt(e.target.value) || 0 
                                    })
                                  }
                                  placeholder="0"
                                />
                              </S.ValueInputGroup>
                            </S.ValueInputs>
                            
                            <S.ValueActions>
                              <Button
                                variant="danger"
                                size="small"
                                onClick={() => handleRemoveOptionValue(option.id, value.id)}
                              >
                                삭제
                              </Button>
                            </S.ValueActions>
                          </S.ValueItem>
                        ))}
                      </S.ValuesList>
                    )}
                  </S.ValuesSection>
                </S.OptionDetails>
              )}
            </S.OptionItem>
          ))}
        </S.OptionsList>
      )}

      <S.OptionsHint>
        <Text variant="body2" color="gray">
          💡 팁: 색상, 사이즈, 재질 등 다양한 옵션을 추가하여 고객이 원하는 상품을 선택할 수 있게 해보세요.
          옵션별로 추가 가격과 재고를 개별 관리할 수 있습니다.
        </Text>
      </S.OptionsHint>
    </S.OptionsContainer>
  );
};

export default ProductOptions;