import { TOptions } from "./components/Dropdowns/DropdownCheckbox";
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

export const formatStringToDate = (str: string | undefined, options?: any) => {
  if (str) {
    const date: Date = new Date(str);

    const optionsDefault: Intl.DateTimeFormatOptions = 
      { 
        year: 'numeric', month: 'long', 
        day: 'numeric', hour: 'numeric',
        minute: 'numeric',
      };
    const formattedDate: string = date.toLocaleDateString('en-US', options ? options :  optionsDefault);
    return formattedDate
  }
  return ''
}

export const getDurationTime = (dateStart:any, dateEnd:any, isOnlyDay = false) => {
  try {
    if (dateStart && dateEnd) {
      const start = new Date(dateStart);
      const end = new Date(dateEnd);
      const currentTime = new Date();
      // const end = new Date(dateEnd);
      const durationInMilliseconds = start.getTime() - currentTime.getTime();

      if(durationInMilliseconds < 0) {
        return 'Finished'
      } else if(start.getTime() <= currentTime.getTime() && currentTime.getTime() <= end.getTime()) {
        return 'Happening'
      }
      // Tính toán số ngày, giờ, phút và giây
      const millisecondsPerSecond = 1000;
      const millisecondsPerMinute = 60 * millisecondsPerSecond;
      const millisecondsPerHour = 60 * millisecondsPerMinute;
      const millisecondsPerDay = 24 * millisecondsPerHour;
  
      const days = Math.floor(durationInMilliseconds / millisecondsPerDay);
      const hours = Math.floor((durationInMilliseconds % millisecondsPerDay) / millisecondsPerHour);
      const minutes = Math.floor((durationInMilliseconds % millisecondsPerHour) / millisecondsPerMinute);
      const seconds = Math.floor((durationInMilliseconds % millisecondsPerMinute) / millisecondsPerSecond);
    
      // Xây dựng chuỗi kết quả
      let durationString = '';
      if (days > 0) {
        durationString += `${days} day${days > 1 ? 's' : ''} `;
      }
      if (hours > 0) {
        durationString += `${hours} hour${hours > 1 ? 's' : ''} `;
      }
      if (minutes > 0) {
        durationString += `${minutes} minute${minutes > 1 ? 's' : ''} `;
      }
      // if (seconds > 0) {
      //   durationString += `${seconds} second${seconds > 1 ? 's' : ''} `;
      // }
      if(isOnlyDay) {
        return `${days} day${days > 1 ? 's' : ''} `
      }
      return durationString.trim(); // Xóa khoảng trắng thừa ở đầu và cuối chuỗi
    }
    
    return '';
  }catch(e) {
  }
}

export const getTimeCreated = (createTime: string) => {
  try {
    const specificTime = new Date(createTime);
    const currentTime = new Date();

    const timeDifference = currentTime.getTime() - specificTime.getTime();

    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysDifference = Math.floor(timeDifference / millisecondsPerDay);
    const hoursDifference = Math.floor((timeDifference % millisecondsPerDay) / (60 * 60 * 1000));
    if(timeDifference > 1) {
      return `${daysDifference}d ${hoursDifference}h`
    }
    return `${hoursDifference}h`

  }catch(e) {
    return ''
  }
}

export const setLanguage = (value: any) => {
  if(typeof window !== 'undefined') {
    localStorage.setItem('language', JSON.stringify(value));
  }
}


export const getLanguage = () => {
  if(typeof window !== 'undefined') {
    const curLanguage = localStorage.getItem('language')
    if(curLanguage) {
      return JSON.parse(curLanguage);
    }
  }
  return ''
}

export const validateForms  = (inputs: any) => {
  const result = {
    email: '',
    company: '',
    fullname: '',
    jobTitle: '',
    phoneNumber: ''
  }
  try {
    Object.keys(inputs) && Object.keys(inputs).forEach((key) => {
      if(key === 'email') {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if(!inputs[key]) {
          result[key]  = 'This field is required'
        }else if(!regex.test(inputs[key])) {
          result[key]  = 'This field is an email'
        }else {
          result[key]  = ''
        }
      }else if(key === 'phoneNumber'){
        if(!inputs[key]) {
          result[key] = 'This field is required'
        } else if(inputs[key].length < 10) {
          result[key] = 'This field is least 10 number'
        }else {
          result[key] = ''
        }
      }else if(key === 'company' || key === 'fullname' || key === 'jobTitle'){
        if(!inputs[key]) {
          result[key]  = 'This field is required'
        }else  {
          result[key]  = ''
        }
      }
    })
    return result
  }catch(e) {
    return result
  }
}

