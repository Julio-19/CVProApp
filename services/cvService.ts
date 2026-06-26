import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";
import { supabase } from "../config/supabase";

export const sauvegarderCV = async (cv: any, id?: string): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Non connecté');

  const payload = {
    user_id:     user.id,
    prenom:      cv.prenom      ?? '',
    nom:         cv.nom         ?? '',
    titre:       cv.titre       ?? '',
    template_id: cv.templateId  ?? 'sidebar_bleu',
    data:        {
      prenom:         cv.prenom         ?? '',
      nom:            cv.nom            ?? '',
      email:          cv.email          ?? '',
      telephone:      cv.telephone      ?? '',
      ville:          cv.ville          ?? '',
      titre:          cv.titre          ?? '',
      objectif:       cv.objectif       ?? '',
      photo:          cv.photo          ?? null,
      experiences:    cv.experiences    ?? [],
      formations:     cv.formations     ?? [],
      competences:    cv.competences    ?? [],
      langues:        cv.langues        ?? [],
      loisirs:        cv.loisirs        ?? [],
      reseaux:        cv.reseaux        ?? [],
      certifications: cv.certifications ?? [],
      projets:        cv.projets        ?? [],
      templateId:     cv.templateId     ?? 'sidebar_bleu',
    },
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await supabase
      .from('cvs')
      .update(payload)
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) throw error;
    return id;
  } else {
    const { data, error } = await supabase
      .from('cvs')
      .insert({ ...payload, created_at: new Date().toISOString() })
      .select('id')
      .single();
    if (error) throw error;
    return data.id;
  }
};

export const uploaderPhoto = async (uri: string): Promise<string> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non connecté');

    const response = await fetch(uri);
    const blob = await response.blob();
    const fileName = `${user.id}_${Date.now()}.jpg`;

    const { error } = await supabase.storage
      .from('photos-cv')
      .upload(fileName, blob, { contentType: 'image/jpeg', upsert: true });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('photos-cv')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (e: any) {
    console.error('Erreur upload photo:', e);
    return uri;
  }
};

// ── Mettre à jour un CV spécifique par ID ────────────────────────────────────
export const mettreAJourCV = async (cvId: string, cvData: any) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Non connecté");

  const { error } = await supabase
    .from("cvs")
    .update({
      prenom: cvData.prenom ?? "",
      nom: cvData.nom ?? "",
      titre: cvData.titre ?? "",
      objectif: cvData.objectif ?? "",
      email: cvData.email ?? "",
      telephone: cvData.telephone ?? "",
      ville: cvData.ville ?? "",
      photo_url: cvData.photo ?? null,
      experiences: cvData.experiences ?? [],
      formations: cvData.formations ?? [],
      competences: cvData.competences ?? [],
      langues: cvData.langues ?? [],
      loisirs: cvData.loisirs ?? [],
      reseaux: cvData.reseaux ?? [],
      certifications: cvData.certifications ?? [],
      projets: cvData.projets ?? [],
      template_id: cvData.templateId ?? "sidebar_bleu",
      updated_at: new Date().toISOString(),
    })
    .eq("id", cvId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
};

// ── Récupérer TOUS les CVs de l'utilisateur ───────────────────────────────────
export const recupererMesCVs = async () => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Non connecté");

  const { data, error } = await supabase
    .from("cvs")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
};

// ── Supprimer un CV ───────────────────────────────────────────────────────────
export const supprimerCV = async (cvId: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Non connecté");

  const { error } = await supabase
    .from("cvs")
    .delete()
    .eq("id", cvId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
};
