"use client";

interface NavbarProps {
  allTags: string[]; 
  selectedTags: string[];
  onToggleTag: (tag: string) => void; 
  onClearTags: () => void;
  limit: number;
  setLimit: (limit: number) => void;
}

export default function Navbar({ 
  allTags, 
  selectedTags, 
  onToggleTag, 
  onClearTags, 
  limit, 
  setLimit
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-sm px-4 md:px-8 py-3 transition-all">
      
      {/* 🌟 รวมทุกอย่างไว้ในแถวเดียว (บนหน้าจอคอม) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full max-w-[1600px] mx-auto">
        
        {/* 1. ซ้ายสุด: โลโก้ (ใช้ shrink-0 เพื่อไม่ให้โดนบีบ) */}
        <div className="text-2xl font-black text-sky-700 whitespace-nowrap tracking-tight shrink-0">
          Gallery
        </div>

        {/* 2. ตรงกลาง: คำสำคัญทั้งหมด (ใช้ flex-1 เพื่อให้ขยายเต็มพื้นที่ตรงกลาง) */}
        <div className="flex-1 flex justify-center items-center gap-3 w-full min-w-0">
          <span className="text-sm font-bold text-sky-700 whitespace-nowrap hidden lg:block">
            🔥 คำสำคัญ:
          </span>
          
          <div className="flex overflow-x-auto no-scrollbar items-center gap-2 pb-1">
            {allTags.map(tag => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => onToggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                    isSelected 
                      ? 'bg-sky-500 text-white border-sky-500 shadow-sm scale-105' 
                      : 'bg-white text-sky-600 border-sky-200 hover:bg-sky-50 hover:border-sky-300'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}

            {/* ปุ่ม ล้างค่า */}
            {selectedTags.length > 0 && (
              <button 
                onClick={onClearTags}
                className="text-xs font-bold text-red-500 hover:text-red-600 px-3 py-1 ml-1 border-l border-sky-200 transition-colors whitespace-nowrap"
              >
                ล้างค่า ({selectedTags.length})
              </button>
            )}
          </div>
        </div>

        {/* 3. ขวาสุด: ตัวเลือกแสดงรูป (Limit) */}
        <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-100 shrink-0">
          <label htmlFor="limit-select" className="font-medium text-sky-700">แสดงทีละ:</label>
          <select 
            id="limit-select"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="bg-transparent text-sky-700 outline-none cursor-pointer font-bold"
          >
            <option value={10}>10 รูป</option>
            <option value={20}>20 รูป</option>
            <option value={30}>30 รูป</option>
            <option value={50}>ทั้งหมด</option>
          </select>
        </div>

      </div>
    </nav>
  );
}