export const validateFormsEventRegister  = (data: any, rules: any) => {
  const objError:any = {}
  try {
    rules?.forEach((item:any) => {
      if(item?.required) {
        if(item?.questionType === 'TEXT') {
          if(!data?.[item?.id]?.content) {
            objError[item?.id] = 'The field is required'
          }else {
            objError[item?.id] = ''
          }
        } else if(item?.questionType === 'SINGLE' || item?.questionType === 'MULTIPLE') {
          if(!data?.[item?.id]?.eventQuestionChoiceIDs?.length) {
            objError[item?.id] = 'The field is required'
          }else {
            objError[item?.id] = ''
          }
        }
      }
    });
    return objError;
  }catch(e) {
    return objError;
  }
}

export const validateEmpty = (obj: any) => {
  const result = obj
  try {
    Object.keys(obj) && Object.keys(obj).forEach((key) => {
      if(!obj[key] || !obj[key]?.length || obj[key] === '<p><br></p>') {
        result[key] = 'This field is required'
      }else {
        result[key] = ''
      }
    })
    return result
  }catch(e) {
    return result
  }
}

export const getLabelByValue = (value:string, options?:TOptions[]) => {
  try{
    const findLabel = options?.find((option) => option?.value === value)
    if(findLabel?.label) {
      return findLabel?.label
    }
    return ''
  }catch(e) {
    return ''
  }
}

export const generateKey = (length: number): string => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const selectedChar = characters.charAt(randomIndex);
    result += selectedChar;
  }

  return result;
}

export const convertStringToObject = (name:string) => {
  try{
    return {
      label: name,
      value: name.toLowerCase()?.replace(/[^\w\s]/g, '')?.replace(/\s+/g, '_')
    }
  }catch(e) {
    return {}
  }
}

export const convertSecondsToTime = (seconds: number) => {
  const minutes = Math.ceil(seconds / 60);
  if(minutes === 0) {
    return ''
  }
  return `${minutes} minutes read`
};

export const formatStringToDay = (str: string | undefined) => {
  if (str) {
    const date: Date = new Date(str);

    const options: Intl.DateTimeFormatOptions = 
      { 
        year: 'numeric', month: 'long', 
        day: 'numeric',
      };
    const formattedDate: string = date.toLocaleDateString('en-US', options);
    return formattedDate
  }
  return ''
}

export const getCookie = (name: string):any =>  {
  return cookies.get(name);
}

export const clearCookie = (name: string) =>  {
  cookies.remove(name, { expires: new Date(0) });
}

export const getDataLocal = (name: string) => {
  try {
    const data = localStorage.getItem(name)
    if(data) {
      return JSON.parse(data)
    }
    return {}
  }catch(e) {
    return {}
  }
}

export const getNamCompanyById = (companies: any, id: number) => {
  try {
    const findCom = companies?.find((item: any) => item.id === id)
    return findCom && findCom?.name
  }catch(e) {
    return ''
  }
}

const addLeadingZero = (number: number) =>  {
  return number < 10 ? "0" + number : number;
}

export const convertIosToDatetime = (string: any) => {
  try {

    const date = new Date(string);

    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();

    const formattedDate = addLeadingZero(day) + "/" + addLeadingZero(month) + "/" + year;

    return formattedDate
  }catch(e) {
    return ''
  }
}

export const convertArrayToTags = (skills: string[], levels?: string[]) => {
  try {
    const result:any = [];
    skills?.forEach((skill) => {
      result.push({
        name: skill,
        tagType: 'SKILL'
      })
    })
    if(levels?.length) {
      levels?.forEach((level) => {
        result.push({
          name: level,
          tagType: 'LEVEL'
        })
      })
    }
    return result;
  }catch(e) {
    return []
  }
}

