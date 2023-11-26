
import { Pagination as Paginator } from "react-headless-pagination";
import { PAGE_SIZE } from "pages/Dashboard";
import { Button } from "@tremor/react";
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "@heroicons/react/24/solid";

type PaginationProps = {
    page: number,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    totalCount: number
}

const Pagination: React.FC<PaginationProps> = ({ page, setPage, totalCount }) =>
    <div className="fixed bottom-0 left-0 w-full bg-transparent p-4">
        <Paginator
            currentPage={page}
            setCurrentPage={setPage}
            className="flex justify-center items-center space-x-4 mt-10"
            truncableText="..."
            truncableClassName="text-gray-500"
            totalPages={Math.ceil((totalCount / PAGE_SIZE))}
            edgePageCount={2}
            middlePagesSiblingCount={2}
        >
            <Paginator.PrevButton className="bg-transparent">
                <Button icon={ArrowLeftCircleIcon} variant="light">Previous</Button>
            </Paginator.PrevButton>
            <nav className="flex justify-center flex-grow">
                <ul className="flex items-center space-x-2">
                    <Paginator.PageButton
                        activeClassName="bg-blue-500 text-white px-3 py-1 rounded"
                        inactiveClassName="text-gray-700 px-3 py-1 rounded"
                        className="hover:bg-blue-200 transition duration-300 cursor-pointer"
                    />
                </ul>
            </nav>
            <Paginator.NextButton className="bg-transparent">
                <Button icon={ArrowRightCircleIcon} variant="light">Next</Button>
            </Paginator.NextButton>
        </Paginator>
    </div>

export default Pagination