import { StyleSheet, View, Text } from "react-native"

export const DataHeaders = ({ headers = [] }) => {
    return (
        <View style={styles.container}>
            {
                headers.map(h => {
                    return (
                        <View style={styles.headerItem} key={h}>
                            <Text>{h}</Text>
                        </View>
                    )
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
    },
    headerItem: {
        paddingHorizontal: 10,
        marginHorizontal: 4,
        paddingVertical: 3,
        borderWidth: 1,
        borderRadius: 10,
    }
})