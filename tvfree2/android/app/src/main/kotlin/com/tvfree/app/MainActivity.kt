package com.tvfree.app

import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val tv = TextView(this).apply {
            text = "TV Free - Loading..."
            textSize = 20f
            setPadding(50, 50, 50, 50)
        }
        setContentView(tv)
    }
}