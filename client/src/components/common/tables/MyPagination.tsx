import React, { useState, useEffect } from "react";
import Pagination from "react-bootstrap/Pagination";
import { toToastItem } from "react-toastify/dist/utils";

interface Props {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    setCurrentPage: (currentPage: number) => void;
}

export const MyPagination = (props: Props) => {
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        if (props.totalItems === 0) return;

        setTotalPages(Math.ceil(props.totalItems / props.itemsPerPage));
    }, [props.totalItems, props.itemsPerPage]);

    if (props.totalItems === 0) return null;

    return (
        <Pagination>
            {
                totalPages > 1 && (
                    <Pagination.Prev
                        onClick={() => {
                            const tmp = props.currentPage - 1;

                            if (tmp < 1) {
                                props.setCurrentPage(1);
                            } else if (tmp > totalPages) {
                                props.setCurrentPage(totalPages);
                            } else {
                                props.setCurrentPage(tmp);
                            }
                        }}
                    />
                )
            }
            {
                [...Array(totalPages)].map((_, index) =>
                    <Pagination.Item
                        key={index}
                        active={(index + 1) === props.currentPage}
                        onClick={() => props.setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                )

            }
            {
                totalPages > 1 && (
                    <Pagination.Next
                        onClick={() => {
                            const tmp = props.currentPage + 1;

                            if (tmp > totalPages) {
                                props.setCurrentPage(totalPages);
                            } else if (tmp < 1) {
                                props.setCurrentPage(1);
                            } else {
                                props.setCurrentPage(tmp);
                            }
                        }}
                    />
                )
            }
        </Pagination>
    );
};

// onClick={() => {
//     if (props.currentPage < 1) {
//         props.setCurrentPage(1);
//     } else if (props.currentPage > totalPages) {
//         props.setCurrentPage(totalPages);
//     } else {
//         props.setCurrentPage(props.currentPage);
//     }
// }}
