import { RootState } from '@/redux/store';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Image, StyleSheet, Platform, View, Text, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { LineChart } from "react-native-gifted-charts";

import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const route = useRouter();
  const data = useSelector((state: RootState) => state.dataSlice.dataPoint);
  
  const purchasePrice = data.map(item => 
    (parseFloat(item[1]) + parseFloat(item[2]) + parseFloat(item[3]) + parseFloat(item[4])) / 4
  );

  const tradingDecision = useSelector((state: RootState) => state.dataSlice.tradingDecisions);
  
  let i = false
  let totalBuy = 0
  let buyVolume = 0
  let history = []
  let totalRevenue = 0
  for (const item of tradingDecision) {
    if (item.purchaseType == "buy") {
      i = true
      let hold = 1
      while (purchasePrice[item.purchasePoint] * hold < 100) {
        hold *= 10
      }
      totalBuy += purchasePrice[item.purchasePoint] * hold
      buyVolume += hold
    } else if ((item.purchaseType == "sale") && (i == true)) {
      
      let salePrice = purchasePrice[item.purchasePoint] * buyVolume
      history.push({
        buy: parseFloat(totalBuy.toFixed(2)),
        sale: parseFloat(salePrice.toFixed(2)),
        profit: parseFloat((salePrice - totalBuy).toFixed(2))
      });
      totalRevenue += (salePrice - totalBuy)
      i = false
      buyVolume = 0
      totalBuy = 0
    }
  }
  totalRevenue = parseFloat((totalRevenue).toFixed(2))

  const prices = useMemo(() => {
    const openPrice: { value: any; dataPointText: string; }[] = [];
    const highPrice: { value: any; dataPointText: string; }[] = [];
    const lowPrice: { value: any; dataPointText: string; }[] = [];
    const closePrice: { value: any; dataPointText: string; }[] = [];

    let minValue = Infinity; 
    let maxValue = -Infinity; 
    const startPoint = 1;     
    const endPoint = 100;   
  
    data.forEach(item => {
      if (item.length === 12) {
        for (let i = 1; i <= 4; i++) {
          minValue = Math.min(minValue, item[i]);
          maxValue = Math.max(maxValue, item[i]);
        }
      }
    });

    data.forEach(item => {
      if (item.length === 12) {
        openPrice.push({ value: startPoint + ((item[1] - minValue) * (endPoint - startPoint)) / (maxValue - minValue), dataPointText: `${item[1]}` });
        highPrice.push({ value: startPoint + ((item[2] - minValue) * (endPoint - startPoint)) / (maxValue - minValue), dataPointText: `${item[2]}` });
        lowPrice.push({ value: startPoint + ((item[3] - minValue) * (endPoint - startPoint)) / (maxValue - minValue), dataPointText: `${item[3]}` });
        closePrice.push({ value: startPoint + ((item[4] - minValue) * (endPoint - startPoint)) / (maxValue - minValue), dataPointText: `${item[4]}` });
      }
    });

    return { openPrice, highPrice, lowPrice, closePrice };
  }, [data]);

  return (
    <View style={styles.container}>
      <View style={styles.headerTextContainer}>
        <Text style={styles.title}>TRADING STIMULATOR</Text>
      </View>
      <View style={styles.headerContentContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => { route.push('/') }}>
                <Text style={styles.buttonText}>Return to Menu</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={() => { route.push('/interactScreen') }}>
                <Text style={styles.buttonText}>Ask ChatGPT</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.graphContainer}> 
            <LineChart
              data={prices.openPrice}
              data2={prices.highPrice}
              data3={prices.lowPrice}
              data4={prices.closePrice}
              showVerticalLines
              spacing={44}
              initialSpacing={0}
              color1="#00ccff"  
              color2="#4dff4d" 
              color3="#ff3333"
              color4="#d2a679"
              textColor1="green"
              dataPointsHeight={6}
              dataPointsWidth={6}
              dataPointsColor1="#006680"
              dataPointsColor2="#006600"
              dataPointsColor3="#800000"
              dataPointsColor4="#86592d"
              textShiftY={-5}
              textShiftX={-5}
              textFontSize={13}
              />
              <View style={styles.labelContainer}>
                <View style={styles.labelColorDisplay1}>
                  <Text style={styles.labelColorText1}>Open Price</Text>
                </View>

                <View style={styles.labelColorDisplay2}>
                  <Text style={styles.labelColorText2}>High Price</Text>
                </View>
                
                <View style={styles.labelColorDisplay3}>
                  <Text style={styles.labelColorText3}>Low Price</Text>
                </View>

                <View style={styles.labelColorDisplay4}>
                  <Text style={styles.labelColorText4}>Close Price</Text>
                </View>
              </View>
                <ScrollView>
                    <View style={styles.table}>
                    <View style={styles.rowHeader}>
                      <Text style={styles.headerCell}>Buy</Text>
                      <Text style={styles.headerCell}>Sale</Text>
                      <Text style={styles.headerCell}>Profit</Text>
                    </View>
                    {history.map((item, index) => (
                      <View key={index} style={item.profit > 0 ? styles.rowPositive : styles.rowNegative} >
                        <Text style={styles.cell}>{`${item.buy}$`}</Text>
                        <Text style={styles.cell}>{`${item.sale}$`}</Text>
                        <Text style={styles.cell}>{`${item.profit}$`}</Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
                <Text style={styles.totalRevenue}>{`Total Revenue: ${totalRevenue}$`}</Text>
            </View>
      </View>

    </View>    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lavender",
  },
  headerTextContainer: {
    alignItems: "center",
    paddingVertical: "8%",
  },
  title: {
    color: "grey",
    fontSize: width * 0.1,
    textAlign: "center",
  },
  headerContentContainer: {
    width: "100%",
    height: "30%",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1%",
  },
  buttonContainer: {
    width: width * 0.25,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "stretch",
  },
  button: { 
    backgroundColor: "darkseagreen",
    width: "180%",
    height: "50%",
    margin: "10%",
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
    fontSize: width * 0.05,
    fontWeight: "500",
    color: "black",
  },
  graphContainer: {
    width: "100%",
    backgroundColor: "white",
  },
  table: {
    margin: width * 0.01,
    borderWidth: 2,
    borderColor: 'lightslategrey',
  },
  rowHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderWidth: 1,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rowPositive: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: "#67d66f"
  },
  rowNegative: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: "#f26a6a"
  },  
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  totalRevenue: {
    fontSize: width * 0.06,
    paddingTop: "3%",
  },
  labelContainer: {
    flexDirection: "row",
    padding: "1%", 
    justifyContent: "center",
    alignItems: "center",
  },
  labelColorDisplay1: {
    width: "23%",
    backgroundColor: "#00ccff",
    marginRight: "3%",
  },
  labelColorDisplay2: {
    width: "23%",
    backgroundColor: "#4dff4d",
    marginRight: "3%",
  },
  labelColorDisplay3: {
    width: "23%",
    backgroundColor: "#ff3333",
    marginRight: "3%",
  },  
  labelColorDisplay4: {
    width: "23%",
    backgroundColor: "#d2a679",
  },
  labelColorText1: {
    padding: "4%",
    color: "#006680",
    fontWeight: "600",
  },
  labelColorText2: {
    padding: "4%",
    color: "#006600",
    fontWeight: "600",
  },
  labelColorText3: {
    padding: "4%",
    color: "#800000",
    fontWeight: "600",
  },  
  labelColorText4: {
    padding: "4%",
    color: "#86592d",
    fontWeight: "600",
  },

});
