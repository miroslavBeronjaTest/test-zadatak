export interface Patient {
  date: Date,
  firstName: string,
  lastName: string,
  doctorName: number,
  addresses: Array<Addresses>
  email: string;
  codeVAT: string;
}

export interface Addresses {
  phoneNumber: string,
  street: string,
  city: string,
  zipcode: number,
  country: string,
  state?: string,
  name?: string,
}

export interface Doctors {
  firstName: string;
  id: number;
  lastName: string
  title: string;
}