import { supabase } from '../config/supabase';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';

// ── Upload photo ──────────────────────────────────────────────────────────────
export const uploaderPhoto = async (uri: string): Promise<string> => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Non connecté');

    // Si c'est déjà du base64 ou une URL https, retourner directement
    if (uri.startsWith('https') || uri.startsWith('data:image')) return uri;

    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const fileName = `${user.id}/photo_cv_${Date.now()}.jpg`;

    const { error } = await supabase.storage
      .from('photos-cv')
      .upload(fileName, decode(base64), {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from('photos-cv')
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error: any) {
    console.log('Erreur upload photo (ignorée):', error.message);
    return uri; // retourner l'URI originale si échec
  }
};

// ── Sauvegarder CV (insert ou update) ────────────────────────────────────────
export const sauvegarderCV = async (cvData: any): Promise<string> => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Non connecté');

  console.log('💾 Sauvegarde CV:', cvData.prenom, cvData.nom);

  const cvToSave = {
    user_id:        user.id,
    prenom:         cvData.prenom        ?? '',
    nom:            cvData.nom           ?? '',
    titre:          cvData.titre         ?? '',
    objectif:       cvData.objectif      ?? '',
    email:          cvData.email         ?? '',
    telephone:      cvData.telephone     ?? '',
    ville:          cvData.ville         ?? '',
    photo_url:      cvData.photo         ?? null,
    experiences:    cvData.experiences   ?? [],
    formations:     cvData.formations    ?? [],
    competences:    cvData.competences   ?? [],
    langues:        cvData.langues       ?? [],
    loisirs:        cvData.loisirs       ?? [],
    reseaux:        cvData.reseaux       ?? [],
    certifications: cvData.certifications ?? [],
    projets:        cvData.projets       ?? [],
    template_id:    cvData.templateId    ?? 'sidebar_bleu',
    updated_at:     new Date().toISOString(),
  };

  // Vérifier si un CV existe déjà pour cet utilisateur
  const { data: existant } = await supabase
    .from('cvs')
    .select('id')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  let cvId: string;

  if (existant?.id) {
    // ── Mettre à jour le CV existant ──────────────────────────────────────
    console.log('📝 Mise à jour CV existant:', existant.id);
    const { error } = await supabase
      .from('cvs')
      .update(cvToSave)
      .eq('id', existant.id);

    if (error) {
      console.error('Erreur update:', error.message);
      throw new Error(error.message);
    }
    cvId = existant.id;
  } else {
    // ── Créer un nouveau CV ───────────────────────────────────────────────
    console.log('✨ Création nouveau CV');
    const { data, error } = await supabase
      .from('cvs')
      .insert(cvToSave)
      .select('id')
      .single();

    if (error) {
      console.error('Erreur insert:', error.message);
      throw new Error(error.message);
    }
    cvId = data.id;
  }

  console.log('✅ CV sauvegardé avec ID:', cvId);
  return cvId;
};

// ── Mettre à jour un CV spécifique ───────────────────────────────────────────
export const mettreAJourCV = async (cvId: string, cvData: any) => {
  const { error } = await supabase
    .from('cvs')
    .update({
      prenom:         cvData.prenom         ?? '',
      nom:            cvData.nom            ?? '',
      titre:          cvData.titre          ?? '',
      objectif:       cvData.objectif       ?? '',
      email:          cvData.email          ?? '',
      telephone:      cvData.telephone      ?? '',
      ville:          cvData.ville          ?? '',
      photo_url:      cvData.photo          ?? null,
      experiences:    cvData.experiences    ?? [],
      formations:     cvData.formations     ?? [],
      competences:    cvData.competences    ?? [],
      langues:        cvData.langues        ?? [],
      loisirs:        cvData.loisirs        ?? [],
      reseaux:        cvData.reseaux        ?? [],
      certifications: cvData.certifications ?? [],
      projets:        cvData.projets        ?? [],
      template_id:    cvData.templateId     ?? 'sidebar_bleu',
      updated_at:     new Date().toISOString(),
    })
    .eq('id', cvId);

  if (error) throw new Error(error.message);
};

// ── Récupérer tous les CVs de l'utilisateur ───────────────────────────────────
export const recupererMesCVs = async () => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Non connecté');

  const { data, error } = await supabase
    .from('cvs')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

// ── Supprimer un CV ───────────────────────────────────────────────────────────
export const supprimerCV = async (cvId: string) => {
  const { error } = await supabase
    .from('cvs')
    .delete()
    .eq('id', cvId);

  if (error) throw new Error(error.message);
};