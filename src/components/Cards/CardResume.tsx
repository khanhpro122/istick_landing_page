// Libraries
import { NextPage } from "next";
import React, {useState} from "react";
import Image from "next/image";

// Hooks
import { Button } from "../Buttons/Button";
import { formatStringToDate } from "@/utils";
import { useRouter } from "next/router";

// Services
import * as ServiceSystem from '@/services/system'

type TProps = {
  avatar: string;
  lastName: string;
  firstName: string;
  position: string;
  cvUrl: string;
  createdAt: string;
  location: string;
};
export const CardResume: NextPage<TProps> = ({
  avatar,
  lastName,
  firstName,
  position,
  cvUrl,
  createdAt,
  location,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)

  const handleReviewResume = () => {
    window.open(`/hiring/resume/review/${encodeURIComponent(cvUrl)}`);
  };
  const handleDownLoadCV = () => {
    if (cvUrl) {
      setIsLoading(true)
      ServiceSystem.preSignedFile({list: [
        {
          durationTimeInSecond: 60 * 1000 * 5,
          filePath: cvUrl
        }
      ]}).then((res) => {
        setIsLoading(false)
        const link = document.createElement("a");
        link.href = res?.data?.urls?.[0];
        link.download = "file.pdf";
        link.dispatchEvent(new MouseEvent("click"));
      }).catch(() => {
        setIsLoading(false)
      })
      
    }
  };
  return (
    <div className="w-full border-[#e7e7e9] border-[1px] rounded-xl p-4 md:p-6 lg:p-8">
      <div className="flex items-center">
        <Image
          src={avatar || "/img/profile.png"}
          alt="profile"
          placeholder="blur"
          blurDataURL={"@/public/img/placeholder.png"}
          className="align-middle border-none max-w-full mr-2 w-[50px] object-cover max-h-[x] rounded-[50%] h-[50px]"
          width={0}
          height={0}
          sizes="100vw"
        />
        <div className="flex flex-col w-full items-start">
          <div className="flex flex-col items-start md:flex-row md:items-center justify-between w-full">
            <div className="text-[16px] text-black font-bold text-center mb-2">
              {position}
            </div>
            <div className="text-[14px] text-[#313541] font-bold text-center mb-2">
              {location}
            </div>
          </div>
          <div className="flex flex-col items-start md:flex-row md:items-center justify-between w-full">
            <div className="text-[14px] text-[#6f7287] font-medium text-center mb-2">
              {firstName} {lastName}
            </div>
            <div className="text-[14px] text-[#313541] font-medium text-center mb-2">
              {formatStringToDate(createdAt, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-4">
        <Button
          textBtn="Review CV"
          onClick={handleReviewResume}
          classBtn="h-auto w-[100%] md:w-auto outline-[none] border-none focus:outline-none bg-[#2b6fdf] text-white font-medium rounded-md py-2 px-12"
        />
        <Button
          textBtn="Download CV"
          onClick={handleDownLoadCV}
          classBtn="h-auto w-[100%] md:w-auto outline-[none] border-none focus:outline-none bg-[#2b6fdf] text-white font-medium rounded-md py-2 px-12"
        />
      </div>
    </div>
  );
};
