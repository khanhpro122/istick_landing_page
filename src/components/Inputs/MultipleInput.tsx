// Libraries
import { NextPage } from 'next';
import React from 'react';

// Hooks
import { TAnswer, TQuestion } from '@/pages/events/[eventId]';
import { Input } from './Input';

type TProps = {
    question?: TQuestion,
    answers?: any[],
    setAnswers?: React.Dispatch<React.SetStateAction<any[]>>,
    errorQuestions: any,
}
export const MutipleInput: NextPage<TProps> = ({ question, answers, setAnswers, errorQuestions }) => {
  const onChangeContent = (value: string, id:any) => {
    if(answers) {
      const cloneAnswers = {...answers}
      cloneAnswers[id] = {...cloneAnswers[id], content: value}
      if(setAnswers) {
        setAnswers(cloneAnswers)
      }
    }
  }
  
  const handleOnchangeCheckbox = (idParent:any, idChild: any) => {
    if(answers) {
      const cloneAnswers = {...answers}
      let result:any = []
      const choices = cloneAnswers[idParent]?.eventQuestionChoiceIDs
      if(choices?.includes(idChild)) {
        result = choices?.filter((item:any) => item !== idChild)
      }else {
        result = [...choices, idChild]
      }
      cloneAnswers[idParent] = {...cloneAnswers[idParent], eventQuestionChoiceIDs : result}
      if(setAnswers) {
        setAnswers(cloneAnswers)
      }
    }
  }

  const handleOnchangeRadio = (idParent: any, idChild: any) => {
    if(answers) {
      const cloneAnswers = {...answers}
      cloneAnswers[idParent] = {...cloneAnswers[idParent], eventQuestionChoiceIDs : [idChild]}
      if(setAnswers) {
        setAnswers(cloneAnswers)
      }
    }
  }

  return (
    <>
      {question?.questionType === 'SINGLE' && (
        <>
          <label
            className='block uppercase text-[#000] text-xs font-bold mb-2'
            htmlFor={question?.content}
          >
            {question?.content} {question?.required && <span className='text-[red]'> *</span>}
          </label>
          {question?.choices?.map((choice: TAnswer) => {
            return (
              <div className="mx-2 flex items-center" key={choice?.id}>
                <input
                  id={choice?.id}
                  type="radio"
                  className="outline-none focus:outline-none border-[1px] rounded-full shadow cursor-pointer border-solid"
                  style={{
                    boxShadow: "none",
                    color: "#3659e3",
                    borderColor: "#e7e7e9",
                  }}
                  checked={answers && answers[+question?.id] ? answers[+question?.id]?.eventQuestionChoiceIDs?.includes(choice?.id) : false}
                  value={choice?.id}
                  onChange={() => handleOnchangeRadio(question?.id, choice?.id)}
                />
                <label
                  htmlFor={choice?.id}
                  className={
                    "text-sm text-black cursor-pointer py-2 px-2 font-normal block w-full whitespace-nowrap"
                  }
                >
                  {choice?.content}
                </label>
              </div>
            )
          })}
        </>
      )}
      {question?.questionType === 'MULTIPLE' && (
        <>
          <label
            className='block uppercase text-[#000] text-xs font-bold mb-2'
            htmlFor={question?.content}
          >
            {question?.content} {question?.required && <span className='text-[red]'> *</span>}
          </label>
          {question?.choices?.map((choice: TAnswer) => {
            return (
              <div className="mx-2 flex items-center" key={choice?.id}>
                <input
                  id={choice?.id}
                  type="checkbox"
                  className="h-5 w-5 outline-none focus:outline-none border-[1px] shadow cursor-pointer border-solid"
                  style={{
                    boxShadow: "none",
                    borderRadius: "4px",
                    color: "#3659e3",
                    borderColor: "#e7e7e9",
                  }}
                  value={choice?.id}
                  checked={answers && answers[+question?.id] ? answers[+question?.id]?.eventQuestionChoiceIDs?.includes(choice?.id) : false}
                  onChange={() => handleOnchangeCheckbox(question?.id, choice?.id)}
                />
                <label
                  htmlFor={choice?.id}
                  className={
                    "text-sm text-black cursor-pointer py-2 px-2 font-normal block w-full whitespace-nowrap"
                  }
                >
                  {choice?.content}
                </label>
              </div>
            )
          })}
        </>
      )}
      {question?.questionType === 'TEXT' && (
        <div className='relative w-full mb-3'>
          <label
            className='block uppercase text-[#000] text-xs font-bold mb-2'
            htmlFor={question?.content}
          >
            {question?.content} {question?.required && <span className='text-[red]'> *</span>}
          </label>
          <Input
            type='text'
            name={question?.content}
            id={question?.content}
            className='border-0 px-3 py-3 placeholder-blueGray-300 text-[#000] bg-white rounded text-sm shadow outline-none focus:outline-none w-full ease-linear transition-all duration-150'
            placeholder='Enter your answer'
            value={answers ? answers[+question?.id]?.content: ''}
            onChange={(type, value) => onChangeContent(value, question?.id)}
            errorText={errorQuestions && errorQuestions[question?.id] ? errorQuestions[question?.id] : ''}
          />
        </div>
      )}
    </>
  );
}
