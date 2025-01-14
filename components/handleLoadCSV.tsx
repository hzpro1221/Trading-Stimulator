import { setData } from '@/redux/dataSlice';
import { Dispatch, UnknownAction } from '@reduxjs/toolkit';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse'; 
import { Alert } from 'react-native';


const handleLoadCSV = async (dispatch: Dispatch<UnknownAction>) => {
  try {
    const result = await DocumentPicker.getDocumentAsync();

    if (result.assets[0].uri.endsWith(".csv")) {
      const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
      Papa.parse(fileContent, {
        complete: (parsedData) => {
          dispatch(setData(parsedData.data));    
          Alert.alert('CSV Loaded', `Data contains ${parsedData.data.length} rows.`);       
        },
      });
    } else {
      Alert.alert('Error', 'Please select a valid CSV file.');

    }
  } catch (error) {
    Alert.alert('Error', 'An error occurred while loading the file.');
  }
};

export default handleLoadCSV