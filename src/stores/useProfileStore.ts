import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Profile, Education, Work, Family, Experience } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ProfileState {
  profile: Profile;
  updateBasic: (basic: Partial<Profile['basic']>) => void;
  
  // New Experience Actions
  addExperience: (exp: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;

  // Legacy Actions (kept for now, but redirecting to new structure where possible or deprecated)
  addEducation: (edu: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addWork: (work: Omit<Work, 'id'>) => void;
  updateWork: (id: string, work: Partial<Work>) => void;
  removeWork: (id: string) => void;
  
  addFamily: (family: Omit<Family, 'id'>) => void;
  updateFamily: (id: string, family: Partial<Family>) => void;
  removeFamily: (id: string) => void;
}

// Pre-filled data removed to avoid personal info leak
const prefilledExperiences: Experience[] = [];

const initialProfile: Profile = {
  basic: {
    name: '',
    gender: '',
    idNumber: '',
    phone: '',
    email: '',
    address: '',
  },
  experiences: prefilledExperiences, // Now empty
  education: [], // Deprecated
  work: [],      // Deprecated
  family: [],
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: initialProfile,
      
      updateBasic: (basic) =>
        set((state) => ({
          profile: {
            ...state.profile,
            basic: { ...state.profile.basic, ...basic },
          },
        })),

      // Experience Actions
      addExperience: (exp) =>
        set((state) => ({
          profile: {
            ...state.profile,
            experiences: [...(state.profile.experiences || []), { ...exp, id: uuidv4() }],
          },
        })),

      updateExperience: (id, exp) =>
        set((state) => ({
          profile: {
            ...state.profile,
            experiences: (state.profile.experiences || []).map((item) =>
              item.id === id ? { ...item, ...exp } : item
            ),
          },
        })),

      removeExperience: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            experiences: (state.profile.experiences || []).filter((item) => item.id !== id),
          },
        })),

      // Legacy Actions
      addEducation: (edu) =>
        set((state) => ({
          profile: {
            ...state.profile,
            education: [...(state.profile.education || []), { ...edu, id: uuidv4() }],
          },
        })),

      updateEducation: (id, edu) =>
        set((state) => ({
          profile: {
            ...state.profile,
            education: (state.profile.education || []).map((item) =>
              item.id === id ? { ...item, ...edu } : item
            ),
          },
        })),

      removeEducation: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            education: (state.profile.education || []).filter((item) => item.id !== id),
          },
        })),

      addWork: (work) =>
        set((state) => ({
          profile: {
            ...state.profile,
            work: [...(state.profile.work || []), { ...work, id: uuidv4() }],
          },
        })),

      updateWork: (id, work) =>
        set((state) => ({
          profile: {
            ...state.profile,
            work: (state.profile.work || []).map((item) =>
              item.id === id ? { ...item, ...work } : item
            ),
          },
        })),

      removeWork: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            work: (state.profile.work || []).filter((item) => item.id !== id),
          },
        })),

      addFamily: (family) =>
        set((state) => ({
          profile: {
            ...state.profile,
            family: [...state.profile.family, { ...family, id: uuidv4() }],
          },
        })),

      updateFamily: (id, family) =>
        set((state) => ({
          profile: {
            ...state.profile,
            family: state.profile.family.map((item) =>
              item.id === id ? { ...item, ...family } : item
            ),
          },
        })),

      removeFamily: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            family: state.profile.family.filter((item) => item.id !== id),
          },
        })),
    }),
    {
      name: 'profile-storage',
      onRehydrateStorage: () => (state) => {
        if (state && state.profile) {
          // Initialize experiences if undefined
          if (!state.profile.experiences) {
             state.profile.experiences = [];
          }

          const hasLegacyData = (state.profile.education?.length || 0) > 0 || (state.profile.work?.length || 0) > 0;
          const hasNewData = (state.profile.experiences?.length || 0) > 0;
          
          if (hasLegacyData && !hasNewData) {
            console.log('Migrating legacy data to new experiences structure...');
            const newExperiences: Experience[] = [];
            
            state.profile.education?.forEach(edu => {
              newExperiences.push({
                id: edu.id,
                type: 'education',
                name: `${edu.school} ${edu.major} ${edu.degree}`, // Merge for single field
                role: '',
                title: '',
                startDate: edu.startDate,
                endDate: edu.endDate,
                description: '',
              });
            });
            
            state.profile.work?.forEach(work => {
              newExperiences.push({
                id: work.id,
                type: 'work',
                name: `${work.company} ${work.position} ${work.description}`, // Merge for single field
                role: '',
                title: '',
                startDate: work.startDate,
                endDate: work.endDate,
                description: '',
              });
            });
            
            state.profile.experiences = newExperiences;
          }
        }
      }
    }
  )
);
