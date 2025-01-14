import handleLoadCSV from '@/components/handleLoadCSV';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';

const { width, height } = Dimensions.get('window');

const Menu = () => {
  const route = useRouter();
  const dispatch = useDispatch();
  
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
        onPress={async () => {await handleLoadCSV(dispatch)}}
    >
        <Text style={stylesMenu.buttonText}>Load your data...</Text>
    </TouchableOpacity>
    <TouchableOpacity
        style={stylesMenu.importButton}
        onPress={() => { console.log("Load your data...") }}
    >
        <Text style={stylesMenu.buttonText}>Trading with chatGPT</Text>
    </TouchableOpacity>
    <TouchableOpacity
    style={stylesMenu.startButton}
    onPress={() => { route.push('/homeScreen') }}
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
