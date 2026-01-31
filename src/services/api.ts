// Mock API Service for UK Pathway Hub
// This simulates backend API calls with fake data

export interface ServiceModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  status: 'available' | 'coming_soon';
}

export interface UserProfile {
  is_locked: any;
  subscription_type: string;
  last_name: ReactNode;
  first_name: ReactNode;
  id: string;
  name: string;
  email: string;
  userType: 'migrant' | 'resident' | 'employer';
  country?: string;
  visaStatus?: string;
}

export interface Application {
  id: string;
  type: 'visa' | 'admission' | 'job' | 'housing' | 'driving_test';
  status: 'pending' | 'in_progress' | 'approved' | 'rejected';
  title: string;
  submittedAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  country: string;
  message: string;
  avatar: string;
}

export interface Stat {
  label: string;
  value: string;
  suffix?: string;
}

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Data
const serviceModules: ServiceModule[] = [
  {
    id: 'admission-visa',
    title: 'Admission & Visa',
    description: 'University selection, application submission, document management, and visa application tracking.',
    icon: 'GraduationCap',
    features: ['University matching', 'Document upload', 'Visa tracking', 'Expert guidance'],
    status: 'available',
  },
  {
    id: 'job-sponsorship',
    title: 'Job & Sponsorship',
    description: 'Automated job applications, employer sponsorship matching, and interview scheduling.',
    icon: 'Briefcase',
    features: ['Job matching', 'Sponsorship finder', 'CV builder', 'Interview prep'],
    status: 'available',
  },
  {
    id: 'travel-arrival',
    title: 'Travel & Arrival',
    description: 'Flight booking, airport pickup, and seamless transfer coordination.',
    icon: 'Plane',
    features: ['Flight booking', 'Airport pickup', 'Transfer service', 'Arrival support'],
    status: 'available',
  },
  {
    id: 'accommodation',
    title: 'Accommodation & Essentials',
    description: 'Housing assistance, NHS registration, UK SIM and banking setup.',
    icon: 'Home',
    features: ['Housing search', 'NHS registration', 'Bank account', 'SIM setup'],
    status: 'available',
  },
  {
    id: 'driving-test',
    title: 'Fast-Track Driving Test',
    description: 'Automated detection and booking of earlier driving test slots via DVSA.',
    icon: 'Car',
    features: ['Slot monitoring', 'Auto-booking', 'Test prep', 'Instructor matching'],
    status: 'available',
  },
  {
    id: 'settlement',
    title: 'Settlement & Integration',
    description: 'Visa switching, ILR application guidance, and family relocation assistance.',
    icon: 'Users',
    features: ['Visa switching', 'ILR guidance', 'Family reunion', 'Citizenship path'],
    status: 'available',
  },
];

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    role: 'Software Engineer',
    country: 'India',
    message: 'UK Pathway made my dream of working in London a reality. From visa to job placement, everything was seamless.',
    avatar: 'PS',
  },
  {
    id: '2',
    name: 'Ahmed Hassan',
    role: 'PhD Student',
    country: 'Egypt',
    message: 'The admission process was incredibly smooth. I got into my dream university with their expert guidance.',
    avatar: 'AH',
  },
  {
    id: '3',
    name: 'Maria Santos',
    role: 'Healthcare Professional',
    country: 'Philippines',
    message: 'Found my sponsored nursing position within weeks. The platform connected me with the right employers.',
    avatar: 'MS',
  },
];

const stats: Stat[] = [
  { label: 'Successful Migrations', value: '15,000', suffix: '+' },
  { label: 'Partner Universities', value: '250', suffix: '+' },
  { label: 'UK Employers', value: '1,200', suffix: '+' },
  { label: 'Success Rate', value: '94', suffix: '%' },
];

// API Functions
export const api = {
  // Get all service modules
  async getServiceModules(): Promise<ServiceModule[]> {
    await delay(300);
    return serviceModules;
  },

  // Get a single service module by ID
  async getServiceModule(id: string): Promise<ServiceModule | undefined> {
    await delay(200);
    return serviceModules.find(m => m.id === id);
  },

  // Get testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    await delay(250);
    return testimonials;
  },

  // Get platform statistics
  async getStats(): Promise<Stat[]> {
    await delay(200);
    return stats;
  },

  // User authentication (mock)
  async login(email: string, password: string): Promise<{ success: boolean; user?: UserProfile }> {
    await delay(500);
    if (email && password) {
      return {
        success: true,
        user: {
          id: '1',
          name: 'John Doe',
          email,
          userType: 'migrant',
          country: 'India',
          visaStatus: 'Skilled Worker',
        },
      };
    }
    return { success: false };
  },

  // Register user (mock)
  async register(data: Partial<UserProfile>): Promise<{ success: boolean; user?: UserProfile }> {
    await delay(600);
    return {
      success: true,
      user: {
        id: Date.now().toString(),
        name: data.name || 'New User',
        email: data.email || '',
        userType: data.userType || 'migrant',
      },
    };
  },

  // Get user applications (mock)
  async getApplications(userId: string): Promise<Application[]> {
    await delay(400);
    return [
      {
        id: '1',
        type: 'visa',
        status: 'in_progress',
        title: 'Skilled Worker Visa Application',
        submittedAt: '2025-01-01',
        updatedAt: '2025-01-05',
      },
      {
        id: '2',
        type: 'job',
        status: 'pending',
        title: 'Senior Developer - Tech Corp',
        submittedAt: '2025-01-03',
        updatedAt: '2025-01-03',
      },
    ];
  },

  // Submit new application (mock)
  async submitApplication(type: Application['type'], data: Record<string, unknown>): Promise<Application> {
    await delay(800);
    return {
      id: Date.now().toString(),
      type,
      status: 'pending',
      title: `New ${type} Application`,
      submittedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
  },
};

export default api;
