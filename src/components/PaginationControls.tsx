interface PaginationControlsProps { 
  offset: number;
  setOffset: (offset: number) => void;
  page: number;
  limit: number;
}

export default function PaginationControls({ offset, setOffset, page, limit }: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <button
        onClick={() => {
          if (offset > 0) {
            setOffset(offset - limit);
          }
        }}
        className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
        disabled={offset === 0}
      >
        Previous
      </button>
      <div className="flex items-center space-x-2">
        <span className="dark:text-gray-200">Page</span>
        <input
          type="number"
          min="1"
          max={Math.ceil(page)}
          value={Math.floor(offset / limit) + 1}
          onChange={(e) => {
            const pageNum = parseInt(e.target.value);
            if (pageNum >= 1 && pageNum <= Math.ceil(page)) {
              setOffset((pageNum - 1) * limit);
            }
          }}
          className="w-16 px-2 py-1 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
        />
        <span className="dark:text-gray-200">of {Math.ceil(page)}</span>
      </div>
      <button
        onClick={() => {
          if (offset + limit < page * limit) {
            setOffset(offset + limit);
          }
        }}
        className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
        disabled={offset + limit >= page * limit}
      >
        Next
      </button>
    </div>
  );
}
