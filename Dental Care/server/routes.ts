import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Set up session management
  const SessionStore = MemoryStore(session);
  app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 86400000 },
    store: new SessionStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
  }));

  // Auth Middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Auth Routes
  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existingUser = await storage.getUserByUsername(input.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const user = await storage.createUser(input);
      req.session.userId = user.id;
      res.status(201).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByUsername(input.username);
      if (!user || user.password !== input.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      req.session.userId = user.id;
      res.status(200).json(user);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy(() => {
      res.status(200).send();
    });
  });

  app.get(api.auth.me.path, async (req, res) => {
    if (!req.session.userId) {
      return res.status(200).json(null);
    }
    const user = await storage.getUser(req.session.userId);
    res.json(user || null);
  });

  // Data Routes
  app.get(api.doctors.list.path, async (req, res) => {
    const doctors = await storage.getDoctors();
    res.json(doctors);
  });

  app.get(api.patients.list.path, requireAuth, async (req, res) => {
    const patients = await storage.getPatients();
    res.json(patients);
  });

  app.get(api.appointments.list.path, requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session.userId);
    if (!user) return res.status(401).send();
    const appointments = await storage.getAppointments(user.id, user.role as 'patient' | 'doctor');
    res.json(appointments);
  });

  app.post(api.appointments.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.appointments.create.input.parse(req.body);
      // Validate that patientId matches logged in user if user is patient
      const user = await storage.getUser(req.session.userId);
      if (user?.role === 'patient' && input.patientId !== user.id) {
        return res.status(403).json({ message: "Cannot book for another patient" });
      }
      const appointment = await storage.createAppointment(input);
      res.status(201).json(appointment);
    } catch (err) {
      res.status(400).json({ message: "Validation error" });
    }
  });

  app.post(api.appointments.cancel.path.replace(':id', ':id'), requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const appointment = await storage.cancelAppointment(id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json(appointment);
  });

  app.get(api.prescriptions.list.path, requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session.userId);
    if (!user) return res.status(401).send();
    const prescriptions = await storage.getPrescriptions(user.id, user.role as 'patient' | 'doctor');
    res.json(prescriptions);
  });

  app.post(api.prescriptions.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.prescriptions.create.input.parse(req.body);
      const user = await storage.getUser(req.session.userId);
      if (user?.role !== 'doctor') return res.status(403).json({ message: "Only doctors can create prescriptions" });
      
      const prescription = await storage.createPrescription(input);
      res.status(201).json(prescription);
    } catch (err) {
      res.status(400).json({ message: "Validation error" });
    }
  });

  // Seed Data
  await seedData();

  return httpServer;
}

async function seedData() {
  const doctors = await storage.getDoctors();
  if (doctors.length === 0) {
    await storage.createUser({
      username: "doctor1@clinic.com",
      password: "password123",
      role: "doctor",
      name: "Dr. Sarah Smith",
      specialty: "Orthodontist",
      experience: "10 years",
      phone: "555-0101"
    });
    await storage.createUser({
      username: "doctor2@clinic.com",
      password: "password123",
      role: "doctor",
      name: "Dr. James Wilson",
      specialty: "General Dentist",
      experience: "15 years",
      phone: "555-0102"
    });
    console.log("Seeded initial doctors");
  }
}
