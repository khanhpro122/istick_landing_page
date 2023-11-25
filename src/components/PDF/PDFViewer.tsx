import React, { useEffect, useRef } from "react";
import "pdfjs-dist/build/pdf.worker.js";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.js";
import { NextPage } from "next";

interface PDFViewerProps {
  pdfUrl: string;
}

const PDFViewer: NextPage<PDFViewerProps> = ({ pdfUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const loadPdf = async () => {
      try {
        const pdfDocument = await pdfjs.getDocument(pdfUrl).promise;
        const page = await pdfDocument.getPage(1);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const viewport = page.getViewport({ scale: 1.0 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        if (context) {
          page.render({ canvasContext: context, viewport: viewport });
        }
        containerRef?.current?.appendChild(canvas);
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    loadPdf();
  }, [pdfUrl]);

  return (
    <div className="flex justify-center py-4 max-w-[100vw]">
      <div ref={containerRef}></div>
    </div>
  )
};

export default PDFViewer;
