/**
 * @module ApplicationsAPI
 * Client-side service layer for managing job applications and AI parsing integration.
 */
import api from './axios';
import {
  CreateApplicationData,
  UpdateApplicationData,
  ApplicationStatus,
  ParsedJD,
  AIParseResponse,
  ApplicationStats,
  Application,
} from '../types';

export const getApplications = async (): Promise<Application[]> => {
  const { data } = await api.get<Application[]>('/applications');
  return data;
};

export const getApplication = async (id: string): Promise<Application> => {
  const { data } = await api.get<Application>(`/applications/${id}`);
  return data;
};

export const getApplicationStats = async (): Promise<ApplicationStats> => {
  const { data } = await api.get<ApplicationStats>('/applications/stats');
  return data;
};

export const createApplication = async (
  applicationData: CreateApplicationData
): Promise<Application> => {
  const { data } = await api.post<Application>('/applications', applicationData);
  return data;
};

export const updateApplication = async (
  id: string,
  applicationData: UpdateApplicationData
): Promise<Application> => {
  const { data } = await api.put<Application>(
    `/applications/${id}`,
    applicationData
  );
  return data;
};

export const updateApplicationStatus = async (
  id: string,
  status: ApplicationStatus
): Promise<Application> => {
  const { data } = await api.patch<Application>(`/applications/${id}/status`, {
    status,
  });
  return data;
};

export const deleteApplication = async (id: string): Promise<void> => {
  await api.delete(`/applications/${id}`);
};

export const parseJobDescription = async (
  jdText: string
): Promise<AIParseResponse> => {
  const { data } = await api.post<AIParseResponse>('/applications/parse-jd', {
    jdText,
  });
  return data;
};

/**
 * Initiates a Server-Sent Events (SSE) stream for real-time AI parsing.
 * Provides incremental updates for extracted data and generated resume bullets.
 * 
 * @param jdText - Raw job description text to analyze
 * @param onParsed - Callback for successfully extracted structured data
 * @param onBullet - Callback for each individual resume bullet chunk
 * @param onError - Error handling callback
 * @param onDone - Stream completion callback
 */
export const parseJobDescriptionStream = async (
  jdText: string,
  onParsed: (data: ParsedJD) => void,
  onBullet: (bullet: string) => void,
  onError: (error: string) => void,
  onDone: () => void
) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch('/api/applications/parse-jd-stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ jdText }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to start stream');
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No body in response');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        
        try {
          const event = JSON.parse(line.replace('data: ', ''));
          
          switch (event.type) {
            case 'parsed':
              onParsed(event.data);
              break;
            case 'bullet':
              onBullet(event.data);
              break;
            case 'error':
              onError(event.data);
              break;
            case 'done':
              onDone();
              return;
          }
        } catch (e) {
          console.error('Error parsing SSE line:', e);
        }
      }
    }
  } catch (error: any) {
    onError(error.message);
  }
};

export const exportApplicationsCsv = async (): Promise<void> => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/applications/export/csv', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to export CSV');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `job-applications-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
