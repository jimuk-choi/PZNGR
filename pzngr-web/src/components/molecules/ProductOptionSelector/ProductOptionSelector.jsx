import React, { useState, useEffect } from "react";
import Text from "../../atoms/Text";
import { OPTION_TYPE } from "../../../models/Product";
import * as S from "./ProductOptionSelector.styles";

const ProductOptionSelector = ({ 
  options = [], 
  selectedOptions = {}, 
  onChange,
  onPriceChange 
}) => {
  const [selections, setSelections] = useState(selectedOptions);
  const [totalAdditionalPrice, setTotalAdditionalPrice] = useState(0);

  useEffect(() => {
    // 선택된 옵션들의 추가 가격 계산
    let additionalPrice = 0;
    
    Object.entries(selections).forEach(([optionId, valueId]) => {
      if (Array.isArray(valueId)) {
        // 체크박스 타입 - 배열
        valueId.forEach(id => {
          const option = options.find(opt => opt.id === optionId);
          const value = option?.values.find(val => val.id === id);
          if (value) {
            additionalPrice += value.additionalPrice || 0;
          }
        });
      } else {
        // 단일 선택 타입
        const option = options.find(opt => opt.id === optionId);
        const value = option?.values.find(val => val.id === valueId);
        if (value) {
          additionalPrice += value.additionalPrice || 0;
        }
      }
    });
    
    setTotalAdditionalPrice(additionalPrice);
    if (onPriceChange) {
      onPriceChange(additionalPrice);
    }
    
    if (onChange) {
      onChange(selections);
    }
  }, [selections, options, onChange, onPriceChange]);

  const handleOptionChange = (optionId, valueId, isChecked = false) => {
    setSelections(prev => {
      const option = options.find(opt => opt.id === optionId);
      
      if (option?.type === OPTION_TYPE.CHECKBOX) {
        // 체크박스 타입 - 다중 선택
        const currentValues = prev[optionId] || [];
        if (isChecked) {
          return {
            ...prev,
            [optionId]: [...currentValues, valueId]
          };
        } else {
          return {
            ...prev,
            [optionId]: currentValues.filter(id => id !== valueId)
          };
        }
      } else {
        // 단일 선택 타입
        return {
          ...prev,
          [optionId]: valueId
        };
      }
    });
  };

  const isOptionValueSelected = (optionId, valueId) => {
    const selection = selections[optionId];
    if (Array.isArray(selection)) {
      return selection.includes(valueId);
    }
    return selection === valueId;
  };

  const getOptionValueStock = (option, value) => {
    return value.stock || 0;
  };

  const isOptionValueAvailable = (option, value) => {
    return getOptionValueStock(option, value) > 0;
  };

  if (!options || options.length === 0) {
    return null;
  }

  return (
    <S.OptionsContainer>
      <S.OptionsTitle>
        <Text variant="h4">옵션 선택</Text>
      </S.OptionsTitle>

      {options.map((option) => (
        <S.OptionGroup key={option.id}>
          <S.OptionLabel>
            <Text variant="h5">{option.name}</Text>
            {option.required && <S.RequiredMark>*</S.RequiredMark>}
          </S.OptionLabel>

          <S.OptionValues type={option.type}>
            {option.type === OPTION_TYPE.SELECT && (
              <S.Select
                value={selections[option.id] || ''}
                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                required={option.required}
              >
                <option value="">선택해주세요</option>
                {option.values.map((value) => (
                  <option
                    key={value.id}
                    value={value.id}
                    disabled={!isOptionValueAvailable(option, value)}
                  >
                    {value.name}
                    {value.additionalPrice > 0 && ` (+${value.additionalPrice.toLocaleString()}원)`}
                    {!isOptionValueAvailable(option, value) && ' (품절)'}
                  </option>
                ))}
              </S.Select>
            )}

            {option.type === OPTION_TYPE.RADIO && (
              <S.RadioGroup>
                {option.values.map((value) => (
                  <S.RadioItem key={value.id}>
                    <S.RadioInput
                      type="radio"
                      id={`${option.id}-${value.id}`}
                      name={option.id}
                      value={value.id}
                      checked={isOptionValueSelected(option.id, value.id)}
                      onChange={(e) => handleOptionChange(option.id, e.target.value)}
                      disabled={!isOptionValueAvailable(option, value)}
                    />
                    <S.RadioLabel
                      htmlFor={`${option.id}-${value.id}`}
                      disabled={!isOptionValueAvailable(option, value)}
                    >
                      <S.RadioLabelContent>
                        {value.name}
                        {value.additionalPrice > 0 && (
                          <S.AdditionalPrice>+{value.additionalPrice.toLocaleString()}원</S.AdditionalPrice>
                        )}
                        <S.StockInfo available={isOptionValueAvailable(option, value)}>
                          재고: {getOptionValueStock(option, value)}개
                        </S.StockInfo>
                      </S.RadioLabelContent>
                    </S.RadioLabel>
                  </S.RadioItem>
                ))}
              </S.RadioGroup>
            )}

            {option.type === OPTION_TYPE.CHECKBOX && (
              <S.CheckboxGroup>
                {option.values.map((value) => (
                  <S.CheckboxItem key={value.id}>
                    <S.CheckboxInput
                      type="checkbox"
                      id={`${option.id}-${value.id}`}
                      checked={isOptionValueSelected(option.id, value.id)}
                      onChange={(e) => handleOptionChange(option.id, value.id, e.target.checked)}
                      disabled={!isOptionValueAvailable(option, value)}
                    />
                    <S.CheckboxLabel
                      htmlFor={`${option.id}-${value.id}`}
                      disabled={!isOptionValueAvailable(option, value)}
                    >
                      <S.CheckboxLabelContent>
                        {value.name}
                        {value.additionalPrice > 0 && (
                          <S.AdditionalPrice>+{value.additionalPrice.toLocaleString()}원</S.AdditionalPrice>
                        )}
                        <S.StockInfo available={isOptionValueAvailable(option, value)}>
                          재고: {getOptionValueStock(option, value)}개
                        </S.StockInfo>
                      </S.CheckboxLabelContent>
                    </S.CheckboxLabel>
                  </S.CheckboxItem>
                ))}
              </S.CheckboxGroup>
            )}
          </S.OptionValues>
        </S.OptionGroup>
      ))}

      {totalAdditionalPrice > 0 && (
        <S.PriceSummary>
          <Text variant="body1">
            옵션 추가 금액: <strong>+{totalAdditionalPrice.toLocaleString()}원</strong>
          </Text>
        </S.PriceSummary>
      )}
    </S.OptionsContainer>
  );
};

export default ProductOptionSelector;