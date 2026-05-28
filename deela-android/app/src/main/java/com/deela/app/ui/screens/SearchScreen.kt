package com.deela.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.deela.app.data.model.MockData
import com.deela.app.ui.theme.*

@Composable
fun SearchScreen(onBackClick: () -> Unit = {}, onProductClick: (String) -> Unit = {}) {
    val filters = listOf("Best", "Cheapest", "Top Rated", "Best Selling")
    val product = MockData.products.firstOrNull()

    Column(modifier = Modifier.fillMaxSize().background(Color.White)) {
        Row(modifier = Modifier.fillMaxWidth().padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onBackClick) {
                Icon(imageVector = Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = Charcoal)
            }
            Row(
                modifier = Modifier.weight(1f).clip(RoundedCornerShape(50)).background(Bg).padding(horizontal = 14.dp, vertical = 10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                SimpleText(text = "S", size = 16, color = TextDark)
                Spacer(modifier = Modifier.width(8.dp))
                SimpleText(text = "Results: Bluetooth Headphones", size = 14, color = TextDark)
            }
            Spacer(modifier = Modifier.width(10.dp))
            Box(modifier = Modifier.size(36.dp).clip(CircleShape).background(Bg), contentAlignment = Alignment.Center) {
                SimpleText(text = "F", size = 14, color = TextDark)
            }
        }

        Row(
            modifier = Modifier.horizontalScroll(rememberScrollState()).padding(horizontal = 16.dp, vertical = 4.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            filters.forEachIndexed { i, filter ->
                val isActive = i == 0
                Box(
                    modifier = Modifier.clip(RoundedCornerShape(50)).background(if (isActive) Purple else Color.White).padding(horizontal = 16.dp, vertical = 7.dp)
                ) {
                    SimpleText(text = filter, size = 12, color = if (isActive) Color.White else TextDark)
                }
            }
        }

        if (product != null) {
            Column(
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp).clip(RoundedCornerShape(16.dp)).background(Color.White)
            ) {
                Row(modifier = Modifier.padding(14.dp)) {
                    Box(
                        modifier = Modifier.size(95.dp).clip(RoundedCornerShape(12.dp)).background(Bg),
                        contentAlignment = Alignment.Center
                    ) {
                        SimpleText(text = product.emoji, size = 38, color = Charcoal)
                    }
                    Spacer(modifier = Modifier.width(14.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Box(modifier = Modifier.background(Purple, RoundedCornerShape(5.dp)).padding(horizontal = 9.dp, vertical = 3.dp)) {
                            SimpleText(text = "Best", size = 10, bold = true, color = Color.White)
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        SimpleText(text = product.name, size = 13, bold = true, color = TextDark)
                        SimpleText(text = "S " + product.rating + " (" + product.reviews + ")", size = 11, color = TextGray)
                        SimpleText(text = product.platforms.firstOrNull()?.name ?: "Shopee", size = 11, color = TextGray)
                    }
                }
            }
        }
    }
}

@Composable
private fun SimpleText(text: String, size: Int, bold: Boolean = false, color: Color = TextDark) {
    Text(text = text, fontSize = size.sp, fontWeight = if (bold) FontWeight.Bold else FontWeight.Normal, color = color)
}