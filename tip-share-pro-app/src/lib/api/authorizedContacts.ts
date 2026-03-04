import { get, post, put, del } from './client';

export interface AuthorizedContact {
  id: string;
  name: string;
  company: string | null;
  email: string;
  createdAt: string;
}

export interface CreateContactRequest {
  name: string;
  company?: string;
  email: string;
}

export interface UpdateContactRequest {
  name?: string;
  company?: string | null;
  email?: string;
}

export async function getAuthorizedContacts(): Promise<AuthorizedContact[]> {
  const data = await get<{ contacts: AuthorizedContact[] }>('/authorized-contacts');
  return data.contacts;
}

export async function createAuthorizedContact(request: CreateContactRequest): Promise<AuthorizedContact> {
  return post<AuthorizedContact>('/authorized-contacts', request);
}

export async function updateAuthorizedContact(id: string, request: UpdateContactRequest): Promise<AuthorizedContact> {
  return put<AuthorizedContact>(`/authorized-contacts/${id}`, request);
}

export async function deleteAuthorizedContact(id: string): Promise<void> {
  await del(`/authorized-contacts/${id}`);
}

export interface SendReportRequest {
  contactIds: string[];
  reportType: string;
  subject: string;
  pdfBase64: string;
  pdfFilename: string;
}

export interface SendReportResponse {
  sent: number;
  recipients: string[];
}

export async function sendReport(request: SendReportRequest): Promise<SendReportResponse> {
  return post<SendReportResponse>('/authorized-contacts/send-report', request);
}
