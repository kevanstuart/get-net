interface PageUrl {
  link: string
}

export interface Pagination {
  current?: PageUrl
  next?: PageUrl
  prev?: PageUrl
}