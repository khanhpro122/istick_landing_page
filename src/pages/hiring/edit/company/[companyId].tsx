// Libraries
import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";

// Services
import * as ServiceCompany from "@/services/company";

// Utils
import { useRouter } from "next/router";
import Navbar from "@/components/Navbars/IndexNavbar";
import { Loading } from "@/components/Loading/Loading";
import Footer from "@/components/Footers/Footer";
import { Button } from "@/components/Buttons/Button";
import { FormCompany } from "@/components/Forms/FormCompany";
import Head from "next/head";

type TProps = {
  item: any;
};
const Index: NextPage<TProps> = ({ item }) => {
  const [stateForm, setStateForm] = useState({
    avatar: null,
    culture: "",
    companyTypes: [],
    overview: "",
    description: "",
    country: "",
    workingDays: "",
    website: "",
    name: "",
    companyAddresses: [],
    companySizeFrom: "",
    companySizeTo: "",
  });

  const router = useRouter();

  const queryClient = useQueryClient();

  // fetch api

  const fetchUpdateInfoCompany = async (data: any) => {
    const response = await ServiceCompany.updateCompany(item?.id || "", data);
    return response.data;
  };

  const mutationUpdateCompany = useMutation(
    ["updateCompany"],
    fetchUpdateInfoCompany
  );
  const { isLoading } = mutationUpdateCompany;

  const handleOnchangePostForm = (type: string, value: any) => {
    setStateForm({
      ...stateForm,
      [type]: value,
    });
  };
  
  const handleUpdateCompany = () => {
    mutationUpdateCompany.mutate(
      { ...stateForm, 
        countryId: 1, 
        id: item?.id, 
        companySizeTo: +stateForm.companySizeTo, 
        companySizeFrom: +stateForm?.companySizeFrom 
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["companies", "isPrivate"]);
          toast.success("Update company info is successed!", {
            position: toast.POSITION.BOTTOM_LEFT,
          });
          setTimeout(() => {
            router.push("/hiring");
          }, 1000);
        },
        onError: () => {
          toast.error("Update company info is failed, Please try again!", {
            position: toast.POSITION.BOTTOM_LEFT,
          });
        },
      }
    );
  };

  useEffect(() => {
    setStateForm({
      avatar: item?.avatar,
      culture: item?.culture,
      companyTypes: item?.companyTypes,
      overview: item?.overview,
      description: item?.description,
      country: item?.country?.name,
      workingDays: item?.workingDays,
      website: item?.website,
      name: item?.name,
      companyAddresses: item?.companyAddresses,
      companySizeFrom: item?.companySizeFrom,
      companySizeTo: item?.companySizeTo,
    });
  }, [item]);

  const disabledEditCompany =
  !stateForm.avatar ||
  !stateForm.companyAddresses ||
  !stateForm.companySizeFrom ||
  !stateForm.companySizeTo ||
  !stateForm.companyTypes.length ||
  !stateForm.culture ||
  !stateForm.description ||
  !stateForm.name ||
  !stateForm.overview ||
  !stateForm.website ||
  !stateForm.workingDays

  return (
    <>
      <Head>
        <title>Edit company</title>
      </Head>
      <Navbar fixed isShowAuth />
      <div id="container" className="bg-[#dbe0e1]">
        <Loading isLoading={isLoading}></Loading>
        <ToastContainer />
        <section className="header pt-20">
          <div className="container mx-auto">
            <div className="md:px-8 lg:px-4 my-4">
              <Link href="/hiring">
                <span className="text-[#3659e3] text-[16px] mb-2">
                  <i className="far fa-arrow-alt-circle-left text-[30px]"></i>
                </span>
              </Link>
              <div className="py-4 px-4 rounded-[20px] shadow-lg my-4 border-[1px] bg-white border-solid border-[#e7e7e9] h-auto">
                <FormCompany
                  avatar={stateForm.avatar}
                  culture={stateForm.culture}
                  companyTypes={stateForm.companyTypes}
                  overview={stateForm.overview}
                  description={stateForm.description}
                  onChange={handleOnchangePostForm}
                  name={stateForm.name}
                  country={stateForm.country}
                  workingDays={stateForm.workingDays}
                  website={stateForm.website}
                  companyAddresses={stateForm.companyAddresses}
                  companySizeFrom={stateForm.companySizeFrom}
                  companySizeTo={stateForm.companySizeTo}
                  mode="edit"
                />
                <div className="h-[1px] bg-[#e7e7e9] w-full my-6"></div>
                <div className="flex gap-2 justify-end px-2 md:px-4">
                  <Button
                    classBtn="h-[40px] w-auto text-white font-bold focus:outline-none bg-[#3659e3] rounded-md py-2 px-6"
                    textBtn="Apply"
                    onClick={handleUpdateCompany}
                    disabled={Boolean(disabledEditCompany)}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer hiddenDecord />
      </div>
    </>
  );
};

export default Index;

export async function getServerSideProps(context: any) {
  try {
    const { params } = context;
    const companyId = params?.companyId as string;
    const response = await ServiceCompany.getDetailCompany(companyId);
    const data = response?.data;

    if (!data?.id) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        item: data,
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
}
