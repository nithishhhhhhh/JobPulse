import { JobApplication, JobApplicationInput, ApplicationStatus } from '../types/job';

const STORAGE_KEY = 'jobpulse_applications_v2';

/**
 * Storage repository interface.
 * Can be swapped with MongoDB / REST API repository without touching UI components.
 */
export interface IJobRepository {
  getAll(): Promise<JobApplication[]>;
  getById(id: string): Promise<JobApplication | null>;
  create(data: JobApplicationInput): Promise<JobApplication>;
  update(id: string, updates: Partial<JobApplication>): Promise<JobApplication>;
  delete(id: string): Promise<void>;
  updateStatus(id: string, status: ApplicationStatus): Promise<JobApplication>;
  setArchived(id: string, isArchived: boolean): Promise<JobApplication>;
  setFollowUp(id: string, followUpDate: string | undefined, followUpNote?: string): Promise<JobApplication>;
  clearAll(): Promise<void>;
}

export class LocalStorageJobRepository implements IJobRepository {
  private getStorage(): JobApplication[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  private setStorage(items: JobApplication[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save applications', e);
    }
  }

  async getAll(): Promise<JobApplication[]> {
    return this.getStorage();
  }

  async getById(id: string): Promise<JobApplication | null> {
    const list = this.getStorage();
    return list.find((item) => item.id === id) || null;
  }

  async create(data: JobApplicationInput): Promise<JobApplication> {
    const list = this.getStorage();
    const newApp: JobApplication = {
      ...data,
      id: 'app-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.unshift(newApp);
    this.setStorage(list);
    return newApp;
  }

  async update(id: string, updates: Partial<JobApplication>): Promise<JobApplication> {
    const list = this.getStorage();
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Application not found.`);
    }

    const updatedApp: JobApplication = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updatedApp;
    this.setStorage(list);
    return updatedApp;
  }

  async delete(id: string): Promise<void> {
    const list = this.getStorage();
    const filtered = list.filter((item) => item.id !== id);
    this.setStorage(filtered);
  }

  async updateStatus(id: string, status: ApplicationStatus): Promise<JobApplication> {
    return this.update(id, { status });
  }

  async setArchived(id: string, isArchived: boolean): Promise<JobApplication> {
    return this.update(id, { isArchived });
  }

  async setFollowUp(id: string, followUpDate: string | undefined, followUpNote?: string): Promise<JobApplication> {
    const current = await this.getById(id);
    if (!current) throw new Error('Application not found');

    let updatedNotes = current.notes || '';
    if (followUpNote && followUpNote.trim()) {
      const timestamp = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const entry = `\n[Follow-up ${timestamp}]: ${followUpNote.trim()}`;
      updatedNotes = updatedNotes ? updatedNotes + entry : `[Follow-up ${timestamp}]: ${followUpNote.trim()}`;
    }

    return this.update(id, {
      followUpDate: followUpDate || undefined,
      notes: updatedNotes,
    });
  }

  async clearAll(): Promise<void> {
    this.setStorage([]);
  }
}

// Singleton repository instance
export const jobRepository: IJobRepository = new LocalStorageJobRepository();
