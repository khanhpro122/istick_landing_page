// Libraries
import React, { ChangeEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPopper, Instance } from "@popperjs/core";
import { NextPage } from "next";

// Components
import { InputSearch } from "../Inputs/InputSearch";

// Utils
import { getLabelByValue } from "@/utils";

// Hooks
import { useUpdateEffect } from "@/hooks";

export type TOptions = {
  label?: string;
  value?: string;
};

type TProps = {
  options?: TOptions[];
  value?: string[];
  label?: string;
  onChange?: (type: string[]) => void;
  heightBtn?: string;
  isShowSearch?: boolean;
  errorText?: string;
  handleAddNewOption?: (type: string, value: string) => void;
  type?: string;
  handleBlur?: () => void
};

const DropdownCheckbox: NextPage<TProps> = ({
  options,
  value,
  onChange,
  label,
  heightBtn,
  isShowSearch,
  errorText,
  handleAddNewOption,
  type,
  handleBlur
}) => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = useRef<HTMLButtonElement>(null);
  const popoverDropdownRef = useRef<HTMLDivElement>(null);
  const childRefs = useRef<HTMLSpanElement[] | any>([]);
  const btnMoreRef = useRef<HTMLSpanElement>(null);
  const [visibleItems, setVisibleItems] = React.useState<any[]>([]);
  const [childRefsState, setChildRefsState] = React.useState<any>({});
  const [isFocused, setIsFocused] = React.useState(false);
  const [search, setSearch] = useState("");
  const isRendered = useRef(false)
  
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        dropdownPopoverShow &&
        popoverDropdownRef.current &&
        !popoverDropdownRef.current.contains(event.target as Node) &&
        !btnDropdownRef.current?.contains(event.target as Node)
      ) {
        setDropdownPopoverShow(false);
        if(handleBlur) {
          handleBlur()
        }
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdownPopoverShow]);

  useUpdateEffect(() => {
    if (!dropdownPopoverShow) {
      setIsFocused(true);
    }
  }, [dropdownPopoverShow]);

  useEffect(() => {
    if(!isRendered.current) {
      const timeOut = setTimeout(() => {
        const newWidthChilds: any = {};
        value?.forEach((itemId: string) => {
          if (childRefs.current[itemId]?.offsetWidth) {
            newWidthChilds[itemId] = childRefs.current[itemId]?.offsetWidth;
          }
        });
        setChildRefsState(newWidthChilds);
        isRendered.current = true
      }, 300)
      return  () => {
        clearTimeout(timeOut)
      }
    }
  }, [value])

  useEffect(() => {
    if(isRendered.current) {
      const newWidthChilds: any = {};
      value?.forEach((itemId: string) => {
        if (childRefs.current[itemId]?.offsetWidth) {
          newWidthChilds[itemId] = childRefs.current[itemId]?.offsetWidth;
        }
      });
      setChildRefsState(newWidthChilds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    const handleResize = () => {
      const btnMoreWidth = btnMoreRef.current?.offsetWidth ?? 0;
      const containerWidth = btnDropdownRef.current?.offsetWidth
        ? btnDropdownRef.current?.offsetWidth - 60 - btnMoreWidth
        : 0;

      let totalWidth = 0;
      const newVisibleItems: React.SetStateAction<any[]> = [];
      childRefsState &&
        Object.keys(childRefsState)?.forEach((id) => {
          totalWidth += childRefsState[id] ?? 0;
          if (totalWidth <= containerWidth) {
            newVisibleItems.push(id);
          } else {
            return;
          }
        });
      setVisibleItems(newVisibleItems);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [childRefsState]);

  const handleDropdownToggle = () => {
    if (btnDropdownRef.current && popoverDropdownRef.current) {
      createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
        placement: "bottom-start",
        strategy: "fixed",
      });
      setDropdownPopoverShow(true);
    }
  };

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    if (value?.includes(e.target.value)) {
      const filterSelected = value?.filter((item) => item !== e.target.value);
      onChange && onChange(filterSelected);
    } else {
      if (value && onChange) {
        onChange([...value, e.target.value]);
      }
    }
  };

  const onClickLabel = (val: string) => {
    if (value?.includes(val)) {
      const filterSelected = value?.filter((item: string) => item !== val);
      onChange && onChange(filterSelected);
    } else {
      if (value && onChange) {
        onChange([...value, val]);
      }
    }
  };

  const onHandleAddOption = (value: string) => {
    if (value && handleAddNewOption && type) {
      handleAddNewOption(type, value);
      setSearch("");
    }
  };

  const deleteOption = (val: string) => {
    if (value?.includes(val) && onChange) {
      const filterSelected = value?.filter((item) => item !== val);
      onChange(filterSelected);
    }
  };

  return (
    <>
      <button
        className={
          (heightBtn ? heightBtn : "h-[40px]") +
          ` text-blacks px-3 py-4 w-full lg:py-2 flex items-center rounded-md bg-white
        justify-between border-[1px] border-[#d9d9d9] border-solid text-[14px] font-medium focus:outline-none`
        }
        ref={btnDropdownRef}
        onClick={handleDropdownToggle}
        style={{
          border: isFocused && errorText ? "2px solid red" : "",
        }}
      >
        {value?.length ? (
          <div className="flex gap-1 items-center">
            {value?.map((val) => {
              return (
                <span
                  key={val}
                  id={val}
                  ref={(el) => (childRefs.current[val] = el)}
                  className={
                    `max-w-[200px]  text-left md:max-w-[400px] border-[#2b6fdf] border-solid border-[1px] 
                    overflow-hidden text-ellipsis whitespace-nowrap bg-[#e5eeff] px-2 py-1 rounded-[4px]` +
                    (!visibleItems?.includes(val)
                      ? " fixed top-0 visible"
                      : " static")
                  }
                >
                  <span>{getLabelByValue(val, options)}</span>
                  <span onClick={() => deleteOption(val)}>
                    {" "}
                    <i className="fas fa-times"></i>
                  </span>
                </span>
              );
            })}
            <span ref={btnMoreRef}>
              {value?.length > visibleItems.length &&
                visibleItems.length > 0 && (
                <span className="max-w-[100px] text-left border-[#2b6fdf] border-solid border-[1px] overflow-hidden text-ellipsis whitespace-nowrap bg-[#e5eeff] px-2 py-1 rounded-[4px]">
                    + {value?.length - visibleItems.length}
                </span>
              )}
            </span>
          </div>
        ) : (
          <span className="max-w-[200px] text-left md:max-w-[400px] overflow-hidden text-ellipsis whitespace-nowrap">
            {label}
          </span>
        )}
        <span>
          <i className="fas fa-chevron-down"></i>
        </span>
      </button>
      {isFocused && <div className="text-[red] text-[12px]">{errorText}</div>}
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "text-base z-50 float-left py-2 list-none text-left border-solid rounded-md border-[1px] shadow-lg bg-white border-l-[#d9d9d9] border-r-[#d9d9d9] border-b-[#d9d9d9]"
        }
        style={{
          width: btnDropdownRef.current
            ? btnDropdownRef.current.clientWidth
            : "300px",
        }}
      >
        {isShowSearch && (
          <div className="w-full px-2">
            <InputSearch
              placeholder="Search..."
              className={
                "border-none outline-none focus:border-none focus:outline-none py-2 bg-white ease-linear transition-all duration-150"
              }
              classIcon="text-black cursor-pointer"
              isFull
              value={search}
              onChange={(value) => setSearch(value)}
              borderColorSearch="#d9d9d9"
              onHandleAddOption={onHandleAddOption}
              isAdd
            />
          </div>
        )}
        {options
          ?.filter((opt) => {
            if (search === "") {
              return opt;
            } else if (
              opt?.label?.toLowerCase()?.includes(search?.toLowerCase())
            ) {
              return opt;
            }
          })
          ?.map((option) => {
            return (
              <div className="mx-2 flex items-center" key={option?.value}>
                <input
                  id={option?.value}
                  type="checkbox"
                  value={option?.value}
                  checked={value?.includes(option?.value || "")}
                  className="h-5 w-5 outline-none focus:outline-none border-[1px] shadow cursor-pointer border-solid"
                  style={{
                    boxShadow: "none",
                    borderRadius: "4px",
                    color: "#3659e3",
                    borderColor: "#e7e7e9",
                  }}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleCheckbox(e)
                  }
                />
                <label
                  onClick={() => onClickLabel(option?.value || "")}
                  className={
                    "text-sm text-black cursor-pointer py-2 px-2 font-normal block w-full whitespace-nowrap"
                  }
                >
                  {option?.label}
                </label>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default DropdownCheckbox;
