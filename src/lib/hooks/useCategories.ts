import { Category } from "@prisma/client";
import { useEffect, useState } from "react";
import { PaginationProps } from "../api/pagination";

type UseCategoryProps = {
    page?: number;
    pageSize?: number;
    filter?: {
        search?: string;
        archived?: boolean;
    }
}

type UseCategoryReturn = {
    categories?: Category[];
    pagination?: PaginationProps;
    loading: boolean;
}

export default function useCategories(props?: UseCategoryProps): UseCategoryReturn {
    const [categories, setCategories] = useState<Category[]>([]);
    const [pagination, setPagination] = useState<PaginationProps>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            const params = new URLSearchParams();
            if (props?.page) {
                params.append("page", props.page.toString());
            }

            if (props?.pageSize) {
                params.append("pageSize", props.pageSize.toString());
            }

            if (props?.filter) {
                if (props.filter.search) {
                    params.append("search", props.filter.search);
                }

                if (props.filter.archived != undefined) {
                    params.append("archived", props.filter.archived.toString());
                }
            }

            const response = await fetch(`/api/v1/category/list?${params.toString()}`);
            const data = await response.json();
            setCategories(data.data);
            setPagination(data.pagination);
            setLoading(false);
        };

        fetchCategories();
    }, [props?.page, props?.filter?.archived, props?.filter?.search, props?.pageSize]);

    return {
        categories,
        pagination,
        loading
    };
}