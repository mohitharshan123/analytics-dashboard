import {
    Table as TremorTable,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    Button,
    Text
} from "@tremor/react";
import { useState } from "react";
import Modal from "./Modal";
import { AnalyticsData } from "hooks/useAnalyticsApi";

export type RequestOrResponseObject = {
    type: "request" | "response", data: string
}

type TableProps = {
    data?: AnalyticsData,
}

const Table: React.FC<TableProps> = ({ data }) => {
    const [selectedObject, setSelectedObject] = useState<RequestOrResponseObject | null>(null);

    return <> <div>
        <TremorTable className="mt-5">
            <TableHead>
                <TableRow>
                    <TableHeaderCell>User ID</TableHeaderCell>
                    <TableHeaderCell>Timestamp</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Error message</TableHeaderCell>
                    <TableHeaderCell>Request</TableHeaderCell>
                    <TableHeaderCell>Response</TableHeaderCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data?.data?.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell>{item.user_id}</TableCell>
                        <TableCell>{new Date(parseInt(item.timestamp)).toUTCString()}</TableCell>
                        <TableCell>
                            <Text>{item.status}</Text>
                        </TableCell>
                        <TableCell>
                            <Text>{item.error_message}</Text>
                        </TableCell>
                        <TableCell>
                            <Button variant="light" onClick={() => setSelectedObject({ type: "request", data: item.request })} size="xs">View</Button>
                        </TableCell>
                        <TableCell>
                            <Button variant="light" onClick={() => setSelectedObject({ type: "response", data: item.response })} size="xs">View</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </TremorTable>

           </div>
        <Modal {...{ selectedObject, setSelectedObject }} />
    </>

}

export default Table;