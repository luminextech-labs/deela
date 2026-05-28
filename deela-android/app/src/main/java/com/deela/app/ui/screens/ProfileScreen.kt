package com.deela.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.deela.app.ui.theme.*

@Composable
fun ProfileScreen() {
    Column(modifier = Modifier.fillMaxSize().background(Bg).padding(16.dp)) {
        SimpleText(text = "Profile", size = 20, bold = true, color = Charcoal)
        Spacer(modifier = Modifier.height(12.dp))
        Row(
            modifier = Modifier.fillMaxWidth().clip(RoundedCornerShape(16.dp)).background(Color.White).padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(modifier = Modifier.size(56.dp).clip(CircleShape).background(Purple), contentAlignment = Alignment.Center) {
                SimpleText(text = "N", size = 22, bold = true, color = Color.White)
            }
            Spacer(modifier = Modifier.width(14.dp))
            Column(modifier = Modifier.weight(1f)) {
                SimpleText(text = "Nattawat", size = 16, bold = true, color = Charcoal)
                SimpleText(text = "nattawat@deela.app", size = 12, color = TextGray)
            }
            SimpleText(text = "Edit", size = 14, color = Purple)
        }
        Spacer(modifier = Modifier.height(16.dp))
        ProfileMenuItem(icon = "O", label = "Orders", sub = "Track orders")
        ProfileMenuItem(icon = "L", label = "Saved", sub = "Wishlist")
        ProfileMenuItem(icon = "A", label = "Price Alerts", sub = "View alerts")
        ProfileMenuItem(icon = "S", label = "Settings", sub = "Notifications account")
        ProfileMenuItem(icon = "H", label = "Help", sub = "FAQ contact")
        ProfileMenuItem(icon = "D", label = "About Deela", sub = "Version 1.0.0")
        Spacer(modifier = Modifier.height(12.dp))
        Box(modifier = Modifier.fillMaxWidth().clip(RoundedCornerShape(12.dp)).background(Color(0xFFFEE2E2)).padding(14.dp), contentAlignment = Alignment.Center) {
            SimpleText(text = "Sign Out", size = 14, bold = true, color = Red)
        }
        Spacer(modifier = Modifier.height(30.dp))
    }
}

@Composable
private fun ProfileMenuItem(icon: String, label: String, sub: String) {
    Row(
        modifier = Modifier.fillMaxWidth().clip(RoundedCornerShape(12.dp)).background(Color.White).padding(14.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        SimpleText(text = icon, size = 20, color = Charcoal)
        Spacer(modifier = Modifier.width(14.dp))
        Column(modifier = Modifier.weight(1f)) {
            SimpleText(text = label, size = 14, bold = true, color = Charcoal)
            SimpleText(text = sub, size = 11, color = TextGray)
        }
        SimpleText(text = ">", size = 18, color = TextLight)
    }
    Spacer(modifier = Modifier.height(8.dp))
}

@Composable
private fun SimpleText(text: String, size: Int, bold: Boolean = false, color: Color = TextDark) {
    Text(text = text, fontSize = size.sp, fontWeight = if (bold) FontWeight.Bold else FontWeight.Normal, color = color)
}