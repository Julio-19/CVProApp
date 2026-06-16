import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../config/supabase";

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const [targetRoute, setTargetRoute] = useState("/login");

  useEffect(() => {
    const checkSession = async () => {
      try {
        // 1. Vérifier onboarding
        const onboardingDone = await AsyncStorage.getItem("onboarding_done");
        if (!onboardingDone) {
          setTargetRoute("/onboarding");
          setIsReady(true);
          return;
        }

        // 2. Vérifier session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setTargetRoute("/cv/step1-profil");
        } else {
          setTargetRoute("/login");
        }
      } catch (error) {
        console.error("Erreur:", error);
        setTargetRoute("/login");
      } finally {
        setIsReady(true);
      }
    };

    checkSession();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return <Redirect href={targetRoute} />;
}
