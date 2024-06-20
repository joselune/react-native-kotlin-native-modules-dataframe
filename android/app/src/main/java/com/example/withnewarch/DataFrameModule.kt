package com.example.withnewarch
import android.util.Base64
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import org.jetbrains.kotlinx.dataframe.DataFrame
import org.jetbrains.kotlinx.dataframe.api.count
import org.jetbrains.kotlinx.dataframe.api.isEmpty
import org.jetbrains.kotlinx.dataframe.io.read
import org.jetbrains.kotlinx.dataframe.io.readCSV
import java.io.File
import java.io.FileOutputStream

class DataFrameModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private lateinit var dataFrameData: DataFrame<*>
    override fun getName() = "nativeDataFrame"

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun loadDataframe(data: String): Int{
        dataFrameData = generateDataframe(data)
        return dataFrameData.count()
    }

    @ReactMethod
    fun pingDataframe(): Int{
        if(dataFrameData.isEmpty()){
            return 0
        }
        return dataFrameData.rowsCount()
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
}