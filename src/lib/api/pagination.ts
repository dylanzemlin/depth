export type PaginationProps = {
    nextUrl?: string;
    prevUrl?: string;
    total: number;
    current: number;
    pageSize: number;
};

export type Pagination<T> = {
    data: T;
    pagination: PaginationProps;
};