import { supabase } from '../config/supabase';

export const connexion = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  console.log('=== CONNEXION DEBUG ===');
  console.log('DATA:', JSON.stringify(data?.user?.email));
  console.log('SESSION:', JSON.stringify(data?.session?.access_token?.slice(0, 20)));
  console.log('ERROR:', JSON.stringify(error));
  console.log('======================');

  if (error) throw error;
  if (!data.session) throw new Error('Session non créée');

  return data;
};

export const inscription = async (email: string, password: string, prenom: string, nom: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) throw error;
  if (!data.user) throw new Error('Utilisateur non créé');

  // Créer le profil avec upsert pour éviter le duplicate key
  const { error: profilError } = await supabase
    .from('profiles')
    .upsert(
      { id: data.user.id, prenom, nom, email },
      { onConflict: 'id' }
    );

  if (profilError) {
    console.log('Erreur profil (ignorée):', profilError.message);
  }

  return data;
};

export const deconnexion = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};