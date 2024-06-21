import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { NativeModules } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Asset, useAssets } from 'expo-asset'
import { useState } from 'react';
import { DataLoadedBody } from './components/DataLoadedBody';

const { nativeDataFrame } = NativeModules

export default function App() {
  const [asset, error] = useAssets([require('./assets/titanic.csv')])

  const [dataLoading, setDataLoading] = useState(false)
  const [hasData, setHasData] = useState(false)
  const [renderData, setRenderData] = useState(false)

  const readFile = async () => {
    const csvFile = asset[0].localUri
    setDataLoading(true)
    FileSystem.readAsStringAsync(csvFile, { encoding: FileSystem.EncodingType.Base64 })
      .then(async data => {
        await nativeDataFrame.loadDataframe(data)
        setHasData(true)
      })
      .catch(e => console.log("error reading", e))
      .finally(() => {
        setDataLoading(false)
      })
  }

  let body = (
    <View style={styles.container}>
      {
        !hasData ?
          <Button title='Load data' onPress={readFile} />
          :
          <Button title='Render Dataframe' onPress={() => setRenderData(true)} />
      }
    </View>
  )

  if (dataLoading) {
    body = <ActivityIndicator size="large" />
  }

  if (renderData) {
    body = <DataLoadedBody />
  }


  return (
    <>
      {body}
      < StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
