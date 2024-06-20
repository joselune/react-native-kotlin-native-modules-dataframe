import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeModules } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Asset, useAssets } from 'expo-asset'

const { nativeDataFrame } = NativeModules

export default function App() {
  const [asset, error] = useAssets([require('./assets/titanic.csv')])

  const readFile = async () => {
    const csvFile = asset[0].localUri
    FileSystem.readAsStringAsync(csvFile)
      .then(async data => {
        const base64 = 'data:text/csv;base64,' + data;
        const value = await nativeDataFrame.loadDataframe(data)
        console.log(value)
      })
      .catch(e => console.log("error reading", e))
  }
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#232526', '#66686a']}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      />
      <Button title='press' onPress={readFile} />
      <View style={{ position: 'absolute', bottom: 50, left: 0, right: 0, alignItems: 'center' }}>
        <Image
          style={{ width: 100, height: 100 }}
          contentFit="contain"
          source="https://raw.githubusercontent.com/expo/styleguide/main/common/logos/word-mark-logo.svg"
        />
      </View>

      <Image
        style={{ width: 200, height: 200 }}
        contentFit="contain"
        source="https://d33wubrfki0l68.cloudfront.net/554c3b0e09cf167f0281fda839a5433f2040b349/ecfc9/img/header_logo.svg"
      />

      <Text style={{ fontSize: 22, marginTop: 15, color: '#fff' }}>
        New Architecture: <Text style={{ fontWeight: 'bold' }}>Enabled</Text>
      </Text>

      < StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
