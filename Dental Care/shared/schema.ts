import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(), // This will be the email
  password: text("password").notNull(),
  role: text("role", { enum: ["patient", "doctor"] }).notNull(),
  name: text("name").notNull(),
  // Patient specific
  phone: text("phone"),
  // Doctor specific
  specialty: text("specialty"),
  experience: text("experience"),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  doctorId: integer("doctor_id").notNull(),
  date: text("date").notNull(), // Storing as string for simplicity YYYY-MM-DD
  time: text("time").notNull(),
  status: text("status", { enum: ["scheduled", "completed", "cancelled"] }).default("scheduled").notNull(),
  reason: text("reason"),
});

export const prescriptions = pgTable("prescriptions", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  doctorId: integer("doctor_id").notNull(),
  date: text("date").notNull(),
  diagnosis: text("diagnosis").notNull(),
  medicines: text("medicines").notNull(), // Simple text or JSON string for medicines
  dosage: text("dosage").notNull(),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true, status: true });
export const insertPrescriptionSchema = createInsertSchema(prescriptions).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Prescription = typeof prescriptions.$inferSelect;
export type InsertPrescription = z.infer<typeof insertPrescriptionSchema>;
