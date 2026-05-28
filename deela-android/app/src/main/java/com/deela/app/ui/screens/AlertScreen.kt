package com.deela.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.deela.app.ui.theme.*

@Composable
fun AlertScreen() {
    val priceState = remember { mutableStateOf("") }
    Column(modifier = Modifier.fillMaxSize().background(Bg).padding(16.dp)) {
        Text(text = "แจ้งเตือนราคา", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Charcoal)
        Spacer(modifier = Modifier.height(12.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            OutlinedTextField(
                value = priceState.value,
                onValueChange = { priceState.value = it },
                placeholder = { Text(text = "ราคาเป้าหมาย...") },
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(10.dp),
                singleLine = true
            )
            Spacer(modifier = Modifier.width(10.dp))
            Button(onClick = {}, colors = ButtonDefaults.buttonColors(containerColor = Purple), shape = RoundedCornerShape(10.dp)) {
                Text(text = "บันทึก", fontSize = 14.sp)
            }
        }
        Spacer(modifier = Modifier.height(16.dp))
        Text(text = "รายการแจ้งเตือน", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Charcoal)
        Spacer(modifier = Modifier.height(8.dp))
        Row(
            modifier = Modifier.fillMaxWidth().clip(RoundedCornerShape(14.dp)).background(Color.White).border(1.dp, CardBorder, RoundedCornerShape(14.dp)).padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(text = "🎧", fontSize = 28.sp)
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(text = "หูฟังบลูทูธ", fontSize = 13.sp, fontWeight = FontWeight.Medium, color = Charcoal)
                Text(text = "เป้า: ฿600 | ปัจจุบัน: ฿690", fontSize = 11.sp, color = TextGray)
            }
        }
        Spacer(modifier = Modifier.height(8.dp))
        Row(
            modifier = Modifier.fillMaxWidth().clip(RoundedCornerShape(14.dp)).background(Color.White).border(1.dp, CardBorder, RoundedCornerShape(14.dp)).padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(text = "📱", fontSize = 28.sp)
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(text = "iPhone 15", fontSize = 13.sp, fontWeight = FontWeight.Medium, color = Charcoal)
                Text(text = "เป้า: ฿25000 | ปัจจุบัน: ฿27900", fontSize = 11.sp, color = TextGray)
            }
        }
        Spacer(modifier = Modifier.height(30.dp))
    }
}