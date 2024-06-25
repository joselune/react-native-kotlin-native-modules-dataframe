import { StyleSheet, View, NativeModules, ScrollView, Text, ActivityIndicator, Button } from "react-native"
import { DataHeaders } from "./DataHeaders"
import { useEffect, useState } from "react"
import { TableDataframe } from "./TableDataFrame"

const { nativeDataFrame } = NativeModules

export const DataLoadedBody = () => {

    const [headers, setHeaders] = useState([])
    const [dataframe, setDataFrame] = useState({})

    const [dataLoaded, setDataLoaded] = useState(false)

    const getColumns = async () => {
        try {

            const cols = await nativeDataFrame.getColumns()
            const df = await nativeDataFrame.getDataframePag(15) || []
            setHeaders(cols)
            setDataFrame(df)

            // const slicedDf = cols.reduce((prev, curr) => {
            //     return { ...prev, [curr]: df[curr].slice(0, 15) }
            // }, {})

            // setPagination(slicedDf)


        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getColumns()
        setDataLoaded(true)
    }, [])

    const loadMore = async () => {
        // setPagination(old => {

        //     const newVals = headers.reduce((prev, curr, index) => {
        //         const headerName = headers[index]
        //         const newValues = dataframe[headerName].slice(prev[headerName]?.length, prev[headerName]?.length + 10)
        //         const oldValues = prev[headerName]
        //         return { ...prev, [headerName]: [...oldValues, ...newValues] }
        //     }, old)

        //     return newVals
        // }
        // )
        const newSlice = await nativeDataFrame.getDataframePag(50)

        headers.forEach(c => {
            const oldValues = dataframe[c]
            const newValues = [...oldValues, ...newSlice[c]]
            setDataFrame(old => ({ ...old, [c]: newValues }))
        });

    }


    return (
        <View style={styles.container}>
            {
                !dataLoaded ?
                    <ActivityIndicator />
                    :
                    <ScrollView>
                        <ScrollView horizontal>
                            <TableDataframe columns={headers} dataframe={dataframe} />
                        </ScrollView>
                        <Button title="Load more" onPress={loadMore} />
                    </ScrollView>
            }
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        flex: 1,
        paddingBottom: 20
        // height: 50
    },
    scrollViewContainer: {
        // height: "100%",
        // width: "100%",
        // flex: 1,
        // flexDirection: "row"
    },
})