import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, Switch, TouchableOpacity,StyleSheet} from 'react-native';
import { login } from '../src/api';
import { AuthContext } from '../context/AuthContext';
import { Alert } from "react-native";

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const { setUser, rememberedEmail, setRememberedEmail, biometricLogin } = useContext(AuthContext);

  useEffect(() => {
    if (rememberedEmail) setEmail(rememberedEmail);
  }, [rememberedEmail]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Uyarı", "Lütfen email ve şifrenizi girin.");
      return;
    }
  
    try {
      const res = await login(email, password, remember);
  
      if (res.success) {
        setUser(res.user);
        if (remember) setRememberedEmail(email);
      } else {
        Alert.alert("Hata", "Giriş başarısız.");
      }
    }
    
    catch (error) {
      console.log("Gelen HATA:", JSON.stringify(error, null, 2));
      const status = error.response?.status;
      const code = error.response?.data?.message;
  
      if (code === "KULLANICI_BULUNAMADI") {
        Alert.alert("Kullanıcı bulunamadı", "Bu email adresine ait bir kullanıcı yok.");
      } else if (code === "SIFRE_HATALI") {
        Alert.alert("Şifre hatalı", "Girdiğiniz şifre yanlış.");
      } else if (status === 500) {
        Alert.alert("Sunucu Hatası", "Sunucuda bir hata oluştu.");
      } else {
        Alert.alert("Bağlantı Hatası", "Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.");
      }
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎮 GameCenter Giriş</Text>

      {rememberedEmail && (
        <TouchableOpacity style={styles.quickBox} onPress={biometricLogin}>
          <Text style={styles.quickText}>🔓 {rememberedEmail}</Text>
          <Text style={styles.quickDesc}>Parmak izi ile hızlı giriş</Text>
        </TouchableOpacity>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Şifre"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={() => Alert.alert("Yeni Şifre", "Yeni şifreniz mailinize gönderilmiştir.")}>
  <Text style={{ color: "#007bff", marginBottom: 20 }}>Şifremi Unuttum</Text>
</TouchableOpacity>


      <View style={styles.switchRow}>
        <Text style={styles.switchText}>Beni Hatırla</Text>
        <Switch value={remember} onValueChange={setRemember} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#343a40",
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    borderColor: "#dee2e6",
    borderWidth: 1,
    marginBottom: 15,
    fontSize: 16,
    color: "#212529",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  switchText: {
    fontSize: 16,
    color: "#495057",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "600",
  },
  quickBox: {
    backgroundColor: "#e9ecef",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  quickText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212529",
  },
  quickDesc: {
    fontSize: 13,
    color: "#6c757d",
    marginTop: 4,
  },
});
;
