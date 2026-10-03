import type {
  CreateEmployee,
  CreateItemCategory,
  CreateSupplier,
  Employee,
  ItemCategory,
  Supplier,
  UpdateEmployee,
  UpdateItemCategory,
  UpdateSupplier,
} from "@/types";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const details: unknown = await response.json().catch(() => undefined);
    const message =
      typeof details === "object" && details !== null && "detail" in details
        ? String((details as { detail: unknown }).detail)
        : `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, details);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function resourceApi<T extends { id: number }, Create, Update>(endpoint: string) {
  const url = `/api/${endpoint}/`;
  return {
    getAll: () => request<T[]>(url),
    getById: (id: number) => request<T>(`${url}${id}/`),
    create: (data: Create) =>
      request<T>(url, { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Update) =>
      request<T>(`${url}${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: number) => request<void>(`${url}${id}/`, { method: "DELETE" }),
  };
}

export const employeesApi = resourceApi<Employee, CreateEmployee, UpdateEmployee>("employees");
export const suppliersApi = resourceApi<Supplier, CreateSupplier, UpdateSupplier>("suppliers");
export const categoriesApi = resourceApi<
  ItemCategory,
  CreateItemCategory,
  UpdateItemCategory
>("categories");
