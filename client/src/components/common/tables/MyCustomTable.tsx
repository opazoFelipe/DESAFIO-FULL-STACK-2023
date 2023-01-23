import React from 'react'
import { Table } from 'react-bootstrap'

interface MyCustomTableProps {
    headers: string[];
    data: any[];
}

export const MyCustomTable = ({ headers, data }: MyCustomTableProps) => {
    return (
        <div>
            {/* <Table responsive="md">
                <thead>
                    <tr>
                        {
                            headers.map((header, index) => {
                                return <th key={index}>{header}</th>
                            })
                        }

                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((row, index) => {
                            return (
                                <tr key={index}>
                                    {
                                        row.map((cell, index) => {
                                            return <td key={index}>{cell}</td>
                                        })
                                    }
                                </tr>
                            )
                        })
                    }

                    <tr>
                        <td>1</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                    </tr>
                </tbody>
            </Table> */}
        </div>
    )
}
