export interface ILoginFormValues {
  personalNumber: string; 
  password: string;       
};

export interface ILoginFormProps {
  onSubmit?: (values: ILoginFormValues) => void | Promise<void>;
  isLoading?: boolean;
};