/* eslint-disable @next/next/no-img-element */
// Libraries
import React, { useState, Fragment, useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Services
import * as ServiceEvent from '@/services/event';

// Utils
import { formatStringToDate, getDurationTime, parseString } from '@/utils';

// Components
import Icon from '@/components/Icons/Icon';
import { Button } from '@/components/Buttons/Button';
import Navbar from '@/components/Navbars/IndexNavbar';
import Footer from '@/components/Footers/Footer';
import { ButtonQuestion } from '@/components/Buttons/ButtonQuestion';
import MapExample from '@/components/Maps/MapExample';
import { ModalEvent } from '@/components/Modals/ModalEvent';
import Image from 'next/image';

export type TAnswer = {
  content: string,
  id: string,
  key: string,
  value: string
}

export type TQuestion = {
  content: string,
  value: string,
  questionType: string,
  id: string,
  required: boolean,
  choices: TAnswer[]
}

type TPropEvent = {
  id: number;
  slug: string;
  bannerUrl: string;
  title: string;
  host: string;
  types: string[];
  cost: number;
  registrationDeadline: string;
  startDate: string;
  endDate: string;
  description: string;
  location?: string;
  mapLocation?: string;
  recap?: string;
  livestreamUrl?: string;
  eventQuestions?: TQuestion[]
};
type TTypeProps = {
  event?: TPropEvent;
};

const Event: NextPage<TTypeProps> = ({ event }) => {
  const [isHidden, setIsHidden] = useState(false);
  const [isShowInfo, setIsShowInfo] = useState(false);
  const [isShowMore, setIsShowMore] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isShowMap, setIsShowMap] = useState(false);
  const [answers, setAnswers] = useState<any>({})

  const onCloseModal = () => {
    setIsOpenModal(false);
  };

  useEffect(() => {
    if(event?.eventQuestions && event?.eventQuestions?.length > 0) {
      const result:any = {}
      event?.eventQuestions?.forEach((item) => {
        const key = item?.questionType === 'TEXT' ? 'content' : 'eventQuestionChoiceIDs'
        const value = item?.questionType === 'TEXT' ? '' : []
        result[item?.id] = {
          eventQuestionId: item?.id,
          [key]: value
        }
      })
      setAnswers(result)
    }
  }, [event?.eventQuestions])
    
  const router = useRouter();
  if (router.isFallback) {
    return <></>;
  }

  return (
    <Fragment>
      <Head>
        <title>{event?.title}</title>
        <meta name="keywords" content={event?.title} />
        <meta name="description" content={event?.description} />
        <meta name="author" content={event?.description} />
        <meta itemProp="name" content={event?.title}/>
        <meta itemProp="image" content={event?.bannerUrl}/>
        {/* facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={event?.title} />
        <meta property="og:description" content={event?.description} />
        <meta property="og:image" content={event?.bannerUrl} />
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={event?.title}/>
        <meta name="twitter:description" content={event?.description} />
        <meta name="twitter:image" content={event?.bannerUrl} />
      </Head>
      <Navbar fixed isShowAuth />
      <ToastContainer />
      <ModalEvent eventId={event?.id || 0} isOpen={isOpenModal} closeModal={onCloseModal} eventQuestions={event?.eventQuestions} answers={answers} setAnswers={setAnswers} />
      <section className='bg-white pt-[100px]'>
        <div className='px-6 sm:px-16 h-full bg-white text-black max-w-7xl mx-auto'>
          {/* <div
            className='bg-cover hidden md:block h-auto w-full min-h-[470px] rounded-3xl bg-center'
            style={{
              backgroundImage: `url(${event?.bannerUrl})`,
              backgroundSize: 'auto 100%' 
            }}
          ></div> */}
          <Image
            src={event?.bannerUrl || ''}
            alt="banner"
            placeholder='blur'
            blurDataURL={'@/public/img/placeholder.png'}
            className='align-middle block border-none w-full h-[auto] object-contain rounded-3xl'
            width={0}
            height={0}
            sizes="100vw"
          />
          <div className='flex gap-28 sm:gap-[0] md:gap-[0] lg:gap-28 xl:gap-28'>
            <div className='w-full'>
              <h6 className='text-[#6f7287] mt-8 text[16px] font-bold'>
                {formatStringToDate(event?.startDate)}
              </h6>
              <h1 className='text-[50px] font-bold'>
                <span style={{ overflowWrap: 'break-word' }}>
                  {event?.title}
                </span>
              </h1>
              {event?.recap && (
                <p className='text-[14px] text-[#39364f] font-medium mt-6 mb-4 flex flex-col items-start gap-1'>
                  <span className='text-sx font-bold'>Recap: </span>
                  <div
                    className='max-w-[100%] description-editor'
                    dangerouslySetInnerHTML={{
                      __html: event?.recap,
                    }}
                  ></div>
                </p>
              )}
              {/* <p className='text-xs font-bold mb-8'>
                {event?.title} with {event?.host}
              </p> */}
              {/* <div className='flex items-center rounded-xl w-auto bg-[#f8f7fa] px-6 py-4 flex-wrap'>
                <div className='flex flex-wrap items-center gap-1 flex-1'>
                  <img
                    className='h-[54px] w-[54px] rounded-[50%] border-white border-2 border-solid mr-4'
                    src='/img/profile.png'
                    alt='avatar'
                  />
                  <div className='flex flex-col gap-[6px]'>
                    <span
                      className='text-[#6f7287]'
                      style={{ overflowWrap: 'break-word' }}
                    >
                      {' '}
                      By
                      <span className='text-[15px] font-bold text-black'>
                        {' '}
                        {event?.host}
                      </span>
                    </span>
                    <span className="text-[11px]">350 followers</span>
                  </div>
                </div>
                <Button
                  classBtn='h-[44px] mt-2 lg:mt-0 w-full md:w-auto lg:w-auto xl:w-auto bg-[#3659e3] text-white rounded-md font-bold px-7 outline-[none] border-none focus:outline-none'
                  textBtn='Follow'
                  onClick={() =>
                    window.open('https://www.facebook.com/istick.io')
                  }
                />
              </div> */}
              <h1 className='text-3xl font-bold mb-4 mt-8'>When and where</h1>
              <div className='flex items-start md:items-center justify-between gap-4 flex-col md:gap-0 md:flex-row'>
                <div className='font-bold text-xs flex items-center gap-1'>
                  <Icon classIcon='fas fa-calendar-times text-[#0124e9] text-base' />
                  <div className='flex flex-col justify-center'>
                    <span className='text-[16px]'>Register Dealine</span>
                    <span className='text-[#6f7287] mt-1'>
                      {formatStringToDate(event?.registrationDeadline)}
                    </span>
                  </div>
                </div>
                <div className='font-bold text-xs flex items-center gap-1'>
                  <Icon classIcon='fas fa-calendar-plus text-[#0124e9] text-base' />
                  <div className='flex flex-col justify-center'>
                    <span className='text-[16px]'>Date and time start</span>
                    <span className='text-[#6f7287] mt-1'>
                      {formatStringToDate(event?.startDate)}
                    </span>
                  </div>
                </div>
              </div>
              <div className='flex items-start  md:items-center justify-between mt-4 gap-4 flex-col-reverse md:gap-0 md:flex-row'>
                <div className='font-bold text-xs flex items-center gap-1'>
                  <Icon classIcon='fas fa-map-marker-alt text-[#0124e9] text-base' />
                  <div className='flex flex-col justify-center'>
                    <span className='text-[16px]'>Location</span>
                    <span className='text-[#6f7287] mt-1'>
                      {' '}
                      {event?.location}
                    </span>
                  </div>
                </div>
                <div className='font-bold text-xs flex items-center gap-1'>
                  <Icon classIcon='fas fa-calendar-minus text-[#0124e9] text-base' />
                  <div className='flex flex-col justify-center'>
                    <span className='text-[16px]'>Date and time end</span>
                    <span className='text-[#6f7287] mt-1'>
                      {formatStringToDate(event?.endDate)}
                    </span>
                  </div>
                </div>
              </div>
              <Link
                href={event?.mapLocation || '/'}
                target="_blank"
                className='ml-10 mt-4 flex whitespace-nowrap  w-[80px] items-center justify-between text-[#3659e3] font-bold text-[12px] cursor-pointer'
              >Link google map</Link>
              {/* <div
                className='ml-10 mt-4 flex w-[80px] items-center justify-between text-[#3659e3] font-bold text-[12px] cursor-pointer'
                onClick={() => setIsShowMap(!isShowMap)}
              >
                <span>{isShowMap ? 'Hide map' : 'Show map'}</span>
                {isShowMap ? (
                  <span>
                    <i className='fas fa-angle-down'></i>
                  </span>
                ) : (
                  <span>
                    <i className='fas fa-angle-up'></i>
                  </span>
                )}
              </div> */}
              <div className={'w-full h-[360px] mt-8' + (isShowMap ? ' block' : ' hidden')}>
                <MapExample
                  lat={
                    event?.mapLocation
                      ? parseString(event?.mapLocation) &&
                        parseString(event?.mapLocation).lat
                      : ''
                  }
                  lng={
                    event?.mapLocation
                      ? parseString(event?.mapLocation) &&
                        parseString(event?.mapLocation).lng
                      : ''
                  }
                />
              </div>
              <h1 className='text-3xl font-bold mb-4 mt-8'>About this event</h1>
              <div className='flex items-center justify-between mb-4'>
                <div className='font-bold text-xs flex items-center gap-1'>
                  <Icon classIcon='far fa-clock text-[#0124e9] text-base' />
                  <span className='text-[12px]'>
                    {getDurationTime(event?.startDate, event?.endDate)}
                  </span>
                </div>
                <div className='font-bold text-xs flex items-center gap-1'>
                  <Icon classIcon='fas fa-ticket-alt text-[#0124e9] text-base' />
                  {event?.types.map((type, index) => {
                    return (
                      <span key={type} className='text-[12px]'>
                        {index % 2 !== 0 && '| '}
                        {type}
                      </span>
                    );
                  })}
                </div>
              </div>
              {event?.livestreamUrl && (
                <h5 className='text-[16px] font-bold'>Online link:</h5>
              )}
              <Link
                className='text-[16px] text-[#3659e3] font-bold'
                href={event?.livestreamUrl || ''}
                target='_blank'
              >
                {event?.livestreamUrl}
              </Link>
              <div
                className='pb-4 mt-4'
                dangerouslySetInnerHTML={{
                  __html: event?.description ? event?.description : '',
                }}
              ></div>
              <h1 className='text-3xl font-bold mb-4 mt-8'>
                Frequently asked questions
              </h1>
              <ButtonQuestion
                question={'Event sẽ được tổ chức ở đâu'}
                answer={`${event?.title} được tổ chức tại: ${event?.location}`}
              />
              {/* organizer */}
              {/* <h1 className='text-3xl font-bold mb-4 mt-8'>
                About the organizer
              </h1>
              <div className='mb-[32px] flex items-center rounded-xl w-auto p-10 flex-col shadow border-solid border-[#dddef2] border-[1px]'>
                <img
                  className='h-[78px] w-[78px] rounded-[50%] border-2 border-solid mr-4'
                  src='/img/profile.png'
                  alt='avatar'
                />
                <span className='mt-[32px] mb-[8px] text-[12px] text-[#6f7287]'>
                  Organized by
                </span>
                <span
                  className='text-[18px] font-bold text-black hover:underline hover:text-[#3659e3]'
                  style={{ overflowWrap: 'break-word' }}
                >
                  <Link href='/'>{event?.host}</Link>
                </span>
                <div className='flex items-center gap-[20px] mb-8'>
                  <Button
                    classBtn='h-[44px] w-full md:w-auto lg:w-auto xl:w-auto bg-transparent text-[#3659e3] rounded-md hover:bg-[#f8f7fa]  font-bold px-7 '
                    textBtn='Contact'
                    onClick={() =>
                      window.open('https://www.facebook.com/istick.io')
                    }
                  />
                  <Button
                    classBtn='h-[44px] w-full md:w-auto lg:w-auto xl:w-auto bg-[#3659e3] text-white rounded-md font-bold px-7 '
                    textBtn='Follow'
                    onClick={() =>
                      window.open('https://www.facebook.com/istick.io')
                    }
                  />
                </div>
                <div className='text-center'>
                  <p className='text-[14px] text-center text-[#6f7287]'>
                    Istick cung cấp một nền tảng tuyển dụng hiện đại, tiện ích
                    và an toàn, giúp người dùng dễ dàng tìm kiếm và ứng tuyển
                    vào các vị trí công việc trong ngành công nghệ thông tin.
                    Chúng tôi liên tục cập nhật hàng ngàn công việc mới và đa
                    dạng từ các nhà tuyển dụng uy tín.
                  </p>
                  <p className='text-[14px] text-center text-[#6f7287]'>
                    Cách hoạt động của istick rất đơn giản. Bạn chỉ cần tạo một
                    tài khoản, bao gồm các kỹ năng làm việc và sở thích nghề
                    nghiệp của mình.
                  </p>
                  {isShowMore && (
                    <Fragment>
                      <p className='text-[14px] text-center text-[#6f7287]'>
                        ChatBot thông minh của chúng tôi sẽ đồng hành với bạn
                        trong quá trình tìm kiếm công việc phù hợp và gợi ý các
                        vị trí phù hợp với tiềm năng của bạn
                      </p>
                      <p className='text-[14px] text-center text-[#6f7287]'>
                        Chúng tôi đặt sự an toàn và bảo mật dữ liệu của bạn lên
                        hàng đầu, để bạn tập trung hoàn toàn vào việc khám phá
                        những vị trí hấp dẫn và phù hợp với tiềm năng của mình.
                      </p>
                    </Fragment>
                  )}
                  {!isShowMore ? (
                    <span
                      className='text-[14px] text-[#3659e3] cursor-pointer hover:underline'
                      onClick={() => setIsShowMore(!isShowMore)}
                    >
                      View more
                    </span>
                  ) : (
                    <span
                      className='text-[14px] text-[#3659e3] cursor-pointer hover:underline'
                      onClick={() => setIsShowMore(!isShowMore)}
                    >
                      View less
                    </span>
                  )}
                </div>
                <div className='flex items-center gap-[20px] mt-8'>
                  <Button
                    classBtn='h-[46px] w-[46px] text-center text-[#3659e3] rounded-md bg-[#f8f7fa] font-bold'
                    iconBtn='fab fa-facebook text-lg leading-lg text-[#3659e3]'
                    onClick={() =>
                      window.open('https://www.facebook.com/istick.io')
                    }
                  />
                  <Button
                    classBtn='h-[46px] w-[46px] text-center text-[#3659e3] rounded-md bg-[#f8f7fa] font-bold'
                    iconBtn='fas fa-globe text-lg leading-lg text-[#3659e3]'
                    onClick={() => window.open('https://istick.io/')}
                  />
                </div>
              </div> */}
            </div>
            <div className='h-100% hidden sm:hidden md:hidden lg:block xl:block'>
              <div
                className='duration-[0.5] ease-in transition-[height] w-[360px] min-w-360px p-6 
                border-[#dddef2] border-2 border-solid rounded-md h-[fit-content] mt-8
                sticky top-[76px] bottom-auto'
              >
                <div className='p-4 border-[#3659e3] border-4 border-solid rounded-md max-w-[312px]'>
                  <div className='flex items-center justify-between'>
                    <span className='text-[16px] font-bold'>
                      {event?.title}
                    </span>
                    {/* <div className="flex items-center">
                      <Button
                        onClick={() => setNumTicket(prev => prev - 1)}
                        disabled={numTicket < 2}
                        iconBtn="fas fa-minus text-[14px]"
                        classBtn="h-[32px] w-[32px] bg-[#3659e3] text-white rounded-md outline-[none] border-none focus:outline-none"
                      />
                      <div className="px-3"><span className="text-black font-bold text-[14px]">{numTicket}</span></div>
                      <Button
                        iconBtn="fas fa-plus text-[14px]"
                        classBtn="h-[32px] w-[32px] bg-[#3659e3] text-white rounded-md outline-[none] border-none focus:outline-none"
                        disabled={numTicket > 4}
                        onClick={() => setNumTicket(prev => prev + 1)}
                      />
                    </div> */}
                    {/* <Button
                      onClick={() => setNumTicket(prev => prev - 1)}
                      disabled={numTicket < 2}
                      iconBtn="fas fa-minus text-[14px]"
                      classBtn="h-[32px] w-[32px] text-black outline-[none] border-none focus:outline-none"
                    /> */}
                  </div>
                  <div className='flex items-center justify-between mt-4'>
                    <span>
                      Price:
                      <span className='font-bold'>
                        {' '}
                        {event?.cost ? event?.cost : 'Free'}{' '}
                      </span>
                      <span
                        onClick={() => setIsShowInfo(!isShowInfo)}
                        className='cursor-pointer bg-white h-[16px] w-[16px] items-center justify-center text-[#3d64ff] text-[10px] inline-flex border-2 border-[#3d64ff] rounded-[50%]'
                      >
                        <i className='fas fa-info'></i>
                      </span>
                    </span>
                    {/* <span className='text-xs text-black font-bold inline-block py-1 px-2 rounded-full text-blueGray-500 bg-[#f8f7fa] uppercase last:mr-0 mr-2 mt-2'>
                      84 Remaining
                    </span> */}
                  </div>
                  {isShowInfo && (
                    <div>
                      {/* <span className="text-[14px] mt-2 mb-4 w-full inline-block text-right">Sales end in 18 hours</span> */}
                      <p className='text-[#6f7287]'>
                        <span style={{ overflowWrap: 'break-word' }}>
                          {event?.title}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
                <Button
                  classBtn='h-[44px] font-bold w-full bg-[#d1410c] text-white rounded-md outline-[none] border-none focus:outline-none mt-4'
                  textBtn='Reserve a post'
                  onClick={() => setIsOpenModal(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer hiddenDecord />
      {/* button reserve mobile */}
      <div
        className='block sm:block md:block lg:hidden xl:hidden w-full bg-white p-6
        border-[#dddef2] border-2 border-solid h-[fit-content] sticky bottom-0'
        style={{
          padding: isHidden ? '0px 0px 24px 0' : '24px',
        }}
      >
        <div
          className='p-4 border-[#3659e3] border-4 border-solid rounded-md w-full'
          style={{
            display: isHidden ? 'none' : 'block',
          }}
        >
          <div className='flex items-center justify-between'>
            <span className='text-[16px] font-bold'>{event?.title}</span>
            {/* <div className="flex items-center">
              <Button
                onClick={() => setNumTicket(prev => prev - 1)}
                disabled={numTicket < 2}
                iconBtn="fas fa-minus text-[14px]"
                classBtn="h-[32px] w-[32px] bg-[#3659e3] text-white rounded-md outline-[none] border-none focus:outline-none"
              />
              <div className="px-3"><span className="text-black font-bold text-[14px]">{numTicket}</span></div>
              <Button
                iconBtn="fas fa-plus text-[14px]"
                classBtn="h-[32px] w-[32px] bg-[#3659e3] text-white rounded-md outline-[none] border-none focus:outline-none"
                disabled={numTicket > 4}
                onClick={() => setNumTicket(prev => prev + 1)}
              />
            </div> */}
            <Button
              onClick={() => setIsHidden(true)}
              iconBtn='fas fa-minus text-[18px]'
              classBtn='h-[32px] w-[32px] text-black outline-[none] border-none focus:outline-none'
            />
          </div>
          <div className='flex items-center justify-between mt-4'>
            <span>
              Price:
              <span className='font-bold'>
                {event?.cost ? event?.cost : 'Free'}{' '}
              </span>
              <span className='cursor-pointer bg-white h-[16px] w-[16px] items-center justify-center text-[#3d64ff] text-[10px] inline-flex border-2 border-[#3d64ff] rounded-[50%]'>
                <i className='fas fa-info'></i>
              </span>
            </span>
            {/* <span className='text-xs text-black font-bold inline-block py-1 px-2 rounded-full text-blueGray-500 bg-[#f8f7fa] uppercase last:mr-0 mr-2 mt-2'>
              84 Remaining
            </span> */}
          </div>
          <div>
            {/* <span className="text-[14px] mt-2 mb-4 w-full inline-block text-right">Sales end in 18 hours</span> */}
            <p className='text-[#6f7287]'>
              <span style={{ overflowWrap: 'break-word' }}>{event?.title}</span>
            </p>
          </div>
        </div>
        {isHidden && (
          <Button
            onClick={() => setIsHidden(false)}
            iconBtn='fas fa-expand-alt text-[18px]'
            classBtn='h-[32px] w-[32px] text-black outline-[none] border-none focus:outline-none w-full text-right pr-2'
          />
        )}
        <Button
          classBtn={`h-[44px] font-bold w-full bg-[#d1410c] text-white rounded-md outline-[none] 
          border-none focus:outline-none ${isHidden ? 'mt-0' : 'mt-4'}`}
          textBtn='Reserve a post'
          onClick={() => setIsOpenModal(true)}
        />
      </div>
    </Fragment>
  );
};

export default Event;

export async function getServerSideProps(context: any) {
  const { params } = context;
  const eventId = params?.eventId as string;
  try {
    const response = await ServiceEvent.getDetailsEvent(eventId);
    const data = response?.data;
    if (!data.id) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        event: data,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
