import { z } from 'zod';
import { insertUserSchema, insertAppointmentSchema, insertPrescriptionSchema, users, appointments, prescriptions } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({
        username: z.string().email(),
        password: z.string(),
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    register: {
      method: 'POST' as const,
      path: '/api/register',
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: {
        200: z.void(),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<typeof users.$inferSelect | null>(),
      },
    },
  },
  doctors: {
    list: {
      method: 'GET' as const,
      path: '/api/doctors',
      responses: {
        200: z.array(z.custom<typeof users.$inferSelect>()),
      },
    },
  },
  patients: {
    list: {
      method: 'GET' as const,
      path: '/api/patients', // For doctors to see their patients
      responses: {
        200: z.array(z.custom<typeof users.$inferSelect>()),
      },
    },
  },
  appointments: {
    list: {
      method: 'GET' as const,
      path: '/api/appointments', // Returns appointments for the logged-in user (patient or doctor)
      responses: {
        200: z.array(z.custom<typeof appointments.$inferSelect & { patientName?: string, doctorName?: string }>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/appointments',
      input: insertAppointmentSchema,
      responses: {
        201: z.custom<typeof appointments.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    cancel: {
      method: 'POST' as const,
      path: '/api/appointments/:id/cancel',
      responses: {
        200: z.custom<typeof appointments.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  prescriptions: {
    list: {
      method: 'GET' as const,
      path: '/api/prescriptions', // For patients to view, doctors to view
      responses: {
        200: z.array(z.custom<typeof prescriptions.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/prescriptions',
      input: insertPrescriptionSchema,
      responses: {
        201: z.custom<typeof prescriptions.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
