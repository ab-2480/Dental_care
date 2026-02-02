import { users, appointments, prescriptions, type User, type InsertUser, type Appointment, type InsertAppointment, type Prescription, type InsertPrescription } from "@shared/schema";
import fs from "fs";
import path from "path";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getDoctors(): Promise<User[]>;
  getPatients(): Promise<User[]>;
  
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointments(userId: number, role: 'patient' | 'doctor'): Promise<(Appointment & { patientName?: string, doctorName?: string })[]>;
  cancelAppointment(id: number): Promise<Appointment | undefined>;
  
  createPrescription(prescription: InsertPrescription): Promise<Prescription>;
  getPrescriptions(userId: number, role: 'patient' | 'doctor'): Promise<Prescription[]>;
}

export class FileStorage implements IStorage {
  private dataDir: string;
  private currentIds: { users: number; appointments: number; prescriptions: number };

  constructor() {
    this.dataDir = path.resolve(process.cwd(), "data");
    this.currentIds = { users: 1, appointments: 1, prescriptions: 1 };
    this.initializeIds();
  }

  private readJson<T>(filename: string): T[] {
    const filePath = path.join(this.dataDir, filename);
    if (!fs.existsSync(filePath)) return [];
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content);
    } catch (e) {
      return [];
    }
  }

  private writeJson<T>(filename: string, data: T[]): void {
    const filePath = path.join(this.dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  private initializeIds() {
    const users = this.readJson<User>("users.json");
    const apps = this.readJson<Appointment>("appointments.json");
    const pres = this.readJson<Prescription>("prescriptions.json");

    if (users.length > 0) this.currentIds.users = Math.max(...users.map(u => u.id)) + 1;
    if (apps.length > 0) this.currentIds.appointments = Math.max(...apps.map(a => a.id)) + 1;
    if (pres.length > 0) this.currentIds.prescriptions = Math.max(...pres.map(p => p.id)) + 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    const users = this.readJson<User>("users.json");
    return users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = this.readJson<User>("users.json");
    return users.find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const users = this.readJson<User>("users.json");
    const id = this.currentIds.users++;
    const user: User = { 
      ...insertUser, 
      id, 
      phone: insertUser.phone ?? null, 
      specialty: insertUser.specialty ?? null, 
      experience: insertUser.experience ?? null 
    };
    users.push(user);
    this.writeJson("users.json", users);
    return user;
  }

  async getDoctors(): Promise<User[]> {
    const users = this.readJson<User>("users.json");
    return users.filter(u => u.role === 'doctor');
  }

  async getPatients(): Promise<User[]> {
    const users = this.readJson<User>("users.json");
    return users.filter(u => u.role === 'patient');
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const apps = this.readJson<Appointment>("appointments.json");
    const id = this.currentIds.appointments++;
    const appointment: Appointment = { 
      ...insertAppointment, 
      id, 
      status: 'scheduled',
      reason: insertAppointment.reason ?? null
    };
    apps.push(appointment);
    this.writeJson("appointments.json", apps);
    return appointment;
  }

  async getAppointments(userId: number, role: 'patient' | 'doctor'): Promise<(Appointment & { patientName?: string, doctorName?: string })[]> {
    const apps = this.readJson<Appointment>("appointments.json");
    const users = this.readJson<User>("users.json");
    
    const filtered = role === 'patient' 
      ? apps.filter(a => a.patientId === userId)
      : apps.filter(a => a.doctorId === userId);
      
    return filtered.map(app => {
      const patient = users.find(u => u.id === app.patientId);
      const doctor = users.find(u => u.id === app.doctorId);
      return {
        ...app,
        patientName: patient?.name,
        doctorName: doctor?.name
      };
    });
  }

  async cancelAppointment(id: number): Promise<Appointment | undefined> {
    const apps = this.readJson<Appointment>("appointments.json");
    const index = apps.findIndex(a => a.id === id);
    if (index === -1) return undefined;
    
    apps[index].status = 'cancelled';
    this.writeJson("appointments.json", apps);
    return apps[index];
  }

  async createPrescription(insertPrescription: InsertPrescription): Promise<Prescription> {
    const pres = this.readJson<Prescription>("prescriptions.json");
    const id = this.currentIds.prescriptions++;
    const prescription: Prescription = { ...insertPrescription, id };
    pres.push(prescription);
    this.writeJson("prescriptions.json", pres);
    return prescription;
  }

  async getPrescriptions(userId: number, role: 'patient' | 'doctor'): Promise<Prescription[]> {
    const pres = this.readJson<Prescription>("prescriptions.json");
    if (role === 'patient') {
      return pres.filter(p => p.patientId === userId);
    } else {
      return pres.filter(p => p.doctorId === userId);
    }
  }
}

export const storage = new FileStorage();
