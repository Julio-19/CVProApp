import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

type Experience = {
  poste: string;
  entreprise: string;
  debut: string;
  fin: string;
  description: string;
};

type Formation = {
  diplome: string;
  etablissement: string;
  annee: string;
};

type Langue = {
  langue: string;
  niveau: string;
};

type ReseauSocial = {
  reseau: string;
  url: string;
};

type Certification = {
  titre: string;
  organisme: string;
  annee: string;
  url?: string;
};

type Projet = {
  titre: string;
  description: string;
  technologies: string;
  url?: string;
};

type CVStore = {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  ville: string;
  titre: string;
  objectif: string;
  photo: string | null;
  experiences: Experience[];
  formations: Formation[];
  competences: string[];
  langues: Langue[];
  loisirs: string[];
  templateId: string | null;
  reseaux: ReseauSocial[];
  certifications: Certification[];
  projets: Projet[];

  setField: (key: string, value: any) => void;
  addExperience: (exp: Experience) => void;
  removeExperience: (index: number) => void;
  updateExperience: (index: number, exp: Experience) => void;
  addFormation: (formation: Formation) => void;
  removeFormation: (index: number) => void;
  updateFormation: (index: number, f: Formation) => void;
  addCompetence: (competence: string) => void;
  removeCompetence: (competence: string) => void;
  addLangue: (langue: Langue) => void;
  removeLangue: (index: number) => void;
  addLoisir: (loisir: string) => void;
  removeLoisir: (loisir: string) => void;
  setTemplate: (id: string) => void;
  addReseau: (reseau: ReseauSocial) => void;
  removeReseau: (index: number) => void;
  addCertification: (cert: Certification) => void;
  removeCertification: (index: number) => void;
  addProjet: (projet: Projet) => void;
  removeProjet: (index: number) => void;
  reset: () => void;
};

const initialState = {
  prenom: '', nom: '', email: '', telephone: '',
  ville: '', titre: '', objectif: '', photo: null,
  experiences: [], formations: [], competences: [],
  langues: [], loisirs: [], templateId: null,
  reseaux: [], certifications: [], projets: [],
};

// ── Storage adapté selon la plateforme ────────────────────────────────────────
const webStorage = {
  getItem: (name: string): string | null => {
    try { return localStorage.getItem(name); }
    catch { return null; }
  },
  setItem: (name: string, value: string): void => {
    try { localStorage.setItem(name, value); }
    catch {}
  },
  removeItem: (name: string): void => {
    try { localStorage.removeItem(name); }
    catch {}
  },
};

const storage = Platform.OS === 'web'
  ? createJSONStorage(() => webStorage)
  : createJSONStorage(() => AsyncStorage);

export const useCVStore = create<CVStore>()(
  persist(
    (set) => ({
      ...initialState,

      setField: (key, value) => set((state) => ({ ...state, [key]: value })),

      addExperience:    (exp) => set((s) => ({ experiences: [...s.experiences, exp] })),
      removeExperience: (i)   => set((s) => ({ experiences: s.experiences.filter((_, idx) => idx !== i) })),
      updateExperience: (i, exp) => set((s) => ({
        experiences: s.experiences.map((e, idx) => idx === i ? exp : e)
      })),

      addFormation:    (f) => set((s) => ({ formations: [...s.formations, f] })),
      removeFormation: (i) => set((s) => ({ formations: s.formations.filter((_, idx) => idx !== i) })),
      updateFormation: (i, f) => set((s) => ({
        formations: s.formations.map((e, idx) => idx === i ? f : e)
      })),

      addCompetence:    (c) => set((s) => ({ competences: [...s.competences, c] })),
      removeCompetence: (c) => set((s) => ({ competences: s.competences.filter((x) => x !== c) })),

      addLangue:    (l) => set((s) => ({ langues: [...s.langues, l] })),
      removeLangue: (i) => set((s) => ({ langues: s.langues.filter((_, idx) => idx !== i) })),

      addLoisir:    (l) => set((s) => ({ loisirs: [...s.loisirs, l] })),
      removeLoisir: (l) => set((s) => ({ loisirs: s.loisirs.filter((x) => x !== l) })),

      addReseau:    (r) => set((s) => ({ reseaux: [...s.reseaux, r] })),
      removeReseau: (i) => set((s) => ({ reseaux: s.reseaux.filter((_, idx) => idx !== i) })),

      addCertification:    (c) => set((s) => ({ certifications: [...s.certifications, c] })),
      removeCertification: (i) => set((s) => ({ certifications: s.certifications.filter((_, idx) => idx !== i) })),

      addProjet:    (p) => set((s) => ({ projets: [...s.projets, p] })),
      removeProjet: (i) => set((s) => ({ projets: s.projets.filter((_, idx) => idx !== i) })),

      setTemplate: (id) => {
        console.log('✅ setTemplate appelé avec:', id);
        set({ templateId: id });
      },

      reset: () => set(initialState),
    }),
    {
      name: 'cv-storage',
      storage,
    }
  )
);