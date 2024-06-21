package com.example.withnewarch
import android.util.Base64
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import org.jetbrains.kotlinx.dataframe.DataFrame
import org.jetbrains.kotlinx.dataframe.api.colsOf
import org.jetbrains.kotlinx.dataframe.api.convert
import org.jetbrains.kotlinx.dataframe.api.convertToDouble
import org.jetbrains.kotlinx.dataframe.api.convertToInt
import org.jetbrains.kotlinx.dataframe.api.convertToString
import org.jetbrains.kotlinx.dataframe.api.count
import org.jetbrains.kotlinx.dataframe.api.fillNulls
import org.jetbrains.kotlinx.dataframe.api.getRows
import org.jetbrains.kotlinx.dataframe.api.isEmpty
import org.jetbrains.kotlinx.dataframe.api.meanOf
import org.jetbrains.kotlinx.dataframe.api.rowMeanOf
import org.jetbrains.kotlinx.dataframe.api.select
import org.jetbrains.kotlinx.dataframe.api.toMap
import org.jetbrains.kotlinx.dataframe.api.values
import org.jetbrains.kotlinx.dataframe.api.with
import org.jetbrains.kotlinx.dataframe.io.readCSV
import java.io.File
import java.io.FileOutputStream

class DataFrameModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private lateinit var dataFrameData: DataFrame<*>
    override fun getName() = "nativeDataFrame"

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun loadDataframe(data: String): Int{
        dataFrameData = generateDataframe(data)
        dataFrameData.fillNulls { colsOf<Int?>() }.with { it ->
            it?.let {
                dataFrameData[it].rowMeanOf<Int>().toInt()
            }
        }
        dataFrameData.fillNulls { colsOf<String?>() }.with { "" }
        return dataFrameData.count()
    }

    @ReactMethod
    fun getColumns() = safeGuardDataFrame {
        val arr = Arguments.createArray()
        val colNames = dataFrameData.columnNames()
        for(col in colNames){
            arr.pushString(col)
        }
        arr
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getDataFrame() = safeGuardDataFrame {
        val columns = dataFrameData.columnNames()
        val objetValues = Arguments.createMap()
        for (col in columns){
            val values = dataFrameData.select(col).toMap()

            val content = Arguments.createArray()


            values[col]!!.forEach { value ->

                value?.let { v ->
                    when(v){
                        is Int -> content.pushInt(v)
                        is Double -> content.pushDouble(v)
                        is String -> content.pushString(v)
                        else -> throw Exception("Type not valid")
                    }
                }

            }

            objetValues.putArray(col, content)
        }

        objetValues
    }

    @ReactMethod
    fun convert(column: String, to: String) = safeGuardDataFrame {
        dataFrameData.convert{
            when(to){
                "int" -> it[column].convertToInt()
                "double" -> it[column].convertToDouble()
                "string" -> it[column].convertToString()
                else -> throw Exception("Type not valid")
            }
        }
        0
    }

    private fun <T> safeGuardDataFrame(callback: () -> T): T{
        if(dataFrameData.isEmpty()){
            throw Exception("Dataframe is not initialized")
        }
        return callback()
    }

    private fun generateDataframe(data: String): DataFrame<*> {
        val base64 = Base64.decode(data, Base64.DEFAULT)
        val file = byteArrToFile(base64)
        return DataFrame.readCSV(file, delimiter = ';')
    }

    private fun byteArrToFile(file: ByteArray): File {
        val f = File(reactContext.cacheDir, "titanic.csv")
        val fos = FileOutputStream(f)
        fos.write(file)
        fos.close()
        return f
    }

    private fun log(value: Any) {
        when(value){
            is Double -> Log.d("ReactNative", value.toString())
            is Int -> Log.d("ReactNative", value.toString())
            is String -> Log.d("ReactNative", value)
            is List<*> -> {
                if(value.all {it is String}){
                    Log.d("ReactNative", value.joinToString(", "))
                }
            }
            else -> Log.d("ReactNative", "not value")
        }
    }

    private fun log(value: String){
        Log.d("ReactNative", value)
    }
}