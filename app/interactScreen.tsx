import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window');

function interactScreen() {
  const [userRequest, setUserRequest] = useState('');
  const [gptResponse, setGptResponse] = useState('');
  const [loading, setLoading] = useState(false);  

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://10.136.88.208:5000/api/gpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          request: userRequest,
        }),
      });
  
      const responseText = await response.text(); 
  
      const data = JSON.parse(responseText); 
      setGptResponse(data.message);
    } catch (err) {
      console.error("Error fetching API:", err);
      setGptResponse("Error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
        <Text style={styles.header}>Interact with ChatGPT</Text>
        <TextInput  
          placeholder="Input your request in here"  
          style={styles.input}  
          onChangeText={setUserRequest}  
          multiline={true}  
        />
        <TouchableOpacity 
          style={[styles.button, loading && styles.disabledButton]} 
          onPress={fetchData} 
          disabled={loading}  
        >
          <Text style={styles.buttonText}>Ask!</Text>
        </TouchableOpacity>
        <ScrollView style={styles.scrollView}>  
            <Text style={styles.scrollViewText}>  
              {loading ? "Processing..." : gptResponse}
            </Text>  
        </ScrollView> 
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "lavender",
        padding: "2%",
        alignItems: "center"
    },
    header: {
        fontSize: width * 0.07,
        textAlign: "center",
        padding: height * 0.01 
    },
    input: {  
        height: height * 0.2,
        width: "100%",  
        borderColor: 'gray',  
        borderWidth: 1,  
        textAlignVertical: 'top', 
        padding: 10,
        fontSize: height * 0.02
    }, 
    button: {
        backgroundColor: "darkseagreen",
        width: "30%",
        height: "8%",
        justifyContent: "center",
        margin: "4%"
    },
    buttonText: {
        textAlign: "center",
        fontSize: width * 0.08
    },
    scrollView: {
        backgroundColor: "white",
        padding: "4%",
        width: "100%"
    },
    scrollViewText: {
        fontSize: height * 0.02
    },
    disabledButton: {
        backgroundColor: "gray"  
    }
});

export default interactScreen;