export const convertToUserTag = (titles: string[], offices: string[], skills: string[]) => {
  try {
    const result:any = [];
    if(!!titles.length) {
      titles.forEach((title) => {
        result.push({
          name: title,
          tagType: 'TITLE'
        })
      })
    }
    if(!!offices.length) {
      offices.forEach((office) => {
        result.push({
          name: office,
          tagType: 'LOCATION'
        })
      })
    }
    if(!!skills.length) {
      skills.forEach((skill) => {
        result.push({
          name: skill,
          tagType: 'SKILL'
        })
      })
    }
    return result;
  }catch(e) {
    return []
  }
}

export const convertLocalPhone = (str: string) => {
  try{
    const result = str?.replace('+84', '')
    return result
  }catch(e) {
    return 0
  }
}

export const convertValues = (arr: any, type: string) => {
  try {
    let result = []
    result = arr?.filter((tag:any) => tag?.tagType === type)?.map((item:any) => item?.tag?.name)
    return result;
  }catch(e) {
    return []
  }
}

export const convertValuesLevel = (arr: any) => {
  try {
    let result = []
    result = arr?.map((item:any) => String(item?.level?.id))
    return result;
  }catch(e) {
    return []
  }
}

export const convertToUserTagLocal = (titles: string[], offices: string[], skills: string[]) => {
  try {
    const result:any = [];
    if(!!titles.length) {
      titles.forEach((title) => {
        result.push({
          tag : {
            name: title,
          },
          tagType: 'TITLE'
        })
      })
    }
    if(!!offices.length) {
      offices.forEach((office) => {
        result.push({
          tag : {
            name: office,
          },
          tagType: 'LOCATION'
        })
      })
    }
    if(!!skills.length) {
      skills.forEach((skill) => {
        result.push({
          tag : {
            name: skill,
          },
          tagType: 'SKILL'
        })
      })
    }
    return result;
  }catch(e) {
    return []
  }
}

export const uniqueArray = (arr: any) => {
  try {
    const uniqueArray = arr?.filter((item: any, index:number, self: any) =>
      self.findIndex((other: any) => other.value === item.value) === index
    );
    return uniqueArray
  }catch(e) {
    return []
  }
}

export const convertValuesToOption = (arr:any) => {
  try {
    const result:any = []
    arr?.forEach((tag:string) => {
      result.push({
        label: tag,
        value: tag,
      })
    })
    return result;
  }catch(e) {
    return []
  }
}

export const checkAndConvertValue = (values:string[], options:any) => {
  try {
    const skillsAdded: string[] = []
    const objectMap:any = {}
    options?.forEach((item :any) => {
      if(item?.value) {
        objectMap[item?.value] = true
      }
    })
    values?.forEach((item:any) => {
      if(!objectMap[item]) {
        skillsAdded?.push(item)
      }
    })
    if(skillsAdded?.length) {
      const newOption =  skillsAdded?.map((item:String) => ({
        label: item,
        value: item
      }))
      return [...options, ...newOption]
    }
    return null
  } catch (error) {
    return null
  }
}

export function generateString(number: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = ' ';
  const charactersLength = characters.length;
  for (let i = 0; i < number; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export function findMaxId(arr: { id: number }[]): number {
  let maxId = Number.MIN_SAFE_INTEGER;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id > maxId) {
      maxId = arr[i].id;
    }
  }
  return maxId;
}

export const parseString = (value: any) => {
  try {
    return JSON.parse(value)
  } catch (error) {
    return ''
  }
}

export function processPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber.startsWith("84")) {
    phoneNumber = "+84" + phoneNumber;
  }else if(phoneNumber.startsWith("8484")) {
    phoneNumber = "+" + phoneNumber.substring(2)
  } else if(phoneNumber.startsWith("84")) {
    phoneNumber = "+" + phoneNumber
  }
  return phoneNumber;
}

export const setLocalUserData = (
  accessToken: string,
  refreshToken: string
) => {
  return {
    accessToken: window.localStorage.setItem("access_token", accessToken),
    refreshToken: window.localStorage.setItem("refresh_token", refreshToken)
  }
}

export const getLocalUserData = () => {
  if (typeof window !== 'undefined') {
    return {
      accessToken: window.localStorage.getItem("access_token"),
      refreshToken: window.localStorage.getItem("refresh_token")
    };
  } else {
    
    return {
      accessToken: "",
      refreshToken: ""
    };
  }
}

export const clearLocalUserData = () => {
  window.localStorage.removeItem("access_token")
  window.localStorage.removeItem("refresh_token")
}