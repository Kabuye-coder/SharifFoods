/** JSON returned by DRF's default ModelSerializer representation. */
export type EmployeeRole = "Manager" | "Chef" | "Waiter" | "Cashier";

export interface Employee {
  id: number;
  /** Primary key of the related Django User. */
  user: number;
  role: EmployeeRole;
  phone: string;
  /** ISO 8601 date (YYYY-MM-DD). */
  hire_date: string;
  /** DecimalField is serialized by DRF as a string by default. */
  salary: string;
  is_active: boolean;
}

export interface Supplier {
  id: number;
  contact_name: string;
  company_name: string;
  email: string;
  phone: string;
  address: string;
}

export interface ItemCategory {
  id: number;
  name: string;
  description: string;
}

/** Fields accepted when creating/updating an object; database IDs are assigned by Django. */
export type CreateEmployee = Omit<Employee, "id">;
export type UpdateEmployee = Partial<CreateEmployee>;
export type CreateSupplier = Omit<Supplier, "id">;
export type UpdateSupplier = Partial<CreateSupplier>;
export type CreateItemCategory = Omit<ItemCategory, "id">;
export type UpdateItemCategory = Partial<CreateItemCategory>;
