"use client"; 

import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/app/components/Navbar"; 

interface ImageData {
  id: string;
  url: string;
  width: number;
  height: number;
  hashtags: string[];
}

const ALL_AVAILABLE_TAGS = ['nature', 'city', 'tech', 'animal', 'abstract'];

export default function GalleryPage() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10); 
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // ฟังก์ชันสลับ Tag (เพิ่มเข้า/เอาออก)
  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) return prev.filter(t => t !== tag);
      return [...prev, tag];
    });
  };

  // ฟังก์ชันดึงรูปภาพจาก API
  const fetchImages = async (pageNum: number, tagsArray: string[], isNewSearch: boolean) => {
    if (loading) return; 
    setLoading(true);
    
    try {
      const tagsQuery = tagsArray.length > 0 ? `&tags=${tagsArray.join(',')}` : "";
      const url = `/api/images?page=${pageNum}&limit=${limit}${tagsQuery}`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      setImages(prev => {
        if (isNewSearch) return data.images;
        const newImages = data.images.filter(
          (newImg: ImageData) => !prev.some((oldImg) => oldImg.id === newImg.id)
        );
        return [...prev, ...newImages];
      });

      setHasMore(data.nextPage !== null); 

    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🌟 ดึงข้อมูลใหม่ทันทีเมื่อมีการกดเลือก Tag หรือเปลี่ยนจำนวนแสดงผล
  useEffect(() => {
    setImages([]);
    setPage(1);
    fetchImages(1, selectedTags, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTags, limit]);

  // ดึงข้อมูลเมื่อเลื่อนหน้าจอ (Infinite Scroll)
  useEffect(() => {
    if (page > 1) { 
      fetchImages(page, selectedTags, false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // โชว์ปุ่ม Scroll to Top เมื่อเลื่อนลงมา
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1);
        }
      });
      
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-sky-50 pb-20 relative">
      
      {/* 🌟 ส่ง Props ให้ Navbar โดยตรง (แก้บั๊กกดล้างค่าแล้ว) */}
      <Navbar 
        allTags={ALL_AVAILABLE_TAGS}
        selectedTags={selectedTags} 
        onToggleTag={handleToggleTag}
        onClearTags={() => setSelectedTags([])} // ล้างค่า Tag ให้เป็นค่าว่าง
        limit={limit} 
        setLimit={setLimit} 
      />

      <div className="p-4 md:p-8 mt-6 columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 max-w-[1600px] mx-auto">
        {images.map((img, index) => {
          return (
            <div 
              key={`${img.id}-${index}`} 
              className="break-inside-avoid bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-sky-100" 
            >
              <img 
                src={img.url} 
                alt={`Gallery ${img.id}`} 
                className="w-full h-auto object-cover" 
              />
              
              <div className="p-3 flex flex-wrap gap-2 border-t border-sky-50/50">
                {img.hashtags.map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => handleToggleTag(tag)} 
                    className={`text-xs font-medium px-2 py-1 rounded-full transition-colors ${
                      selectedTags.includes(tag) ? 'bg-sky-500 text-white shadow-sm' : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div ref={lastElementRef} className="flex flex-col items-center justify-center py-10 gap-4">
        {loading && (
          <div className="flex items-center gap-2 text-sky-600 font-medium animate-pulse">
            <div className="w-5 h-5 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            กำลังโหลดรูปภาพเพิ่มเติม...
          </div>
        )}

        {!loading && hasMore && images.length >= limit && (
          <div className="text-sky-700 bg-sky-100 px-6 py-2 rounded-full text-sm font-semibold shadow-sm border border-sky-200 animate-bounce">
            เลื่อนลงเพื่อโหลดภาพชุดต่อไป (ทีละ {limit} รูป)
          </div>
        )}

        {!loading && !hasMore && images.length > 0 && (
          <div className="text-gray-400 text-sm font-medium">
            แสดงรูปภาพครบทั้งหมดแล้ว ({images.length} รูป)
          </div>
        )}
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-sky-500 text-white rounded-full shadow-lg hover:bg-sky-600 hover:-translate-y-1 transition-all duration-300"
          aria-label="Scroll to top"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </main>
  );
}