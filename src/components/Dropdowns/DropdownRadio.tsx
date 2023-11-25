// Libraries
import React, { ChangeEvent, useEffect, useMemo, useRef } from "react";
import { createPopper, Instance } from "@popperjs/core";
import { NextPage } from "next";

export type TOptions = {
  label?: string;
  value?: string;
};

type TProps = {
  options?: TOptions[];
  value?: string;
  label?: string;
  onChange?: (type: string) => void;
  heightBtn?: string;
  disabled?: boolean;
};

const DropdownRadio: NextPage<TProps> = ({
  options,
  value,
  onChange,
  label,
  heightBtn,
  disabled,
}) => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = useRef<HTMLButtonElement>(null);
  const popoverDropdownRef = useRef<HTMLDivElement>(null);
  const popperInstanceRef = useRef<Instance | null>(null);

  const memoLabel = useMemo(() => {
    const optionSelected = options?.find((opt) => opt.value === value);
    if (optionSelected?.label) {
      return optionSelected?.label;
    }
    return label || "Select a field";
  }, [value, options, label]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        dropdownPopoverShow &&
        popoverDropdownRef.current &&
        !popoverDropdownRef.current.contains(event.target as Node) &&
        !btnDropdownRef.current?.contains(event.target as Node)
      ) {
        setDropdownPopoverShow(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [dropdownPopoverShow]);

  const handleDropdownToggle = () => {
    if (btnDropdownRef.current && popoverDropdownRef.current) {
      createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
        placement: "bottom-start",
        strategy: "fixed",
      });
      setDropdownPopoverShow(true);
    }
  };

  const handleOnchangeRadio = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
    setDropdownPopoverShow(false);
  };

  const onClickLabel = (label: string) => {
    if (onChange) {
      onChange(label);
    }
    setDropdownPopoverShow(false);
  };

  return (
    <>
      <button
        className={
          (heightBtn ? heightBtn : "h-[40px]") +
          ` text-blacks px-3 py-4 w-full lg:py-2 gap-2 md:gap-6 flex items-center rounded-md 
        justify-between border-[1px] border-[#d9d9d9] border-solid text-[14px] font-medium focus:outline-none` +
          (disabled ? " bg-[#eeedf2] text-[#a9a8b3] cursor-not-allowed" : " bg-white")
        }
        ref={btnDropdownRef}
        onClick={handleDropdownToggle}
        disabled={disabled}
      >
        <span className="max-w-[200px] text-left md:max-w-[400px] overflow-hidden text-ellipsis whitespace-nowrap">
          {memoLabel}
        </span>
        <span>
          <i className="fas fa-chevron-down"></i>
        </span>
      </button>
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
        {options?.map((option) => {
          return (
            <div className="mx-2 flex items-center" key={option?.value}>
              <input
                id={option?.value}
                type="radio"
                value={option?.value}
                checked={option?.value === value}
                className="outline-none focus:outline-none border-[1px] rounded-full shadow cursor-pointer border-solid"
                style={{
                  boxShadow: "none",
                  color: "#3659e3",
                  borderColor: "#e7e7e9",
                }}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleOnchangeRadio(e)
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

export default DropdownRadio;
