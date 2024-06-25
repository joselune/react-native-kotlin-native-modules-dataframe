import { StyleSheet, View, NativeModules, ScrollView, Text } from "react-native"

const TableCol = ({ col, count }) => {
    return (
        <View style={styles.tableCol}>
            <Text style={styles.tableHeader}>{col.title}</Text>
            <View>
                {
                    col.values?.map((v, i) => {
                        return (
                            <View style={[styles.rowItem, i % 2 == 0 ? styles.rowItemEven : {}]} key={`${col.title}:row:${i}`}>
                                <Text >{v}</Text>
                            </View>
                        )
                    })
                }
            </View>
        </View>
    )
}

// { columns, dataframe }
export const TableDataframe = ({ columns = [], dataframe = {} }) => {
    return (
        <View style={styles.table}>
            {columns?.map((col, i) => {
                const colValues = dataframe[col]

                const propVal = {
                    title: col,
                    values: colValues
                }
                return (
                    <TableCol key={`column:${col}:${i}`} col={propVal} count={i + 1} />
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    table: {
        flexDirection: "row"
    },
    tableCol: {
        paddingHorizontal: 8,
        borderRightWidth: 1,
    },
    tableHeader: {
        fontWeight: "bold",
        fontSize: 18
    },
    rowItem: {
        paddingVertical: 3,
        borderBottomWidth: 0.5
    },
    rowItemEven: {
        backgroundColor: "#e0e0e0"
    }
})