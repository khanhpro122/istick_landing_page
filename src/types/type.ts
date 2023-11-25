type TTypes = 'ONLINE' | 'online';

export type TPropEvent = {
  id: number;
  slug: string;
  bannerUrl: string;
  title: string;
  host: string;
  types: TTypes[];
  cost: number;
  registrationDeadline: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type TUser = {
  address?: string;
  avatar?: string | null;
  company?: string;
  dateOfBirth?: Date | null | string;
  email?: string;
  fullname?: string;
  id?: number;
  jobTitle?: string;
  lastname?: string;
  merchantId?: number
  phoneNumber?: string;
  socialTitle?: string;
  status?: string;
  userTags?: string[];
  userType?: string
  username?: string;
  gender?: string;
  codePhone?: string;
  seekingStatus: string;
}

export type TJob = {
  jobTypes: string[],
  avatar: null | string,
  description: string,
  jobTags: string[],
  salaryFrom: string,
  salaryTo: string,
  qualification: string,
  overview: string,
  position: string,
  workingDays: string,
  website: string,
  name: string,
  companyId: string,
  location: string,
}
