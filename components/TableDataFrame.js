import { StyleSheet, View, NativeModules, ScrollView, Text } from "react-native"

const TableCol = ({ col, count }) => {
    return (
        <View style={styles.tableCol}>
            <Text style={styles.tableHeader}>{col.title}</Text>
            <View>
                {
                    col.values?.map((v, i) => {
                        return (
                            <Text key={`${col.title}:row:${i}`} >{v}</Text>
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
        fontWeight: "bold"
    }
})