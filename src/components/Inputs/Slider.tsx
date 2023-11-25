// Libraries
import { NextPage } from "next";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";

// Hooks
import { useDebounce } from "@/hooks";

type TProps = {
    min: number;
    max: number;
    minValue: number;
    maxValue: number;
    onChange: (selectedRange: [number, number]) => void;
};
export const Slider: NextPage<TProps> = ({ min, max, minValue, maxValue, onChange }) => {
  const [minVal, setMinVal] = useState(minValue);
  const [maxVal, setMaxVal] = useState(maxValue);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const rangeRef = useRef<null | HTMLInputElement>(null);
  const parentRef = useRef<null | HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState<number | null>(null)
  const debounceMinVal = useDebounce(minVal, 300)
  const debounceMaxVal = useDebounce(maxVal, 300)

  const getPercent = (value:any) => {
    return Math.round(((value - min) / (max - min)) * 100)
  }
    
  useLayoutEffect(() => {
    setMinVal(minValue)
  }, [minValue])

  useLayoutEffect(() => {
    setMaxVal(maxValue)
  }, [maxValue])

  useEffect(() => {
    if(onChange) {
      onChange([debounceMinVal, debounceMaxVal])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceMinVal,debounceMaxVal])

  useEffect(() => {
    const updateContainerWidth = () => {
      if (parentRef.current) {
        const width = parentRef.current.clientWidth;
        setContainerWidth(width);
      }
    };

    updateContainerWidth()

    window.addEventListener('resize', updateContainerWidth);

    return () => {
      window.removeEventListener('resize', updateContainerWidth);
    };
  }, [parentRef]);
  
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);
    if (rangeRef.current) {
      rangeRef.current.style.left = `${minPercent}%`;
      rangeRef.current.style.width = `${maxPercent - minPercent}%`;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minVal]);
  
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);
    if (rangeRef.current) {
      rangeRef.current.style.width = `${maxPercent - minPercent}%`;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxVal]);

  return (
    <div className="w-full" ref={parentRef}>
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal);
          setMinVal(value);
          minValRef.current = value;
        }}
        className="thumb focus:outline-none pointer-events-none absolute h-[0px] z-[3]"
        style={{ 
          zIndex: minVal > max - 100 ? "5" : '3',
          width: containerWidth ? containerWidth: '100%'
        }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal);
          setMaxVal(value);
          maxValRef.current = value;
        }}
        className="thumb focus:outline-none pointer-events-none absolute h-[0px] z-[4]"
        style={{
          width: containerWidth ? containerWidth: '100%'
        }}
      />

      <div className="relative ml-[2px]" style={{
        width: `calc(${containerWidth}px - 5px)`
      }}>
        <div className="slider__track" />
        <div ref={rangeRef} className="slider__range" />
      </div>
    </div>
  );
};
