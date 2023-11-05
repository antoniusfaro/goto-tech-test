import { css } from '@emotion/css'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import useDebounce from '../../hooks/useDebounce'
import Input from '../atoms/CustomInput'
import styled from '@emotion/styled'
import Container from '../atoms/Container'

const SearchInput = () => {
  const [searchParam, setSearchParams] = useSearchParams();
  const search = searchParam.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(search);
  const finalSearchQuery = useDebounce(searchQuery, 500);

  const handleSearch = (value: string) => {
    searchParam.set("search", value);
    if (value === "") searchParam.delete("search");
    searchParam.delete("page");
    setSearchParams(searchParam);
  }

  const handleSearchChange = (e: any) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    handleSearch(finalSearchQuery);
  }, [finalSearchQuery]);

  return (
    <SearchInputStyled>
      <Input
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchChange}
        className={css({ marginBottom: "1rem" })}
      />
    </SearchInputStyled>
  )
};

export default SearchInput

const SearchInputStyled = styled(Container)`
  margin-top: 1rem;
  position: sticky;
`;
