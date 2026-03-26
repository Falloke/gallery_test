interface NavbarProps {
  selectedTags: string[];
  onRemoveTag: (tag: string) => void;
  onClearTags: () => void;
  limit: number;
  setLimit: (limit: number) => void;
}

export default function Navbar({ selectedTags, onRemoveTag, onClearTags, limit, setLimit }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-sky-100 shadow-sm px-4 md:px-8 py-3 flex flex-col md:flex-row justify-between items-center gap-4 transition-all">
      <div className="text-xl font-bold text-sky-700 whitespace-nowrap">
        Gallery
      </div>

      <div className="flex-1 w-full max-w-2xl flex items-center justify-center">
        <div className="flex items-center gap-2 bg-sky-50/50 border border-sky-200 rounded-full px-4 py-2 w-full min-h-[44px]">
          <span className="text-sm text-sky-600 font-medium">Filter:</span>
          
          <div className="flex flex-wrap gap-2 flex-1 items-center">
            {selectedTags.length === 0 && (
              <span className="text-sm text-gray-400 italic">เลือก Hashtag จากรูปภาพ</span>
            )}
            
            {selectedTags.map(tag => (
              <span 
                key={tag} 
                className="bg-sky-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1 animate-fade-in"
              >
                #{tag}
                <button 
                  onClick={() => onRemoveTag(tag)}
                  className="hover:bg-sky-600 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          {selectedTags.length > 0 && (
            <button 
              onClick={onClearTags}
              className="text-xs text-red-400 hover:text-red-500 hover:underline transition-colors whitespace-nowrap pl-2 border-l border-sky-200"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
        <label htmlFor="limit-select" className="font-medium">แสดงรูปทีละ:</label>
        <select 
          id="limit-select"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="bg-white border border-sky-200 text-sky-700 rounded-md px-2 py-1 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 cursor-pointer font-medium"
        >
          {/* ตัวเลือกสำหรับกำหนด Chunk Size (ดึงทีละกี่รูป) */}
          <option value={10}>10 รูป</option>
          <option value={20}>20 รูป</option>
          <option value={30}>30 รูป</option>
          <option value={50}>ทั้งหมด</option>
        </select>
      </div>
    </nav>
  );
}