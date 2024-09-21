import { gql } from "@apollo/client";

const PagerFragment = gql`
  fragment Pager on Pager {
    totalItems
    currentPage
    pageSize
    totalPages
    startPage
    endPage
    startIndex
    endIndex
    pages
  }
`;
