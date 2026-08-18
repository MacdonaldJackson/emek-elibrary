"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// react-pageflip touches `window` on import, so it must be loaded client-only.
const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false });

export type ReaderPage = {
    id: string;
    pageNumber: number;
    imageUrl: string | null;
    textContent: string | null;
};

function Page({ page }: { page: ReaderPage }) {
    return (
          <div className="page bg-parchment-50 border border-parchment-200 flex flex-col">
                <div className="flex-1 overflow-y-auto p-8 md:p-10">
                  {page.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={page.imageUrl} alt={`Page ${page.pageNumber}`} className="w-full h-auto" />
                    ) : (
                      <p className="font-serif text-valley-900 leading-relaxed whitespace-pre-wrap">
                        {page.textContent}
                      </p>p>
                        )}
                </div>div>
                <div className="text-center text-xs text-valley-700/60 pb-3">{page.pageNumber}</div>div>
          </div>div>
        );
}

export default function PageFlipReader({
    bookId,
    pages,
    startPage,
}: {
    bookId: string;
    pages: ReaderPage[];
    startPage: number;
}) {
    const bookRef = useRef<any>(null);
    const [currentPage, setCurrentPage] = useState(startPage);
    const saveTimeout = useRef<ReturnType<typeof setTimeout>>();
  
    const saveProgress = useCallback(
          (pageNumber: number) => {
                  if (saveTimeout.current) clearTimeout(saveTimeout.current);
                  saveTimeout.current = setTimeout(() => {
                            fetch("/api/progress", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ bookId, lastPage: pageNumber }),
                            }).catch(() => {
                                        // Reading progress is best-effort; a failed save shouldn't
                                        // interrupt reading.
                            });
                  }, 600);
          },
          [bookId]
        );
  
    const handleFlip = useCallback(
          (e: { data: number }) => {
                  const pageNumber = e.data + 1;
                  setCurrentPage(pageNumber);
                  saveProgress(pageNumber);
          },
          [saveProgress]
        );
  
    useEffect(() => {
          return () => {
                  if (saveTimeout.current) clearTimeout(saveTimeout.current);
          };
    }, []);
  
    function goPrev() {
          bookRef.current?.pageFlip()?.flipPrev();
    }
    function goNext() {
          bookRef.current?.pageFlip()?.flipNext();
    }
  
    return (
          <div className="flex flex-col items-center gap-4">
                <div className="w-full flex justify-center">
                        <HTMLFlipBook
                                    key={bookId}
                                    ref={bookRef}
                                    className="shadow-2xl"
                                    style={{}}
                                    width={420}
                                    height={594}
                                    size="stretch"
                                    minWidth={280}
                                    maxWidth={600}
                                    minHeight={400}
                                    maxHeight={850}
                                    startPage={Math.max(0, startPage - 1)}
                                    drawShadow
                                    flippingTime={600}
                                    usePortrait
                                    startZIndex={0}
                                    autoSize
                                    maxShadowOpacity={0.5}
                                    showCover={true}
                                    mobileScrollSupport
                                    clickEventForward
                                    useMouseEvents
                                    swipeDistance={30}
                                    showPageCorners
                                    disableFlipByClick={false}
                                    onFlip={handleFlip}
                                  >
                          {pages.map((page) => (
                                                <Page key={page.id} page={page} />
                                              ))}
                        </HTMLFlipBook>HTMLFlipBook>
                </div>div>
          
                <div className="flex items-center gap-6">
                        <button onClick={goPrev} className="btn-secondary" aria-label="Previous page">
                                  ← Previous
                        </button>button>
                        <span className="text-sm text-valley-700/80">
                                  Page {currentPage} of {pages.length}
                        </span>span>
                        <button onClick={goNext} className="btn-secondary" aria-label="Next page">
                                  Next →
                        </button>button>
                </div>div>
          </div>div>
        );
}
</div>
