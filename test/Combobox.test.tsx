/**
 * Combobox search contract: onSearchChange surfaces the raw typed text
 * (consumers drive server-side searches from it) and filtering is
 * case/accent/punctuation-insensitive, so masked documents match raw values
 * and accented names match unaccented keyboards.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Combobox } from '../src/react/Combobox/Combobox';

const options = [
  {
    value: '1',
    label: 'Bulk MX Test 350',
    meta: 'CURP BULK00000350HMCSSS35',
    searchText: 'Bulk MX Test 350 BULK00000350HMCSSS35 bulk350@mx-test.local',
  },
  {
    value: '2',
    label: 'Grupo Patagonia Capital S.A.',
    meta: 'RUT 14.076.338-1',
    searchText: 'Grupo Patagonia Capital S.A. 14076338-1',
  },
  {
    value: '3',
    label: 'José María Álvarez',
    meta: 'CPF 123.456.789-00',
    searchText: 'José María Álvarez 12345678900',
  },
];

function openAndType(query: string) {
  const onSearchChange = jest.fn();
  render(
    <Combobox
      searchable
      options={options}
      value={null}
      onSearchChange={onSearchChange}
      onChange={() => {}}
    />,
  );
  fireEvent.click(screen.getByRole('button'));
  fireEvent.change(screen.getByRole('textbox'), { target: { value: query } });
  return { onSearchChange };
}

const optionLabels = () =>
  Array.from(
    document.querySelectorAll('.combobox-option .combobox-option-label'),
  ).map((el) => el.textContent);

describe('Combobox searchable', () => {
  it('notifies onSearchChange with the raw typed text', () => {
    const { onSearchChange } = openAndType('Bulk 350');
    expect(onSearchChange).toHaveBeenCalledWith('Bulk 350');
  });

  it('matches plain name substrings', () => {
    openAndType('Bulk MX Test 350');
    expect(optionLabels()).toEqual(['Bulk MX Test 350']);
  });

  it('matches masked documents against raw values', () => {
    openAndType('123.456.789-00');
    expect(optionLabels()).toEqual(['José María Álvarez']);
  });

  it('matches partial digits of a raw document', () => {
    openAndType('1407633');
    expect(optionLabels()).toEqual(['Grupo Patagonia Capital S.A.']);
  });

  it('matches accented names from an unaccented keyboard', () => {
    openAndType('jose maria');
    expect(optionLabels()).toEqual(['José María Álvarez']);
  });
});
