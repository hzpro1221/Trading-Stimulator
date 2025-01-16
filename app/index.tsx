import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';

import * as DocumentPicker from 'expo-document-picker';

const { width, height } = Dimensions.get('window');

const uploadData = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
    });
    
    if (result.assets != null) {
      const { uri, name, mimeType } = result['assets'][0];

      const formData = new FormData();
      formData.append('file', {
        uri,
        name,
        type: mimeType || 'application/octet-stream', 
      });

      try {
        const response = await fetch("http://10.136.133.179:5000/api/uploadData", {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });

        const responseText = await response.text(); 
        if (response.ok) {
          Alert.alert('CSV Loaded', "Data Loaded Successfully");
        } else {
          Alert.alert('Error', `Failed to load data: ${responseText.data}`);
        }

      } catch (err) {
        Alert.alert('Error', `Error fetching API: ${err}`);
      } 
    }
  } catch (error) {
    Alert.alert('Error', `Error fetching API: ${error}`);
  }
};

const uploadCode = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
    });
    
    if (result.assets != null) {
      const { uri, name, mimeType } = result['assets'][0];

      const formData = new FormData();
      formData.append('file', {
        uri,
        name,
        type: mimeType || 'application/octet-stream', 
      });

      try {
        const response = await fetch("10.136.133.179:5000/api/uploadCode", {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });

        const responseText = await response.text(); 
        if (response.ok) {
          Alert.alert('CSV Loaded', "Code Loaded Successfully");
        } else {
          Alert.alert('Error', `Failed to load code: ${responseText.data}`);
        }
      } catch (err) {
        Alert.alert('Error', `Error fetching API: ${err}`);
      } 
    }
  } catch (error) {
    Alert.alert('Error', `Error fetching API: ${error}`);
  }
};

const evaluate = async () => {
    try {
      const response = await fetch("http://10.136.133.179:5000/api/evaluate", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseText = await response.text(); 
      if (response.ok) {
        Alert.alert('CSV Loaded', "Data process Successfully");
      } else {
        Alert.alert('Error', `Failed to load data: ${responseText.data}`);
      }

    } catch (err) {
      Alert.alert('Error', `Error fetching API: ${err}`);
    } 
};

const Menu = () => {
  const route = useRouter();
  
  return (
    <View style={stylesMenu.scene}>
      <Text style={stylesMenu.title}>TRADING STIMULATOR</Text>
    <TouchableOpacity
        style={stylesMenu.importButton}
        onPress={() => { console.log("Load your code...") }}
    >
        <Text style={stylesMenu.buttonText}>Load your code...</Text>
    </TouchableOpacity>
    <TouchableOpacity
        style={stylesMenu.importButton}
        onPress={async () => {await uploadData()}}
    >
        <Text style={stylesMenu.buttonText}>Load your data...</Text>
    </TouchableOpacity>
    <TouchableOpacity
        style={stylesMenu.importButton}
        onPress={async () => {await uploadCode()}}
    >
        <Text style={stylesMenu.buttonText}>Trading with chatGPT</Text>
    </TouchableOpacity>
    <TouchableOpacity
    style={stylesMenu.startButton}
    onPress={async () => { 
      await evaluate()
      route.push('/homeScreen') }}
    >
    <Text style={stylesMenu.startButtonText}>Start evaluate!</Text>
    </TouchableOpacity>
    </View>
  );
};

const stylesMenu = StyleSheet.create({
  scene: {
    flex: 1,
    padding: "10%",
    backgroundColor: "lavender",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    color: "grey",
    fontSize: width * 0.13,
    textAlign: "center",
  },
  importButton: {
    backgroundColor: "darkgrey",  
    width: width * 0.7,
    height: height * 0.06,
    alignItems: "center",  
    justifyContent: "center",
    margin: "3%"
  },
  buttonText: {
    color: "#ffffff", 
    fontSize: width * 0.06  
  },
  startButton: {
    backgroundColor: "darkseagreen", 
    width: width * 0.8,
    height: height * 0.08,
    margin: "14%",
    alignItems: "center",  
    justifyContent: "center",
  },

  startButtonText: {
    color: "black", 
    fontSize: width * 0.08,
    fontWeight: "500",
  }
});

export default Menu;